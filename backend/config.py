import json
import os
from typing import Any, Dict


def _as_float(val: Any, default: float) -> float:
    try:
        return float(val)
    except Exception:
        return default


def _as_int(val: Any, default: int) -> int:
    try:
        return int(val)
    except Exception:
        return default


def load_config(path: str | None = None) -> Dict[str, Any]:
    """
    加载项目配置：
    - 默认读取根目录 `config.json`（可通过环境变量 `CONFIG_PATH` 指定）
    - 缺失字段回退至环境变量（向后兼容）
    - 返回结构：
      {
        "doubao": {
          style_api_url, api_key, model, prompt,
          response_format, size, stream, watermark,
          sequential_image_generation, sequential_image_generation_options: { max_images },
          image_mode, style_name, style_strength, timeout
        }
      }
    """
    cfg: Dict[str, Any] = {}
    path = path or os.getenv("CONFIG_PATH", "config.json")
    if os.path.isfile(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                cfg = json.load(f) or {}
        except Exception:
            # 配置文件存在但解析失败时，保留空配置并允许环境变量兜底
            cfg = {}

    doubao = cfg.get("doubao", {}) if isinstance(cfg.get("doubao"), dict) else {}

    style_api_url = (doubao.get("style_api_url") or os.getenv("DOUBAO_STYLE_API_URL", "")).strip()
    api_key = (doubao.get("api_key") or os.getenv("DOUBAO_API_KEY", "")).strip()

    model = (doubao.get("model") or os.getenv("DOUBAO_MODEL", "doubao-seedream-4-0-250828")).strip()
    prompt = (doubao.get("prompt") or os.getenv("DOUBAO_PROMPT", "将输入图片迁移为黄宾虹水墨风格，保留主体构图与内容，笔墨苍润、墨色层次丰富。"))
    response_format = (doubao.get("response_format") or os.getenv("DOUBAO_RESPONSE_FORMAT", "url")).strip()
    size = (doubao.get("size") or os.getenv("DOUBAO_SIZE", "2K")).strip()
    stream = doubao.get("stream") if isinstance(doubao.get("stream"), bool) else (os.getenv("DOUBAO_STREAM", "false").lower() == "true")
    watermark = doubao.get("watermark") if isinstance(doubao.get("watermark"), bool) else (os.getenv("DOUBAO_WATERMARK", "true").lower() == "true")

    seq_gen = (doubao.get("sequential_image_generation") or os.getenv("DOUBAO_SEQ_GEN", "auto")).strip()
    seq_opts = doubao.get("sequential_image_generation_options") if isinstance(doubao.get("sequential_image_generation_options"), dict) else {}
    seq_max_images = _as_int(seq_opts.get("max_images"), _as_int(os.getenv("DOUBAO_SEQ_MAX_IMAGES", 1), 1))

    image_mode = (doubao.get("image_mode") or os.getenv("DOUBAO_IMAGE_MODE", "base64")).strip()

    style_name = (doubao.get("style_name") or os.getenv("DOUBAO_STYLE_NAME", "黄宾虹")).strip()
    style_strength = _as_float(doubao.get("style_strength"), _as_float(os.getenv("DOUBAO_STYLE_STRENGTH", 0.8), 0.8))
    timeout = _as_int(doubao.get("timeout"), _as_int(os.getenv("DOUBAO_TIMEOUT", 60), 60))

    return {
        "doubao": {
            "style_api_url": style_api_url,
            "api_key": api_key,
            "model": model,
            "prompt": prompt,
            "response_format": response_format,
            "size": size,
            "stream": stream,
            "watermark": watermark,
            "sequential_image_generation": seq_gen,
            "sequential_image_generation_options": {"max_images": seq_max_images},
            "image_mode": image_mode,
            "style_name": style_name,
            "style_strength": style_strength,
            "timeout": timeout,
        }
    }
