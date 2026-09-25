#!/usr/bin/env python3
"""Discover submission deadlines on official conference websites.

The script intentionally uses only Python's standard library. It crawls a small,
same-site set of likely CFP/submission pages, scores dates by their surrounding
language, and updates only the relevant fields in the existing YAML text. This
preserves comments and formatting and avoids accepting low-confidence dates such
as abstract, workshop, notification, registration, or camera-ready deadlines.

Run without --write for a report. Every site build uses --write through the npm
prebuild hook, so GitHub Pages can pick up newly announced dates without
committing generated changes back to the repository.
"""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
import dataclasses
import datetime as dt
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import ssl
import subprocess
import sys
import time
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen


USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36 "
    "RelatedDeadlineBot/1.0"
)

# Stable official pages that are more precise than a conference's generic home
# page. The crawler still follows relevant official links discovered at runtime.
SOURCE_TEMPLATES: dict[str, tuple[str, ...]] = {
    "MOBICOM": ("https://www.sigmobile.org/mobicom/{year}/cfp.html",),
    "NSDI": ("https://www.usenix.org/conference/nsdi{short_year}/call-for-papers",),
    "SIGCOMM": ("https://conferences.sigcomm.org/sigcomm/{year}/cfp/",),
    "INFOCOM": ("https://infocom{year}.ieee-infocom.org/call-papers-main-conference",),
    "IMC": ("https://conferences.sigcomm.org/imc/{year}/cfp/",),
    "CoNEXT": ("https://conferences.sigcomm.org/co-next/{year}/",),
    "IPDPS": ("https://www.ipdps.org/ipdps{year}/{year}-call-for-papers.html",),
    "ALENEX": (
        "https://www.siam.org/conferences-events/siam-conferences/alenex{short_year}/submissions/",
    ),
    "SOSA": (
        "https://www.siam.org/conferences-events/siam-conferences/sosa{short_year}/submissions/",
    ),
    "SODA": (
        "https://www.siam.org/conferences-events/siam-conferences/soda{short_year}/submissions/",
    ),
    "SIGMETRICS": ("https://www.sigmetrics.org/sigmetrics{year}/pages/cfp.html",),
}

# These conferences publish edition-specific CFP pages. Falling back to a
# generic series page can mix in unrelated events and dates (as happened when
# INFOCOM inherited SIGMETRICS' October deadline), so only crawl the expected
# edition URL and links discovered from that page.
EDITION_SCOPED_ACRONYMS = frozenset(SOURCE_TEMPLATES)

SOURCE_ROOTS: dict[str, tuple[str, ...]] = {
    "INFOCOM": ("https://ieee-infocom.org/",),
    "OPODIS": ("https://opodis26.software.imdea.org/cfp.html",),
    "IPDPS": ("https://www.ipdps.org/",),
    "UCC": ("https://ucc2026.ufsc.br/calls/call-for-papers/",),
    "ALENEX": ("https://www.siam.org/conferences-events/siam-conferences/",),
    "SOSA": ("https://www.siam.org/conferences-events/siam-conferences/",),
    "SODA": ("https://www.siam.org/conferences-events/siam-conferences/",),
    "ITCS": ("https://itcs-conf.org/",),
    "STACS": ("https://stacs-conf.org/",),
}

MONTHS = {
    "jan": 1,
    "january": 1,
    "feb": 2,
    "february": 2,
    "mar": 3,
    "march": 3,
    "apr": 4,
    "april": 4,
    "may": 5,
    "jun": 6,
    "june": 6,
    "jul": 7,
    "july": 7,
    "aug": 8,
    "august": 8,
    "sep": 9,
    "sept": 9,
    "september": 9,
    "oct": 10,
    "october": 10,
    "nov": 11,
    "november": 11,
    "dec": 12,
    "december": 12,
}
MONTH_PATTERN = "|".join(sorted(MONTHS, key=len, reverse=True))

DATE_PATTERNS = (
    re.compile(
        rf"\b(?P<month>{MONTH_PATTERN})\.?\s+(?P<day>\d{{1,2}})(?:st|nd|rd|th)?"
        rf"(?:\s*,?\s*(?P<year>20\d{{2}}))?\b",
        re.IGNORECASE,
    ),
    re.compile(
        rf"\b(?P<day>\d{{1,2}})(?:st|nd|rd|th)?\s+(?P<month>{MONTH_PATTERN})\.?,?"
        rf"(?:\s+(?P<year>20\d{{2}}))?\b",
        re.IGNORECASE,
    ),
    re.compile(r"\b(?P<year>20\d{2})[-/.](?P<month_num>\d{1,2})[-/.](?P<day>\d{1,2})\b"),
)

STRONG_POSITIVE = (
    "full paper due",
    "full paper submission",
    "full-paper submission",
    "paper submission deadline",
    "submission deadline",
    "submissions are due",
    "manuscript submission",
    "manuscripts must be submitted",
    "full manuscript",
)
WEAK_POSITIVE = ("submission", "submit", "paper due", "papers due", "deadline")
NEGATIVE = (
    "abstract",
    "artifact",
    "camera-ready",
    "camera ready",
    "notification",
    "rebuttal",
    "registration",
    "hotel",
    "workshop",
    "poster",
    "demo",
    "doctoral",
    "tutorial",
    "proposal",
)
RELEVANT_LINK = re.compile(
    r"202[6-9]|call.?for.?papers|\bcfp\b|submission|important.?dates|authors?|deadlines?",
    re.IGNORECASE,
)
IRRELEVANT_LINK = re.compile(
    r"workshop|tutorial|poster|demo|doctoral|artifact|registration|camera.?ready",
    re.IGNORECASE,
)
BLOCK_TAGS = {
    "article",
    "br",
    "dd",
    "div",
    "dt",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "li",
    "p",
    "section",
    "tr",
}
# Old deadlines are commonly retained inside strikethrough elements after an
# extension. Ignoring those elements prevents an obsolete date from winning.
SKIP_TAGS = {"script", "style", "svg", "noscript", "template", "del", "s", "strike"}


@dataclasses.dataclass(frozen=True)
class Entry:
    title: str
    acronym: str
    fields: dict[str, str]
    start: int
    end: int


@dataclasses.dataclass(frozen=True)
class Candidate:
    date: dt.date
    source: str
    score: int
    context: str


@dataclasses.dataclass
class Result:
    acronym: str
    title: str
    status: str
    candidate: Candidate | None = None
    errors: list[str] = dataclasses.field(default_factory=list)

    def as_dict(self) -> dict[str, object]:
        return {
            "acronym": self.acronym,
            "title": self.title,
            "status": self.status,
            "candidate": None
            if self.candidate is None
            else {
                "date": self.candidate.date.isoformat(),
                "source": self.candidate.source,
                "score": self.candidate.score,
                "context": self.candidate.context,
            },
            "errors": self.errors,
        }


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.links: list[tuple[str, str]] = []
        self._skip_depth = 0
        self._link_href: str | None = None
        self._link_text: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        if tag in SKIP_TAGS:
            self._skip_depth += 1
            return
        if self._skip_depth:
            return
        if tag in BLOCK_TAGS:
            self.parts.append("\n")
        if tag == "a":
            self._link_href = dict(attrs).get("href")
            self._link_text = []

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag in SKIP_TAGS:
            self._skip_depth = max(0, self._skip_depth - 1)
            return
        if self._skip_depth:
            return
        if tag == "a" and self._link_href:
            self.links.append((self._link_href, " ".join(self._link_text)))
            self._link_href = None
            self._link_text = []
        if tag in BLOCK_TAGS:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if self._skip_depth:
            return
        value = html.unescape(data)
        self.parts.append(value)
        if self._link_href:
            self._link_text.append(value)

    @property
    def lines(self) -> list[str]:
        text = "".join(self.parts).replace("\xa0", " ")
        return [re.sub(r"\s+", " ", line).strip() for line in text.splitlines() if line.strip()]


def parse_entries(raw: str) -> list[Entry]:
    starts = list(re.finditer(r"(?m)^      - title:\s*(.+?)\s*$", raw))
    entries: list[Entry] = []
    for index, match in enumerate(starts):
        end = starts[index + 1].start() if index + 1 < len(starts) else len(raw)
        # A new category ends the final conference block before the next entry.
        category = re.search(r"(?m)^  - title:", raw[match.end() : end])
        if category:
            end = match.end() + category.start()
        block = raw[match.start() : end]
        fields: dict[str, str] = {}
        for key, quoted, plain in re.findall(
            r'(?m)^        ([a-z_]+):\s*(?:"([^"]*)"|([^\n#]+))\s*$', block
        ):
            fields[key] = (quoted or plain).strip()
        acronym = fields.get("acronym", "")
        if acronym:
            entries.append(
                Entry(
                    title=match.group(1).strip().strip('"'),
                    acronym=acronym,
                    fields=fields,
                    start=match.start(),
                    end=end,
                )
            )
    return entries


def normalize_url(url: str) -> str:
    parsed = urlparse(url)
    path = re.sub(r"/{2,}", "/", parsed.path or "/")
    return urlunparse((parsed.scheme.lower(), parsed.netloc.lower(), path, "", parsed.query, ""))


def fetch(url: str, timeout: float) -> tuple[str, str]:
    request = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    context = ssl.create_default_context()
    try:
        with urlopen(request, timeout=timeout, context=context) as response:
            content_type = response.headers.get_content_type()
            if content_type not in {"text/html", "application/xhtml+xml", "text/plain"}:
                raise ValueError(f"unsupported content type {content_type}")
            body = response.read(3_000_000)
            charset = response.headers.get_content_charset() or "utf-8"
            text = body.decode(charset, errors="replace")
            final_url = response.geturl()
    except (HTTPError, URLError, TimeoutError, ValueError) as first_error:
        # curl copes with a few TLS/redirect configurations that urllib does not.
        try:
            completed = subprocess.run(
                [
                    "curl",
                    "-L",
                    "--fail",
                    "--silent",
                    "--show-error",
                    "--max-time",
                    str(max(1, int(timeout))),
                    "--user-agent",
                    USER_AGENT,
                    url,
                ],
                check=True,
                capture_output=True,
                timeout=timeout + 3,
            )
            text = completed.stdout.decode("utf-8", errors="replace")
            final_url = url
        except (subprocess.SubprocessError, OSError) as curl_error:
            raise RuntimeError(f"{first_error}; curl fallback: {curl_error}") from curl_error

    lowered = text[:20_000].lower()
    if "attention required! | cloudflare" in lowered or "you have been blocked" in lowered:
        raise RuntimeError("site returned an anti-bot challenge")
    if len(text.strip()) < 80:
        raise RuntimeError("empty or incomplete response")
    return text, final_url


def official_link(base_url: str, href: str) -> str | None:
    if not href or href.startswith(("mailto:", "javascript:", "#")):
        return None
    target = normalize_url(urljoin(base_url, href))
    base = urlparse(base_url)
    parsed = urlparse(target)
    if parsed.scheme not in {"http", "https"}:
        return None
    base_host = base.netloc.lower().removeprefix("www.")
    target_host = parsed.netloc.lower().removeprefix("www.")
    if target_host != base_host and not target_host.endswith("." + base_host):
        return None
    return target


def infer_event_month_year(lines: list[str]) -> tuple[int, int] | None:
    joined = "\n".join(lines[:120])
    pattern = re.compile(
        rf"\b\d{{1,2}}(?:\s*[-–]\s*\d{{1,2}})?\s+(?P<month>{MONTH_PATTERN})\s+(?P<year>20\d{{2}})\b",
        re.IGNORECASE,
    )
    match = pattern.search(joined)
    if not match:
        return None
    return MONTHS[match.group("month").lower().rstrip(".")], int(match.group("year"))


def date_from_match(
    match: re.Match[str], today: dt.date, event_month_year: tuple[int, int] | None
) -> dt.date | None:
    groups = match.groupdict()
    try:
        month = int(groups["month_num"]) if groups.get("month_num") else MONTHS[groups["month"].lower().rstrip(".")]
        day = int(groups["day"])
        if groups.get("year"):
            year = int(groups["year"])
        elif event_month_year:
            event_month, event_year = event_month_year
            year = event_year - 1 if month >= event_month else event_year
        else:
            year = today.year
            tentative = dt.date(year, month, day)
            if tentative < today - dt.timedelta(days=60):
                year += 1
        return dt.date(year, month, day)
    except (KeyError, TypeError, ValueError):
        return None


def context_score(line: str, url: str) -> int:
    lowered = line.lower()
    score = 0
    if any(phrase in lowered for phrase in STRONG_POSITIVE):
        score += 75
    elif "paper" in lowered and any(phrase in lowered for phrase in ("submission", "submit", "due", "deadline")):
        score += 60
    elif any(phrase in lowered for phrase in WEAK_POSITIVE):
        score += 30

    if "anywhere on earth" in lowered or re.search(r"\baoe\b", lowered):
        score += 8
    if "firm" in lowered:
        score += 3
    if any(phrase in lowered for phrase in NEGATIVE):
        # Do not penalize a line that explicitly identifies a full-paper date
        # merely because an adjacent phrase also mentions an abstract.
        if not any(phrase in lowered for phrase in STRONG_POSITIVE[:4]):
            score -= 80

    path = urlparse(url).path.lower()
    if any(token in path for token in ("call-for-paper", "call_paper", "cfp", "submission", "authors")):
        score += 12
    return score


def extract_candidates(text: str, source: str, today: dt.date) -> tuple[list[Candidate], PageParser]:
    parser = PageParser()
    parser.feed(text)
    lines = parser.lines
    event_month_year = infer_event_month_year(lines)
    candidates: list[Candidate] = []
    # A "next deadline" must never be in the past. Previously, the 45-day grace
    # period could re-announce an already closed round on every Pages build.
    lower_bound = today
    upper_bound = today + dt.timedelta(days=550)

    parsed_lines: list[list[tuple[dt.date, re.Match[str]]]] = []
    for line in lines:
        matches: list[tuple[dt.date, re.Match[str]]] = []
        for pattern in DATE_PATTERNS:
            for match in pattern.finditer(line):
                date = date_from_match(match, today, event_month_year)
                if date is not None:
                    matches.append((date, match))
        parsed_lines.append(matches)

    for index, line in enumerate(lines):
        if not parsed_lines[index]:
            continue
        score = context_score(line, source)
        context = line

        # Some responsive layouts emit a run of labels followed by a matching
        # run of date cells. Pair them by position (e.g. ITCS's four-column
        # important-dates grid) instead of treating every nearby date alike.
        if score < 35:
            run_start = index
            while run_start > 0 and parsed_lines[run_start - 1]:
                run_start -= 1
            run_end = index
            while run_end + 1 < len(lines) and parsed_lines[run_end + 1]:
                run_end += 1
            run_length = run_end - run_start + 1
            labels = [
                value
                for value in lines[max(0, run_start - max(8, run_length * 2)) : run_start]
                if not any(pattern.search(value) for pattern in DATE_PATTERNS)
                and any(term in value.lower() for term in WEAK_POSITIVE + NEGATIVE + ("conference",))
            ]
            ordinal = index - run_start
            if len(labels) >= run_length:
                label = labels[-run_length + ordinal]
                score = context_score(f"{label} {line}", source)
                context = f"{label} {line}"

        if score < 35:
            continue
        nearby = " ".join(lines[max(0, index - 1) : min(len(lines), index + 2)])
        line_matches = parsed_lines[index]
        if "extend" in line.lower() and len(line_matches) > 1:
            # "Extended from DATE to DATE" contains two equally well-described
            # dates; only the later replacement is actionable.
            latest = max(date for date, _match in line_matches)
            line_matches = [(date, match) for date, match in line_matches if date == latest]

        for date, _match in line_matches:
            if date < lower_bound or date > upper_bound:
                continue
            candidates.append(
                Candidate(
                    date=date,
                    source=source,
                    score=score,
                    context=(context + " " + nearby)[:360],
                )
            )
    return candidates, parser


def choose_candidate(candidates: list[Candidate]) -> Candidate:
    """Choose the earliest next deadline among the most reliable matches."""

    highest_score = max(candidate.score for candidate in candidates)
    strongest = [candidate for candidate in candidates if candidate.score == highest_score]
    return min(strongest, key=lambda candidate: candidate.date)


def expected_edition_year(entry: Entry, today: dt.date) -> int:
    match = re.search(r"\b(20\d{2})\b", entry.fields.get("deadline_for", ""))
    return int(match.group(1)) if match else today.year + 1


def page_matches_edition(text: str, entry: Entry, edition_year: int) -> bool:
    lowered = html.unescape(text).lower()
    return entry.acronym.lower() in lowered and str(edition_year) in lowered


def candidate_urls(entry: Entry, today: dt.date) -> list[str]:
    edition_year = expected_edition_year(entry, today)
    template_values = [
        value.format(year=edition_year, short_year=str(edition_year)[-2:])
        for value in SOURCE_TEMPLATES.get(entry.acronym, ())
    ]
    if entry.acronym in EDITION_SCOPED_ACRONYMS:
        values = template_values
    else:
        values = list(SOURCE_ROOTS.get(entry.acronym, ()))
        values.extend(
            value
            for field in ("deadline_source", "last_deadline_source")
            if (value := entry.fields.get(field)) and value.startswith(("http://", "https://"))
        )
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        normalized = normalize_url(value)
        if normalized not in seen:
            seen.add(normalized)
            result.append(normalized)
    return result


def discover(entry: Entry, today: dt.date, timeout: float, max_pages: int) -> Result:
    queue = candidate_urls(entry, today)
    queued = set(queue)
    visited: set[str] = set()
    found: list[Candidate] = []
    errors: list[str] = []
    edition_year = expected_edition_year(entry, today)

    while queue and len(visited) < max_pages:
        url = queue.pop(0)
        if url in visited:
            continue
        visited.add(url)
        try:
            body, final_url = fetch(url, timeout)
            if entry.acronym in EDITION_SCOPED_ACRONYMS and not page_matches_edition(
                body, entry, edition_year
            ):
                errors.append(
                    f"{final_url}: page does not identify {entry.acronym} {edition_year}"
                )
                continue
            candidates, parser = extract_candidates(body, final_url, today)
            if entry.acronym in EDITION_SCOPED_ACRONYMS:
                candidates = [
                    candidate
                    for candidate in candidates
                    if candidate.date.year >= edition_year - 1
                ]
            found.extend(candidates)
            for href, label in parser.links:
                joined = f"{label} {href}"
                if not RELEVANT_LINK.search(joined) or IRRELEVANT_LINK.search(joined):
                    continue
                link = official_link(final_url, href)
                if link and link not in queued and link not in visited:
                    queued.add(link)
                    queue.append(link)
        except Exception as error:  # Per-site failures must not break a daily build.
            errors.append(f"{url}: {error}")
        time.sleep(0.04)

    if not found:
        return Result(entry.acronym, entry.title, "not-found", errors=errors)

    # Prefer semantic confidence first, then the earliest actionable round. This
    # matters for conferences such as SIGMETRICS that publish several submission
    # cycles on one page. Explicit extensions are handled while extracting lines.
    best = choose_candidate(found)
    current = entry.fields.get("next_submission_deadline", "")
    announced = entry.fields.get("deadline_announced", "false").lower() == "true"
    if announced and re.fullmatch(r"\d{4}-\d{2}-\d{2}", current):
        current_date = dt.date.fromisoformat(current)
        if best.date == current_date and normalize_url(best.source) == normalize_url(
            entry.fields.get("deadline_source", best.source)
        ):
            return Result(entry.acronym, entry.title, "unchanged", best, errors)
    return Result(entry.acronym, entry.title, "update", best, errors)


def yaml_quote(value: str) -> str:
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def set_field(block: str, name: str, value: str, quoted: bool) -> str:
    rendered = yaml_quote(value) if quoted else value
    pattern = re.compile(rf"(?m)^(        {re.escape(name)}:)\s*.*$")
    if pattern.search(block):
        return pattern.sub(rf"\1 {rendered}", block, count=1)

    anchor = re.search(r"(?m)^        deadline_announced:.*$", block)
    if anchor:
        position = anchor.end()
    else:
        anchor = re.search(r"(?m)^        next_submission_deadline:.*$", block)
        position = anchor.end() if anchor else len(block.rstrip("\n"))
    return block[:position] + f"\n        {name}: {rendered}" + block[position:]


def apply_results(
    raw: str, entries: list[Entry], results: list[Result], today: dt.date
) -> tuple[str, int]:
    by_acronym = {result.acronym: result for result in results if result.status == "update" and result.candidate}
    replacements: list[tuple[int, int, str]] = []
    for entry in entries:
        result = by_acronym.get(entry.acronym)
        block = raw[entry.start : entry.end]
        old_deadline = entry.fields.get("next_submission_deadline", "")
        old_source = entry.fields.get("deadline_source", "")
        was_announced = entry.fields.get("deadline_announced", "false").lower() == "true"
        old_date = (
            dt.date.fromisoformat(old_deadline)
            if re.fullmatch(r"\d{4}-\d{2}-\d{2}", old_deadline)
            else None
        )

        if not result or not result.candidate:
            if not was_announced or old_date is None or old_date >= today:
                continue
            block = set_field(block, "last_submission_deadline", old_deadline, quoted=True)
            if old_source:
                block = set_field(block, "last_deadline_source", old_source, quoted=True)
            block = set_field(block, "next_submission_deadline", "Not announced", quoted=True)
            block = set_field(block, "deadline_announced", "false", quoted=False)
            replacements.append((entry.start, entry.end, block))
            continue

        new_deadline = result.candidate.date.isoformat()

        if was_announced and re.fullmatch(r"\d{4}-\d{2}-\d{2}", old_deadline) and old_deadline != new_deadline:
            block = set_field(block, "last_submission_deadline", old_deadline, quoted=True)
            if old_source:
                block = set_field(block, "last_deadline_source", old_source, quoted=True)

        block = set_field(block, "next_submission_deadline", new_deadline, quoted=True)
        block = set_field(block, "deadline_announced", "true", quoted=False)
        block = set_field(block, "deadline_source", result.candidate.source, quoted=True)
        replacements.append((entry.start, entry.end, block))

    for start, end, block in reversed(replacements):
        raw = raw[:start] + block + raw[end:]
    return raw, len(replacements)


def print_report(results: Iterable[Result]) -> None:
    for result in results:
        if result.candidate:
            print(
                f"{result.acronym:18} {result.status:20} "
                f"{result.candidate.date.isoformat()}  {result.candidate.source}"
            )
        else:
            print(f"{result.acronym:18} {result.status}")
        for error in result.errors:
            print(f"  warning: {error}", file=sys.stderr)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--data",
        type=Path,
        default=Path("_data/related_deadlines.yml"),
        help="deadline YAML file",
    )
    parser.add_argument("--write", action="store_true", help="update the YAML file in place")
    parser.add_argument(
        "--acronym",
        action="append",
        default=[],
        help="only scrape this acronym (repeatable)",
    )
    parser.add_argument("--today", type=dt.date.fromisoformat, default=dt.date.today())
    parser.add_argument("--timeout", type=float, default=14.0)
    parser.add_argument("--max-pages", type=int, default=5)
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--json-report", type=Path)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    raw = args.data.read_text(encoding="utf-8")
    entries = parse_entries(raw)
    selected = set(args.acronym)
    if selected:
        entries = [entry for entry in entries if entry.acronym in selected]
        missing = selected - {entry.acronym for entry in entries}
        if missing:
            print(f"Unknown acronym(s): {', '.join(sorted(missing))}", file=sys.stderr)
            return 2

    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
        results = list(
            executor.map(
                lambda entry: discover(
                    entry,
                    args.today,
                    timeout=args.timeout,
                    max_pages=max(1, args.max_pages),
                ),
                entries,
            )
        )
    print_report(results)

    if args.json_report:
        args.json_report.write_text(
            json.dumps([result.as_dict() for result in results], indent=2) + "\n",
            encoding="utf-8",
        )

    if args.write:
        updated, count = apply_results(raw, entries, results, args.today)
        if updated != raw:
            args.data.write_text(updated, encoding="utf-8")
        print(f"Updated {count} conference entr{'y' if count == 1 else 'ies'}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
