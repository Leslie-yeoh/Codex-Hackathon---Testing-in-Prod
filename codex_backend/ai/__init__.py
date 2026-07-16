import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from codex_backend.ai.vlm_client import GeminiVLMClient, NVIDIAVLMClient, SyncGeminiVLMClient, SyncNVIDIAVLMClient, VLMResponse
from codex_backend.ai.preprocessor import HandwritingPreprocessor, preprocess_handwriting
from codex_backend.ai.prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE, MEDICAL_ABBREVIATIONS
from codex_backend.ai.workflow import DoctorHandwritingWorkflow, ProcessingResult, create_workflow
from codex_backend.db.mongo_ocr import MongoDBClient

__all__ = [
    "GeminiVLMClient",
    "NVIDIAVLMClient",
    "SyncGeminiVLMClient",
    "SyncNVIDIAVLMClient",
    "VLMResponse",
    "HandwritingPreprocessor",
    "preprocess_handwriting",
    "SYSTEM_PROMPT",
    "USER_PROMPT_TEMPLATE",
    "MEDICAL_ABBREVIATIONS",
    "DoctorHandwritingWorkflow",
    "ProcessingResult",
    "create_workflow",
    "MongoDBClient",
]

