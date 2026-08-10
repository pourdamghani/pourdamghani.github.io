import datetime as dt
import unittest

from scripts.update_related_deadlines import extract_candidates, parse_entries


class DeadlineScraperTests(unittest.TestCase):
    def test_prefers_full_paper_over_abstract_and_notification(self):
        page = """
        <h2>Important dates</h2>
        <p>Abstract submission deadline: October 1, 2026</p>
        <p>Full paper submission deadline: October 8, 2026 (AoE)</p>
        <p>Acceptance notification: December 18, 2026</p>
        """
        candidates, _ = extract_candidates(
            page,
            "https://example.org/call-for-papers",
            dt.date(2026, 8, 10),
        )
        best = max(candidates, key=lambda item: (item.score, item.date))
        self.assertEqual(dt.date(2026, 10, 8), best.date)

    def test_infers_deadline_year_before_conference(self):
        page = """
        <h1>Conference 8-12 March 2027</h1>
        <p>Deadline for paper submission: October 11, 23:59 AoE</p>
        """
        candidates, _ = extract_candidates(
            page,
            "https://example.org/event/2027",
            dt.date(2026, 8, 10),
        )
        self.assertEqual([dt.date(2026, 10, 11)], [item.date for item in candidates])

    def test_ignores_old_and_non_submission_dates(self):
        page = """
        <p>Paper submission deadline: February 1, 2025</p>
        <p>Camera-ready deadline: September 9, 2026</p>
        <p>Registration deadline: September 12, 2026</p>
        """
        candidates, _ = extract_candidates(
            page,
            "https://example.org/cfp",
            dt.date(2026, 8, 10),
        )
        self.assertEqual([], candidates)

    def test_pairs_responsive_grid_labels_with_dates(self):
        page = """
        <div><p><b>Abstract submission deadline:</b></p></div>
        <div><p><b>Submission deadline:</b></p></div>
        <div><p><b>Notification to authors:</b></p></div>
        <div><p><b>Conference dates:</b></p></div>
        <div><p>September 2, 2026</p></div>
        <div><p>September 4, 2026</p></div>
        <div><p>November 6, 2026</p></div>
        <div><p>January 10, 2027</p></div>
        """
        candidates, _ = extract_candidates(
            page,
            "https://example.org/",
            dt.date(2026, 8, 10),
        )
        self.assertEqual([dt.date(2026, 9, 4)], [item.date for item in candidates])

    def test_parses_entries_without_reformatting_yaml(self):
        raw = """categories:
  - title: Networking
    conferences:
      - title: Example Conference
        acronym: EX
        rank: A
        next_submission_deadline: "Not announced"
        deadline_announced: false
        deadline_source: "https://example.org/"
"""
        entries = parse_entries(raw)
        self.assertEqual(1, len(entries))
        self.assertEqual("EX", entries[0].acronym)
        self.assertEqual("https://example.org/", entries[0].fields["deadline_source"])


if __name__ == "__main__":
    unittest.main()
