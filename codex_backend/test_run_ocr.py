"""Checks for the OCR command-line entrypoint."""

import contextlib
import io
import json
import unittest
from pathlib import Path
from unittest.mock import patch

from run_ocr import OCRResponse, main, parse_args, run_ocr


class RunOcrTests(unittest.TestCase):
    def test_parse_args_supports_underscore_options(self):
        args = parse_args(
            ["--image_path", "scan.jpg", "--no-enhance_image"]
        )

        self.assertEqual(args.image_path, "scan.jpg")
        self.assertFalse(args.enhance_image)

    @patch("run_ocr.process_image_path")
    def test_run_ocr_forwards_the_requested_preprocessing(self, process_image_path):
        image_path = Path(__file__).resolve()
        response = OCRResponse(
            success=True,
            natural_language="text",
            raw_text="text",
            confidence=0.9,
            low_confidence_flag=False,
            processing_time_ms=1.0,
        )
        process_image_path.return_value = response

        self.assertIs(run_ocr(str(image_path), False), response)
        process_image_path.assert_called_once_with(str(image_path), enhance=False)

    @patch("run_ocr.run_ocr")
    def test_main_emits_the_api_json_shape(self, mocked_run_ocr):
        mocked_run_ocr.return_value = OCRResponse(
            success=True,
            natural_language="text",
            raw_text="text",
            confidence=0.9,
            low_confidence_flag=False,
            processing_time_ms=1.0,
        )
        output = io.StringIO()

        with contextlib.redirect_stdout(output):
            self.assertEqual(main(["--image-path", "scan.jpg"]), 0)

        self.assertTrue(json.loads(output.getvalue())["success"])


if __name__ == "__main__":
    unittest.main()
