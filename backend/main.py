from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
from typing import List, Dict

# Load environment variables from .env if present
def _load_env():
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        try:
            from dotenv import load_dotenv
            load_dotenv(dotenv_path=env_path, override=False)
            return
        except Exception:
            pass
        try:
            for line in env_path.read_text(encoding="utf-8").splitlines():
                if not line or line.strip().startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())
        except Exception:
            pass


_load_env()

from services.ai_service import (  # noqa: E402
    DoubaoSettings,
    build_prompt,
    generate_image,
    create_video_task,
    query_video_task,
    to_data_url,
)

app = FastAPI()
SETTINGS = DoubaoSettings()
BASE_PROMPT = os.getenv(
    "DOUBAO_BASE_PROMPT",
    "将输入图片迁移为黄宾虹风格，保留主体构图与内容，笔墨苍润、墨色层次丰富，提升纸本肌理与皴擦效果。",
)

# CORS for local debugging
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------
# Demo collection data
# ----------------------
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


@app.get("/health")
async def health():
    return {"status": "ok"}


# ----------------------
# Frontend mock APIs
# ----------------------
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


# ----------------------
# Doubao style transfer APIs (image / video)
# ----------------------

def _parse_tags(raw: str) -> List[str]:
    if not raw:
        return []
    return [t.strip() for t in raw.replace(";", ",").split(",") if t.strip()]


@app.post("/api/style-transfer/image")
async def api_style_image(
    file: UploadFile = File(...),
    prompt: str = Form(""),
    ink_style: str = Form(""),
    style_tags: str = Form(""),
    img_count: int = Form(1),
    size: str = Form(None),
):
    if not file or not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="请上传图片文件（image/*）")
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="文件为空")

    tags = _parse_tags(style_tags)
    prompt_text = build_prompt(prompt or BASE_PROMPT, ink_style, tags)
    data_url = to_data_url(image_bytes, file.content_type or "image/png")

    try:
        urls = await generate_image(
            SETTINGS,
            data_url,
            prompt_text,
            n=max(1, img_count),
            size=size,
        )
        return {"ok": True, "model": SETTINGS.image_model, "prompt": prompt_text, "urls": urls}
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@app.post("/api/style-transfer/video")
async def api_style_video(
    image_url: str = Form(...),
    prompt: str = Form(""),
    ink_style: str = Form(""),
    style_tags: str = Form(""),
    video_motion: str = Form("diffusion"),
    video_duration: int = Form(5),
):
    tags = _parse_tags(style_tags)
    base_prompt = build_prompt(prompt or BASE_PROMPT, ink_style, tags)
    prompt_text = f"{base_prompt}；动效：{video_motion}；时长：{video_duration}s；水印：true"

    try:
        task_id = await create_video_task(SETTINGS, prompt_text, image_url)
        return {"ok": True, "task_id": task_id, "model": SETTINGS.video_model, "prompt": prompt_text}
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@app.get("/api/style-transfer/video/{task_id}")
async def api_style_video_query(task_id: str):
    try:
        data = await query_video_task(SETTINGS, task_id)
        return {"ok": True, "model": SETTINGS.video_model, "data": data}
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


class NoCacheStaticFiles(StaticFiles):
    """Disable cache to make dev easier."""

    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        if response.status_code == 200:
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        return response


# Static files mount
app.mount("/", NoCacheStaticFiles(directory=".", html=True), name="static")
