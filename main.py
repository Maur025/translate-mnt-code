from typing import Annotated

from fastapi import Body, FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import src.translator as translator_mod

tags_metadata = [{"name": "Translate", "description": "Endpoints to translate text"}]

app = FastAPI(
    title="Translator custom",
    openapi_tags=tags_metadata,
    servers=[{"url": "http://127.0.0.1:8000", "description": "localhost endpoint"}],
    default_response_class=JSONResponse,
    root_path="/api/v1",
)


class TranslateWordRequest(BaseModel):
    text: str


@app.post("/translate-words", tags=["Translate"])
def translate_text_post(request: Annotated[TranslateWordRequest, Body()]):
    translated_text = translator_mod.translate(request.text)

    return JSONResponse(
        status_code=200,
        content={"code": 200, "data": {"translate_text": translated_text}},
    )
