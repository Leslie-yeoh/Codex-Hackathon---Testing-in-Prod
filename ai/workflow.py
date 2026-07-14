import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import asyncio
import time
from dataclasses import dataclass, asdict
from typing import Optional, List
from pathlib import Path
from datetime import datetime

from ai.vlm_client import NVIDIAVLMClient, SyncNVIDIAVLMClient, VLMResponse
from ai.preprocessor import preprocess_handwriting, HandwritingPreprocessor
from db.mongo_ocr import MongoDBClient


def calculate_confidence(usage: Optional[dict], reasoning: Optional[str]) -> float:
    if not usage:
        return 0.5
    total = usage.get("total_tokens", 0)
    completion = usage.get("completion_tokens", 0)
    if total == 0:
        return 0.5
    ratio = completion / total
    if reasoning and len(reasoning) > 100:
        ratio += 0.1
    return min(max(ratio, 0.1), 0.95)


@dataclass
class ProcessingResult:
    image_path: str
    preprocessed_path: Optional[str]
    extracted_text: str
    raw_text: str
    reasoning: Optional[str]
    usage: Optional[dict]
    confidence: float
    timestamp: str
    processing_time_ms: float
    success: bool
    error: Optional[str] = None


class DoctorHandwritingWorkflow:
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
        preprocess: bool = True,
        preprocess_dir: str = "images/preprocessed",
        output_dir: str = "output",
        custom_prompt: Optional[str] = None,
        mongo_client: Optional[MongoDBClient] = None,
    ):
        self.api_key = api_key or os.getenv("NVIDIA_NIM_API_KEY")
        if not self.api_key:
            raise ValueError("NVIDIA_NIM_API_KEY not found")
        self.model = model
        self.preprocess = preprocess
        self.preprocess_dir = preprocess_dir
        self.output_dir = output_dir
        self.custom_prompt = custom_prompt
        self.mongo_client = mongo_client

        Path(self.preprocess_dir).mkdir(parents=True, exist_ok=True)
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)

    def _get_image_files(self, input_path: str) -> List[str]:
        path = Path(input_path)
        if path.is_file():
            return [str(path)]
        elif path.is_dir():
            extensions = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}
            return [str(f) for f in path.iterdir() if f.suffix.lower() in extensions]
        else:
            raise ValueError(f"Path not found: {input_path}")

    def _preprocess_image(self, image_path: str) -> Optional[str]:
        try:
            return preprocess_handwriting(image_path, self.preprocess_dir)
        except Exception as e:
            print(f"Preprocessing failed for {image_path}: {e}")
            return None

    def process_single(self, image_path: str, use_async: bool = False) -> ProcessingResult:
        start_time = time.time()
        timestamp = datetime.now().isoformat()

        try:
            process_path = image_path
            if self.preprocess:
                preprocessed = self._preprocess_image(image_path)
                if preprocessed:
                    process_path = preprocessed

            if use_async:
                return asyncio.run(self._process_async(process_path, image_path, start_time, timestamp))
            else:
                return self._process_sync(process_path, image_path, start_time, timestamp)

        except Exception as e:
            return ProcessingResult(
                image_path=image_path,
                preprocessed_path=None,
                extracted_text="",
                raw_text="",
                reasoning=None,
                usage=None,
                confidence=0.0,
                timestamp=timestamp,
                processing_time_ms=(time.time() - start_time) * 1000,
                success=False,
                error=str(e),
            )

    def _process_sync(
        self,
        process_path: str,
        original_path: str,
        start_time: float,
        timestamp: str,
    ) -> ProcessingResult:
        with SyncNVIDIAVLMClient(api_key=self.api_key, model=self.model) as client:
            response = client.interpret_handwriting(process_path, prompt=self.custom_prompt)

        processing_time = (time.time() - start_time) * 1000
        confidence = calculate_confidence(response.usage, response.reasoning)

        return ProcessingResult(
            image_path=original_path,
            preprocessed_path=process_path if process_path != original_path else None,
            extracted_text=response.text,
            raw_text=response.text,
            reasoning=response.reasoning,
            usage=response.usage,
            confidence=confidence,
            timestamp=timestamp,
            processing_time_ms=processing_time,
            success=True,
        )

    async def _process_async(
        self,
        process_path: str,
        original_path: str,
        start_time: float,
        timestamp: str,
    ) -> ProcessingResult:
        async with NVIDIAVLMClient(api_key=self.api_key, model=self.model) as client:
            response = await client.interpret_handwriting(process_path, prompt=self.custom_prompt)

        processing_time = (time.time() - start_time) * 1000
        confidence = calculate_confidence(response.usage, response.reasoning)

        return ProcessingResult(
            image_path=original_path,
            preprocessed_path=process_path if process_path != original_path else None,
            extracted_text=response.text,
            raw_text=response.text,
            reasoning=response.reasoning,
            usage=response.usage,
            confidence=confidence,
            timestamp=timestamp,
            processing_time_ms=processing_time,
            success=True,
        )

    def process_batch(self, input_path: str, use_async: bool = False) -> List[ProcessingResult]:
        image_files = self._get_image_files(input_path)
        results = []

        for img_path in image_files:
            print(f"Processing: {img_path}")
            result = self.process_single(img_path, use_async=use_async)
            results.append(result)
            self._save_result(result)

        self._save_batch_summary(results)
        return results

    def _save_result(self, result: ProcessingResult):
        filename = Path(result.image_path).stem
        output_file = Path(self.output_dir) / f"{filename}_result.json"
        with open(output_file, "w") as f:
            json.dump(asdict(result), f, indent=2)

        if self.mongo_client is not None:
            self._save_to_mongo(result)

    def _save_to_mongo(self, result: ProcessingResult):
        try:
            image_path = result.preprocessed_path or result.image_path
            if not os.path.exists(image_path):
                print(f"MongoDB: source image not found at {image_path}, skipping MongoDB save")
                return

            with open(image_path, "rb") as f:
                image_bytes = f.read()

            ext = Path(image_path).suffix.lower()
            content_type_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".bmp": "image/bmp"}
            content_type = content_type_map.get(ext, "application/octet-stream")

            self.mongo_client.save_extraction(
                image_bytes=image_bytes,
                original_path=result.image_path,
                content_type=content_type,
                result=result,
            )
        except Exception as e:
            print(f"MongoDB save failed: {e}")

    def _save_batch_summary(self, results: List[ProcessingResult]):
        summary = {
            "total_processed": len(results),
            "successful": sum(1 for r in results if r.success),
            "failed": sum(1 for r in results if not r.success),
            "total_time_ms": sum(r.processing_time_ms for r in results),
            "timestamp": datetime.now().isoformat(),
            "results": [asdict(r) for r in results],
        }
        output_file = Path(self.output_dir) / f"batch_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, "w") as f:
            json.dump(summary, f, indent=2)

    def process_and_print(self, input_path: str, use_async: bool = False):
        results = self.process_batch(input_path, use_async)
        for r in results:
            print(f"\n{'='*60}")
            print(f"Image: {r.image_path}")
            print(f"Success: {r.success}")
            print(f"Time: {r.processing_time_ms:.0f}ms")
            if r.success:
                print(f"Extracted Text:\n{r.extracted_text}")
                if r.reasoning:
                    print(f"Reasoning:\n{r.reasoning[:500]}...")
            else:
                print(f"Error: {r.error}")
        return results


def create_workflow(
    api_key: Optional[str] = None,
    mongo_uri: Optional[str] = None,
    **kwargs,
) -> DoctorHandwritingWorkflow:
    from dotenv import load_dotenv
    load_dotenv()

    mongo_client = None
    resolved_uri = mongo_uri or os.getenv("MONGODB_URI")
    if resolved_uri:
        mongo_client = MongoDBClient(uri=resolved_uri)
        mongo_client.connect()
        print("MongoDB client initialized and connected")
    return DoctorHandwritingWorkflow(api_key=api_key, mongo_client=mongo_client, **kwargs)