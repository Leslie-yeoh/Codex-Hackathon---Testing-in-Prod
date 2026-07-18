import base64
import os
from dataclasses import dataclass
from typing import Optional

from codex_backend.ai.prompts import USER_PROMPT_TEMPLATE
import httpx
from PIL import Image
import io
from dotenv import load_dotenv
load_dotenv()


@dataclass
class VLMResponse:
    text: str
    reasoning: Optional[str] = None
    usage: Optional[dict] = None
    raw_response: Optional[dict] = None



class GeminiVLMClient:
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://generativelanguage.googleapis.com/v1beta",
        model: str = "gemini-2.5-flash",
        timeout: float = 60.0,
    ):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not provided or found in environment")
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout
        self._client = httpx.AsyncClient(base_url=self.base_url, timeout=self.timeout)

    def _encode_image(self, image_path: str) -> str:
        with Image.open(image_path) as img:
            if img.mode != "RGB":
                img = img.convert("RGB")
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=85)
            return base64.b64encode(buffer.getvalue()).decode("utf-8")

    def _build_contents(self, image_path: str, prompt: Optional[str] = None) -> list[dict]:
        default_prompt = USER_PROMPT_TEMPLATE
        return [{"role": "user", "parts": [{"text": prompt or default_prompt}, {"inline_data": {"mime_type": "image/jpeg", "data": self._encode_image(image_path)}}]}]

    async def interpret_handwriting(
        self,
        image_path: str,
        prompt: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.1,
    ) -> VLMResponse:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")

        response = await self._client.post(
            f"/models/{self.model}:generateContent",
            params={"key": self.api_key},
            json={
                "contents": self._build_contents(image_path, prompt),
                "generationConfig": {"maxOutputTokens": max_tokens, "temperature": temperature},
            },
        )
        response.raise_for_status()
        data = response.json()
        parts = data["candidates"][0]["content"].get("parts", [])
        text = "".join(part.get("text", "") for part in parts)
        return VLMResponse(text=text, usage=data.get("usageMetadata"), raw_response=data)

    async def close(self):
        await self._client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()


class SyncGeminiVLMClient:
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://generativelanguage.googleapis.com/v1beta",
        model: str = "gemini-2.5-flash",
        timeout: float = 60.0,
    ):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not provided or found in environment")
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout
        self._client = httpx.Client(base_url=self.base_url, timeout=self.timeout)

    def _encode_image(self, image_path: str) -> str:
        with Image.open(image_path) as img:
            if img.mode != "RGB":
                img = img.convert("RGB")
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=85)
            return base64.b64encode(buffer.getvalue()).decode("utf-8")

    def _build_contents(self, image_path: str, prompt: Optional[str] = None) -> list[dict]:
        default_prompt = USER_PROMPT_TEMPLATE
        return [{"role": "user", "parts": [{"text": prompt or default_prompt}, {"inline_data": {"mime_type": "image/jpeg", "data": self._encode_image(image_path)}}]}]

    def interpret_handwriting(
        self,
        image_path: str,
        prompt: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.1,
    ) -> VLMResponse:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")

        response = self._client.post(
            f"/models/{self.model}:generateContent",
            params={"key": self.api_key},
            json={
                "contents": self._build_contents(image_path, prompt),
                "generationConfig": {"maxOutputTokens": max_tokens, "temperature": temperature},
            },
        )
        response.raise_for_status()
        data = response.json()
        parts = data["candidates"][0]["content"].get("parts", [])
        text = "".join(part.get("text", "") for part in parts)
        return VLMResponse(text=text, usage=data.get("usageMetadata"), raw_response=data)

    def close(self):
        self._client.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

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
        default_prompt = USER_PROMPT_TEMPLATE
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
        default_prompt = USER_PROMPT_TEMPLATE
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

class MistralVLMClient(NVIDIAVLMClient):
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://api.mistral.ai/v1",
        model: str = "mistral-small-latest",
        timeout: float = 60.0,
    ):
        self.api_key = api_key or os.getenv("MISTRAL_API_KEY")
        if not self.api_key:
            raise ValueError("MISTRAL_API_KEY not provided or found in environment")
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout
        self._client = httpx.AsyncClient(
            base_url=self.base_url,
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
            timeout=self.timeout,
        )

    def _build_messages(self, image_path: str, prompt: Optional[str] = None) -> list[dict]:
        return [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt or USER_PROMPT_TEMPLATE},
                    {"type": "image_url", "image_url": f"data:image/jpeg;base64,{self._encode_image(image_path)}"},
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
        response = await self._client.post(
            "/chat/completions",
            json={
                "model": self.model,
                "messages": self._build_messages(image_path, prompt),
                "max_tokens": max_tokens,
                "temperature": temperature,
            },
        )
        response.raise_for_status()
        data = response.json()
        message = data["choices"][0]["message"]
        content = message.get("content", "")
        text = content if isinstance(content, str) else "".join(part.get("text", "") for part in content)
        return VLMResponse(text=text, reasoning=message.get("reasoning_content"), usage=data.get("usage"), raw_response=data)


class SyncMistralVLMClient(SyncNVIDIAVLMClient):
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://api.mistral.ai/v1",
        model: str = "mistral-small-latest",
        timeout: float = 60.0,
    ):
        self.api_key = api_key or os.getenv("MISTRAL_API_KEY")
        if not self.api_key:
            raise ValueError("MISTRAL_API_KEY not provided or found in environment")
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout
        self._client = httpx.Client(
            base_url=self.base_url,
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
            timeout=self.timeout,
        )

    def interpret_handwriting(
        self,
        image_path: str,
        prompt: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.1,
    ) -> VLMResponse:
        response = self._client.post(
            "/chat/completions",
            json={
                "model": self.model,
                "messages": self._build_messages(image_path, prompt),
                "max_tokens": max_tokens,
                "temperature": temperature,
            },
        )
        response.raise_for_status()
        data = response.json()
        message = data["choices"][0]["message"]
        content = message.get("content", "")
        text = content if isinstance(content, str) else "".join(part.get("text", "") for part in content)
        return VLMResponse(text=text, reasoning=message.get("reasoning_content"), usage=data.get("usage"), raw_response=data)

def _openai_response_text(data: dict) -> str:
    if data.get("output_text"):
        return data["output_text"]
    return "".join(
        content.get("text", "")
        for item in data.get("output", [])
        for content in item.get("content", [])
        if content.get("type") == "output_text"
    )


def _openai_usage(data: dict) -> dict:
    usage = data.get("usage") or {}
    return {
        **usage,
        "total_tokens": usage.get("total_tokens", usage.get("input_tokens", 0) + usage.get("output_tokens", 0)),
        "completion_tokens": usage.get("output_tokens", 0),
    }


class OpenAIVLMClient(NVIDIAVLMClient):
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://api.openai.com/v1",
        model: str = "gpt-5.6-terra",
        timeout: float = 60.0,
    ):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not provided or found in environment")
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout
        self._client = httpx.AsyncClient(
            base_url=self.base_url,
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
            timeout=self.timeout,
        )

    def _build_input(self, image_path: str, prompt: Optional[str] = None) -> list[dict]:
        return [{
            "role": "user",
            "content": [
                {"type": "input_text", "text": prompt or USER_PROMPT_TEMPLATE},
                {"type": "input_image", "image_url": f"data:image/jpeg;base64,{self._encode_image(image_path)}", "detail": "high"},
            ],
        }]

    async def interpret_handwriting(
        self,
        image_path: str,
        prompt: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.1,
    ) -> VLMResponse:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")
        response = await self._client.post(
            "/responses",
            json={"model": self.model, "input": self._build_input(image_path, prompt), "max_output_tokens": max_tokens},
        )
        response.raise_for_status()
        data = response.json()
        return VLMResponse(text=_openai_response_text(data), usage=_openai_usage(data), raw_response=data)


class SyncOpenAIVLMClient(SyncNVIDIAVLMClient):
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://api.openai.com/v1",
        model: str = "gpt-5.6-terra",
        timeout: float = 60.0,
    ):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not provided or found in environment")
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout
        self._client = httpx.Client(
            base_url=self.base_url,
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
            timeout=self.timeout,
        )

    def _build_input(self, image_path: str, prompt: Optional[str] = None) -> list[dict]:
        return [{
            "role": "user",
            "content": [
                {"type": "input_text", "text": prompt or USER_PROMPT_TEMPLATE},
                {"type": "input_image", "image_url": f"data:image/jpeg;base64,{self._encode_image(image_path)}", "detail": "high"},
            ],
        }]

    def interpret_handwriting(
        self,
        image_path: str,
        prompt: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.1,
    ) -> VLMResponse:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")
        response = self._client.post(
            "/responses",
            json={"model": self.model, "input": self._build_input(image_path, prompt), "max_output_tokens": max_tokens},
        )
        response.raise_for_status()
        data = response.json()
        return VLMResponse(text=_openai_response_text(data), usage=_openai_usage(data), raw_response=data)