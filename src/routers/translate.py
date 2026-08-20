from typing import Annotated

from fastapi import APIRouter, Body
from pydantic import BaseModel

import src.services.translator as translator_mod

router = APIRouter(prefix="/translate", tags=["Translate"])


class TranslateWordRequest(BaseModel):
    text: str


@router.post("/")
def translate_text_post(request: Annotated[TranslateWordRequest, Body()]):
    translated_text = translator_mod.translate_text(request.text)

    return {"code": 200, "data": {"translate_text": translated_text}}
