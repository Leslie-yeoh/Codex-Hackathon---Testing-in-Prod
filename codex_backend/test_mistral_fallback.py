"""Mistral-first OCR fallback check."""

import asyncio
from unittest import TestCase
from unittest.mock import patch

from codex_backend.ai.vlm_client import MistralVLMClient, VLMResponse
from codex_backend.ai.workflow import DoctorHandwritingWorkflow


class _Mistral:
    called = False

    def __init__(self, **_kwargs):
        pass

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        pass

    def interpret_handwriting(self, *_args, **_kwargs):
        self.__class__.called = True
        return VLMResponse(text="Mistral result", usage={"total_tokens": 2, "completion_tokens": 1})


class _UnexpectedProvider:
    def __init__(self, **_kwargs):
        raise AssertionError("A later provider was called")


class MistralFallbackTests(TestCase):
    def test_mistral_uses_a_data_url_image(self):
        client = MistralVLMClient(api_key="mistral-key")
        client._encode_image = lambda _path: "encoded-image"
        message = client._build_messages("input.jpg")[0]
        asyncio.run(client.close())

        self.assertEqual(message["content"][1]["image_url"], "data:image/jpeg;base64,encoded-image")
    def test_mistral_runs_before_gemini_and_nvidia(self):
        workflow = DoctorHandwritingWorkflow(api_key="nvidia-key", preprocess=False)
        workflow.mistral_api_key = "mistral-key"

        with (
            patch("codex_backend.ai.workflow.SyncMistralVLMClient", _Mistral),
            patch("codex_backend.ai.workflow.SyncGeminiVLMClient", _UnexpectedProvider),
            patch("codex_backend.ai.workflow.SyncNVIDIAVLMClient", _UnexpectedProvider),
        ):
            result = workflow._process_sync("input.jpg", "input.jpg", 0, "now")

        self.assertTrue(_Mistral.called)
        self.assertEqual(result.extracted_text, "Mistral result")


if __name__ == "__main__":
    import unittest

    unittest.main()