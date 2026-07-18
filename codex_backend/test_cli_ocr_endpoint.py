"""CLI OCR route checks."""

import asyncio
from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import AsyncMock, patch

from codex_backend.routers.ocr_router import CLI_USER, ocr_handwriting_cli
from codex_backend.services.ocr import OCRResponse


class _Storage:
    def __init__(self):
        self.events = []

    def log_audit_event(self, *event):
        self.events.append(event)


class CLIOCREndpointTests(TestCase):
    def test_cli_upload_uses_the_gui_response_and_cli_user(self):
        response = OCRResponse(
            success=True,
            natural_language="Clinical note",
            raw_text="Clinical note",
            confidence=0.9,
            low_confidence_flag=False,
            processing_time_ms=10,
            file_id="gridfs-id",
        )
        storage = _Storage()
        file = SimpleNamespace(filename="note.jpg")

        with (
            patch("codex_backend.routers.ocr_router.process_upload", new=AsyncMock(return_value=response)) as process_upload,
            patch("codex_backend.routers.ocr_router.get_ocr_storage", return_value=storage),
        ):
            result = asyncio.run(ocr_handwriting_cli(file=file, enhance=False, custom_prompt="Read this"))

        self.assertIs(result, response)
        process_upload.assert_awaited_once_with(file, CLI_USER, False, "Read this")
        self.assertEqual(storage.events[0][0], CLI_USER)


if __name__ == "__main__":
    import unittest

    unittest.main()