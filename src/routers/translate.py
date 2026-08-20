from typing import Annotated

from fastapi import APIRouter, Body
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

import src.services.translator as translator_mod

router = APIRouter(prefix="/translate", tags=["Translate"])


class TranslateWordRequest(BaseModel):
    text: str


@router.post("/")
def translate_text_post(request: Annotated[TranslateWordRequest, Body()]):
    translated_text = translator_mod.translate_text(request.text)

    return {"code": 200, "data": {"translate_text": translated_text}}


@router.post("/stream")
async def stream_translate_post(request: Annotated[TranslateWordRequest, Body()]):
    return StreamingResponse(
        translator_mod.translate_text_stream(request.text), media_type="text/plain"
    )
