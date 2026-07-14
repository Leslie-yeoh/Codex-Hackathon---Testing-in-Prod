import base64
import os
from dataclasses import dataclass
from typing import Optional
import httpx
from PIL import Image
import io


@dataclass
class VLMResponse:
    text: str
    reasoning: Optional[str] = None
    usage: Optional[dict] = None
    raw_response: Optional[dict] = None


class NVIDIAVLMClient:
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://integrate.api.nvidia.com/v1",
        model: str = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
        timeout: float = 60.0,
    ):
        self.api_key = api_key or os.getenv("NVIDIA_NIM_API_KEY")
        if not self.api_key:
            raise ValueError("NVIDIA_NIM_API_KEY not provided or found in environment")
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout
        self._client = httpx.AsyncClient(
            base_url=self.base_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            timeout=self.timeout,
        )

    def _encode_image(self, image_path: str) -> str:
        with Image.open(image_path) as img:
            if img.mode != "RGB":
                img = img.convert("RGB")
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=85)
            return base64.b64encode(buffer.getvalue()).decode("utf-8")

    def _build_messages(self, image_path: str, prompt: Optional[str] = None) -> list[dict]:
        base64_image = self._encode_image(image_path)
        default_prompt = (
            "You are a medical professional specializing in reading doctor's handwriting. "
            "Analyze this handwritten medical note/prescription image carefully. "
            "Extract all text content and convert it into clear, natural medical sentences. "
            "Preserve medical terminology, dosages, frequencies, and patient instructions exactly as written. "
            "Format the output as clean, readable medical notes."
        )
        user_prompt = prompt or default_prompt
        return [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    },
                ],
            }
        ]

    async def interpret_handwriting(
        self,
        image_path: str,
        prompt: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.1,
    ) -> VLMResponse:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")

        messages = self._build_messages(image_path, prompt)

        response = await self._client.post(
            "/chat/completions",
            json={
                "model": self.model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "stream": False,
            },
        )
        response.raise_for_status()
        data = response.json()

        choice = data["choices"][0]
        message = choice["message"]
        text = message.get("content", "")
        reasoning = message.get("reasoning_content")

        return VLMResponse(
            text=text,
            reasoning=reasoning,
            usage=data.get("usage"),
            raw_response=data,
        )

    async def close(self):
        await self._client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()


class SyncNVIDIAVLMClient:
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://integrate.api.nvidia.com/v1",
        model: str = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
        timeout: float = 60.0,
    ):
        self.api_key = api_key or os.getenv("NVIDIA_NIM_API_KEY")
        if not self.api_key:
            raise ValueError("NVIDIA_NIM_API_KEY not provided or found in environment")
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout
        self._client = httpx.Client(
            base_url=self.base_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            timeout=self.timeout,
        )

    def _encode_image(self, image_path: str) -> str:
        with Image.open(image_path) as img:
            if img.mode != "RGB":
                img = img.convert("RGB")
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=85)
            return base64.b64encode(buffer.getvalue()).decode("utf-8")

    def _build_messages(self, image_path: str, prompt: Optional[str] = None) -> list[dict]:
        base64_image = self._encode_image(image_path)
        default_prompt = (
            "You are a medical professional specializing in reading doctor's handwriting. "
            "Analyze this handwritten medical note/prescription image carefully. "
            "Extract all text content and convert it into clear, natural medical sentences. "
            "Preserve medical terminology, dosages, frequencies, and patient instructions exactly as written. "
            "Format the output as clean, readable medical notes."
        )
        user_prompt = prompt or default_prompt
        return [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    },
                ],
            }
        ]

    def interpret_handwriting(
        self,
        image_path: str,
        prompt: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.1,
    ) -> VLMResponse:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")

        messages = self._build_messages(image_path, prompt)

        response = self._client.post(
            "/chat/completions",
            json={
                "model": self.model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "stream": False,
            },
        )
        response.raise_for_status()
        data = response.json()

        choice = data["choices"][0]
        message = choice["message"]
        text = message.get("content", "")
        reasoning = message.get("reasoning_content")

        return VLMResponse(
            text=text,
            reasoning=reasoning,
            usage=data.get("usage"),
            raw_response=data,
        )

    def close(self):
        self._client.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()