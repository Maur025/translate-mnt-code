from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.routers import translate

tags_metadata = [{"name": "Translate", "description": "Endpoints to translate text"}]

app = FastAPI(
    title="Translator custom",
    openapi_tags=tags_metadata,
    servers=[{"url": "http://127.0.0.1:8000", "description": "localhost endpoint"}],
    default_response_class=JSONResponse,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(translate.router, prefix="/api/v1")
