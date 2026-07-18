"""Dashboard MongoDB cache checks."""

from datetime import datetime, time, timezone
from types import SimpleNamespace
from unittest import TestCase

from codex_backend.db.mongo_ocr import MongoDBClient


class _Files:
    def __init__(self):
        self.find_calls = 0
        self.aggregate_calls = 0

    def find(self, *_args):
        self.find_calls += 1
        return [{"uploadDate": datetime.combine(datetime.now(timezone.utc).date(), time.min)}]

    def aggregate(self, *_args):
        self.aggregate_calls += 1
        return iter([{"count": 1, "average_time": 123, "errors": 0}])


class DashboardCacheTests(TestCase):
    def setUp(self):
        self.files = _Files()
        self.client = MongoDBClient()
        self.client.client = object()
        self.client.db = SimpleNamespace(fs=SimpleNamespace(files=self.files))

    def test_dashboard_mongo_results_are_reused_from_cache(self):
        self.assertEqual(self.client.get_weekly_ocr_volume(), self.client.get_weekly_ocr_volume())
        self.assertEqual(self.files.find_calls, 1)

        self.assertEqual(self.client.get_ocr_system_conditions(), self.client.get_ocr_system_conditions())
        self.assertEqual(self.files.aggregate_calls, 1)


if __name__ == "__main__":
    import unittest

    unittest.main()