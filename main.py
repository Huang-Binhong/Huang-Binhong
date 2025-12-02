from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import base64
import json
import os
from typing import Optional, List, Dict

try:
    import httpx
except Exception:
    httpx = None

from config import load_config

app = FastAPI()
CONFIG = load_config()

# CORS for local debugging
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Demo collections（中文示例数据）
collections: List[Dict] = [
    {
        "id": "HBH-0001",
        "collectionName": "山水甲",
        "author": "黄宾虹",
        "age": "近现代",
        "category": "010101",
        "texture": "纸本",
        "collectionSize": "27 厘米 × 18 厘米（示例）",
        "collectionTime": "20世纪",
        "collectionUnit": "某博物馆（示例）",
        "intro": "示例：早期山水，格调清雅。",
        "smallPic": {"directoryName": "images", "resourceName": "bg1.jpg"},
    },
    {
        "id": "HBH-0002",
        "collectionName": "山水乙",
        "author": "黄宾虹",
        "age": "近现代",
        "category": "010201",
        "texture": "纸本",
        "collectionSize": "30 厘米 × 20 厘米（示例）",
        "collectionTime": "20世纪",
        "collectionUnit": "某博物馆（示例）",
        "intro": "示例：层层积墨，雪景意境。",
        "smallPic": {"directoryName": "images", "resourceName": "bg2.jpg"},
    },
    {
        "id": "HBH-0003",
        "collectionName": "山水丙",
        "author": "黄宾虹",
        "age": "近现代",
        "category": "020101",
        "texture": "纸本",
        "collectionSize": "52.8 厘米 × 26.4 厘米（示例）",
        "collectionTime": "20世纪",
        "collectionUnit": "某博物馆（示例）",
        "intro": "示例：秋山叠嶂，重墨浑厚。",
        "smallPic": {"directoryName": "images", "resourceName": "right_bg.png"},
    },
    {
        "id": "HBH-0004",
        "collectionName": "山水丁",
        "author": "黄宾虹",
        "age": "近现代",
        "category": "020203",
        "texture": "纸本",
        "collectionSize": "30 厘米 × 20 厘米（示例）",
        "collectionTime": "20世纪",
        "collectionUnit": "某博物馆（示例）",
        "intro": "示例：竹林构图，线条生动。",
        "smallPic": {"directoryName": "images", "resourceName": "logo.png"},
    },
]

def filter_by_category(cat: str):
    if not cat:
        return collections
    return [it for it in collections if (it.get("category") or "").startswith(cat)]

@app.post("/frontend/pg/huang/huang-collection")
async def huang_collection(
    category: str = Form(default=""),
    pageNo: int = Form(default=1),
    pageSize: int = Form(default=12),
):
    """Return paginated collection list (demo)."""
    all_ = filter_by_category(category)
    pageN = max(1, (len(all_) + pageSize - 1) // pageSize)
    start = (pageNo - 1) * pageSize
    page = all_[start : start + pageSize]
    return {"pageN": pageN, "pageNo": pageNo, "realPath": ".", "infomationList": page}

@app.post("/frontend/pg/huang/get-dong-by-id")
async def huang_detail(
    infomationId: str = Form(...),
):
    """Return single record by id (demo)."""
    rec = next((item for item in collections if item.get("id") == infomationId), None)
    if rec is None:
        return {"bigPicSrcs": [], "infomation": {}, "smallPicSrc": ""}

    small_pic = rec.get("smallPic") or {}
    directory = small_pic.get("directoryName", "images")
    filename = small_pic.get("resourceName", "bg1.jpg")
    small_pic_src = f"{directory}/{filename}"

    big_pic_srcs = [small_pic_src]
    info = {
        "id": rec.get("id"),
        "collectionName": rec.get("collectionName", ""),
        "author": rec.get("author", ""),
        "age": rec.get("age", ""),
        "category": rec.get("category", ""),
        "collectionSize": rec.get("collectionSize", ""),
        "collectionTime": rec.get("collectionTime", ""),
        "collectionUnit": rec.get("collectionUnit", ""),
        "texture": rec.get("texture", ""),
        "intro": rec.get("intro", ""),
        "sortNo": rec.get("sortNo"),
    }
    return {"bigPicSrcs": big_pic_srcs, "infomation": info, "smallPicSrc": small_pic_src}

# VR works (demo descriptions)
vr_scene_descs = {
    "HBH-0001": "Landscape scroll texture, soft ink lighting.",
    "HBH-0002": "Mountains with mist, clear near, hazy far.",
    "HBH-0003": "Raised terrain reflecting heavy ink stacking.",
    "HBH-0004": "Bamboo corridor composition, walk-through space.",
}

@app.post("/frontend/pg/huang/vr-works")
async def huang_vr_works():
    works = []
    for rec in collections:
        small_pic = rec.get("smallPic") or {}
        directory = small_pic.get("directoryName", "images")
        filename = small_pic.get("resourceName", "bg1.jpg")
        img_src = f"{directory}/{filename}"
        works.append({
            "id": rec.get("id"),
            "name": rec.get("collectionName", ""),
            "img": img_src,
            "desc": vr_scene_descs.get(rec.get("id"), rec.get("intro", "")),
        })
    return {"works": works}

class NoCacheStaticFiles(StaticFiles):
    """Disable cache to make dev easier."""
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        if response.status_code == 200:
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        return response

# --- Doubao Style Transfer ---
async def _call_doubao_style_transfer(image_bytes: bytes, filename: str, content_type: Optional[str] = None) -> dict:
    """Call Doubao Images Generations API with a data-url image.
    Requires doubao config in config.json.
    Returns {"image_base64": str} or {"image_url": str}.
    """
    doubao = (CONFIG or {}).get("doubao", {})
    api_url = str(doubao.get("style_api_url", "")).strip()
    api_key = str(doubao.get("api_key", "")).strip()
    model = str(doubao.get("model", "doubao-seedream-4-0-250828"))
    prompt = str(doubao.get("prompt", "Huang Binhong ink style."))
    response_format = str(doubao.get("response_format", "url"))
    size = str(doubao.get("size", "2K"))
    stream = bool(doubao.get("stream", False))
    watermark = bool(doubao.get("watermark", True))
    seq_gen = str(doubao.get("sequential_image_generation", "auto"))
    seq_opts = doubao.get("sequential_image_generation_options") if isinstance(doubao.get("sequential_image_generation_options"), dict) else {}
    seq_max_images = int((seq_opts or {}).get("max_images", 1))
    image_mode = str(doubao.get("image_mode", "base64"))

    if not api_url or not api_key:
        raise RuntimeError("Missing doubao api url or api key")
    if httpx is None:
        raise RuntimeError("httpx not installed: pip install httpx")

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    ct = (content_type or "image/png").split(";")[0]
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    if image_mode.lower() != "base64":
        # fallback to data-url
        pass
    image_list = [f"data:{ct};base64,{b64}"]

    payload = {
        "model": model,
        "prompt": prompt,
        "image": image_list,
        "sequential_image_generation": seq_gen,
        "sequential_image_generation_options": {"max_images": seq_max_images},
        "response_format": response_format,
        "size": size,
        "stream": False if stream else False,
        "watermark": watermark,
    }

    timeout = int(doubao.get("timeout", 60) or 60)
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(api_url, headers=headers, json=payload)
        if resp.status_code >= 400:
            detail = resp.text
            try:
                detail = json.dumps(resp.json(), ensure_ascii=False)
            except Exception:
                pass
            raise RuntimeError(f"Doubao API failed: {resp.status_code} {detail}")

    try:
        payload = resp.json()
    except Exception:
        return {"image_base64": base64.b64encode(resp.content).decode("utf-8")}

    if isinstance(payload, dict):
        if payload.get("image_base64"):
            return {"image_base64": payload["image_base64"]}
        if payload.get("image") and isinstance(payload["image"], dict) and payload["image"].get("base64"):
            return {"image_base64": payload["image"]["base64"]}
        if payload.get("data") and isinstance(payload["data"], list) and payload["data"]:
            first = payload["data"][0]
            if isinstance(first, dict):
                if first.get("b64_json"):
                    return {"image_base64": first["b64_json"]}
                if first.get("url"):
                    return {"image_url": first["url"]}
        if payload.get("url"):
            return {"image_url": payload["url"]}
    raise RuntimeError("Unrecognized doubao response")

@app.post("/api/hbh-style")
async def hbh_style(file: UploadFile = File(...)):
    """Receive an image and return stylized result via doubao."""
    if not file or not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image (image/*)")
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty file")
    try:
        result = await _call_doubao_style_transfer(image_bytes, file.filename or "upload.png", file.content_type)
        return {"ok": True, **result}
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

# Static files mount
app.mount("/", NoCacheStaticFiles(directory=".", html=True), name="static")
