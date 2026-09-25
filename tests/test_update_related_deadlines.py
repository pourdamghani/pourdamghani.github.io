import datetime as dt
import importlib.util
from pathlib import Path
import sys
import unittest
from unittest import mock


SCRIPT = Path(__file__).parents[1] / "scripts" / "update_related_deadlines.py"
SPEC = importlib.util.spec_from_file_location("update_related_deadlines", SCRIPT)
deadlines = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
sys.modules[SPEC.name] = deadlines
SPEC.loader.exec_module(deadlines)


class DeadlineUpdaterTests(unittest.TestCase):
    def test_ignores_past_round_and_chooses_earliest_upcoming_round(self):
        html = """
        <p>Paper submission deadline: July 10, 2026</p>
        <p>Paper submission deadline: October 9, 2026</p>
        <p>Paper submission deadline: January 11, 2027</p>
        """
        candidates, _parser = deadlines.extract_candidates(
            html,
            "https://www.sigmetrics.org/sigmetrics2027/pages/cfp.html",
            dt.date(2026, 9, 25),
        )

        self.assertEqual(
            deadlines.choose_candidate(candidates).date,
            dt.date(2026, 10, 9),
        )

    def test_uses_replacement_date_on_explicit_extension(self):
        html = "<p>Paper submission deadline extended from October 8, 2026 to October 15, 2026.</p>"
        candidates, _parser = deadlines.extract_candidates(
            html,
            "https://example.org/cfp",
            dt.date(2026, 9, 25),
        )

        self.assertEqual(
            deadlines.choose_candidate(candidates).date,
            dt.date(2026, 10, 15),
        )

    def test_expires_announced_deadline_when_no_new_date_is_found(self):
        raw = """categories:
  - title: Networking
    conferences:
      - title: IEEE International Conference on Computer Communications
        acronym: INFOCOM
        next_submission_deadline: "2026-07-31"
        deadline_announced: true
        deadline_for: "INFOCOM 2027 main paper"
        deadline_source: "https://example.org/infocom27"
"""
        entries = deadlines.parse_entries(raw)
        results = [deadlines.Result("INFOCOM", entries[0].title, "not-found")]

        updated, count = deadlines.apply_results(
            raw, entries, results, dt.date(2026, 9, 25)
        )

        self.assertEqual(count, 1)
        self.assertIn('next_submission_deadline: "Not announced"', updated)
        self.assertIn("deadline_announced: false", updated)
        self.assertIn('last_submission_deadline: "2026-07-31"', updated)
        self.assertIn('last_deadline_source: "https://example.org/infocom27"', updated)

    def test_infocom_uses_main_conference_cfp_path(self):
        self.assertEqual(
            deadlines.SOURCE_TEMPLATES["INFOCOM"],
            ("https://infocom{year}.ieee-infocom.org/call-papers-main-conference",),
        )

    def test_infocom_only_crawls_the_expected_edition_cfp(self):
        raw = """categories:
  - title: Networking
    conferences:
      - title: IEEE International Conference on Computer Communications
        acronym: INFOCOM
        next_submission_deadline: "Not announced"
        deadline_announced: false
        deadline_for: "INFOCOM 2028 main paper"
        deadline_source: "https://ieee-infocom.org/"
        last_deadline_source: "https://example.org/infocom2027"
"""
        entry = deadlines.parse_entries(raw)[0]

        self.assertEqual(
            deadlines.candidate_urls(entry, dt.date(2026, 9, 25)),
            ["https://infocom2028.ieee-infocom.org/call-papers-main-conference"],
        )

    def test_infocom_rejects_date_from_wrong_edition_page(self):
        raw = """categories:
  - title: Networking
    conferences:
      - title: IEEE International Conference on Computer Communications
        acronym: INFOCOM
        next_submission_deadline: "Not announced"
        deadline_announced: false
        deadline_for: "INFOCOM 2028 main paper"
        deadline_source: "https://ieee-infocom.org/"
"""
        entry = deadlines.parse_entries(raw)[0]
        unrelated_page = """
        <h1>IEEE INFOCOM 2027</h1>
        <p>Paper submission deadline: October 9, 2026</p>
        """

        with mock.patch.object(
            deadlines,
            "fetch",
            return_value=(unrelated_page, "https://ieee-infocom.org/"),
        ):
            result = deadlines.discover(
                entry, dt.date(2026, 9, 25), timeout=1, max_pages=1
            )

        self.assertEqual(result.status, "not-found")
        self.assertIsNone(result.candidate)


if __name__ == "__main__":
    unittest.main()
