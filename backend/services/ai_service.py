import base64
import os
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional

import httpx

# Ensure environment is loaded even if caller未先加载
_ENV_LOADED = False


def _load_env_once():
    global _ENV_LOADED
    if _ENV_LOADED:
        return
    # backend/services/ai_service.py -> 项目根目录的 .env 在上上级
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if env_path.exists():
        try:
            from dotenv import load_dotenv
            load_dotenv(dotenv_path=env_path, override=False)
        except Exception:
            try:
                for line in env_path.read_text(encoding="utf-8").splitlines():
                    if not line or line.strip().startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())
            except Exception:
                pass
    _ENV_LOADED = True


_load_env_once()


def _bool_env(key: str, default: bool = False) -> bool:
    return os.getenv(key, str(default)).lower() in ("1", "true", "yes")


def _int_env(key: str, default: int) -> int:
    try:
        return int(os.getenv(key, default))
    except Exception:
        return int(default)


@dataclass
class DoubaoSettings:
    api_key: str = os.getenv("DOUBAO_API_KEY", "")
    image_model: str = os.getenv("DOUBAO_IMAGE_MODEL", "doubao-seedream-4-0-250828")
    image_url: str = os.getenv("DOUBAO_IMAGE_URL", "https://ark.cn-beijing.volces.com/api/v3/images/generations")
    image_size: str = os.getenv("DOUBAO_IMAGE_SIZE", "2K")
    image_watermark: bool = _bool_env("DOUBAO_IMAGE_WATERMARK", True)
    image_timeout: int = _int_env("DOUBAO_IMAGE_TIMEOUT", 60)
    image_response_format: str = os.getenv("DOUBAO_IMAGE_RESPONSE_FORMAT", "url")

    video_model: str = os.getenv("DOUBAO_VIDEO_MODEL", "doubao-seedance-1-0-pro-250528")
    video_task_url: str = os.getenv("DOUBAO_VIDEO_TASK_URL", "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks")
    video_query_url: str = os.getenv("DOUBAO_VIDEO_QUERY_URL", "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/")
    video_timeout: int = _int_env("DOUBAO_VIDEO_TIMEOUT", 60)


def build_prompt(base_prompt: str, ink_style: Optional[str], style_tags: List[str]) -> str:
    tags = [t for t in style_tags if t]
    style_bits = []
    if ink_style:
        style_bits.append(ink_style)
    if tags:
        style_bits.extend(tags)
    style_suffix = "；".join(style_bits)
    if style_suffix:
        return f"{base_prompt}；风格提示：{style_suffix}"
    return base_prompt


def to_data_url(image_bytes: bytes, content_type: str) -> str:
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{content_type};base64,{b64}"


async def generate_image(
    settings: DoubaoSettings,
    image_data_url: str,
    prompt: str,
    n: int = 1,
    size: Optional[str] = None,
) -> List[str]:
    if not settings.api_key:
        raise RuntimeError("缺少 DOUBAO_API_KEY")
    payload = {
        "model": settings.image_model,
        "prompt": prompt,
        "image": image_data_url,
        "sequential_image_generation": "disabled",
        "response_format": settings.image_response_format,
        "size": size or settings.image_size,
        "stream": False,
        "watermark": settings.image_watermark,
    }
    results: List[str] = []
    async with httpx.AsyncClient(timeout=settings.image_timeout) as client:
        for _ in range(max(1, n)):
            resp = await client.post(
                settings.image_url,
                headers={
                    "Authorization": f"Bearer {settings.api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            if resp.status_code >= 400:
                raise RuntimeError(f"Doubao image error {resp.status_code}: {resp.text}")
            data = resp.json()
            url = None
            if isinstance(data, dict):
                url = data.get("url") or data.get("image_url")
                if not url and data.get("data") and isinstance(data["data"], list) and data["data"][0].get("url"):
                    url = data["data"][0]["url"]
            if not url:
                raise RuntimeError("未从 Doubao 返回结果 url")
            results.append(url)
    return results


async def create_video_task(
    settings: DoubaoSettings,
    prompt: str,
    image_url: str,
) -> str:
    if not settings.api_key:
        raise RuntimeError("缺少 DOUBAO_API_KEY")
    content = [
        {"type": "text", "text": prompt},
        {"type": "image_url", "image_url": {"url": image_url}},
    ]
    payload = {"model": settings.video_model, "content": content}
    async with httpx.AsyncClient(timeout=settings.video_timeout) as client:
        resp = await client.post(
            settings.video_task_url,
            headers={
                "Authorization": f"Bearer {settings.api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
    if resp.status_code >= 400:
        raise RuntimeError(f"Doubao video task error {resp.status_code}: {resp.text}")
    data = resp.json()
    task_id = data.get("id") or data.get("task_id")
    if not task_id:
        raise RuntimeError("未获取到任务 id")
    return str(task_id)


async def query_video_task(settings: DoubaoSettings, task_id: str) -> dict:
    url = settings.video_query_url.rstrip("/") + f"/{task_id}"
    async with httpx.AsyncClient(timeout=settings.video_timeout) as client:
        resp = await client.get(
            url,
            headers={
                "Authorization": f"Bearer {settings.api_key}",
                "Content-Type": "application/json",
            },
        )
    if resp.status_code >= 400:
        raise RuntimeError(f"Doubao video query error {resp.status_code}: {resp.text}")
    return resp.json()
