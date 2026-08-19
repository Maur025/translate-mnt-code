import os

import ctranslate2
from dotenv import load_dotenv
from transformers import AutoTokenizer

load_dotenv()

model_dir = os.getenv("MODEL_DIR", "opus-mt-en-es-ct2")
hf_model_id = "Helsinki-NLP/opus-mt-en-es"
is_local_files_only = os.getenv("HF_HUB_OFFLINE", "1") == "1"


def translate_text(text: str, tokenizer, translator) -> str:
    tokens = tokenizer.convert_ids_to_tokens(tokenizer.encode(text))

    results = translator.translate_batch([tokens])

    target_tokens = results[0].hypotheses[0]

    text_translated = tokenizer.decode(tokenizer.convert_tokens_to_ids(target_tokens))

    return text_translated


def translate(text: str) -> str:
    tokenizer = AutoTokenizer.from_pretrained(
        hf_model_id, local_files_only=is_local_files_only
    )
    translator = ctranslate2.Translator(model_dir, device="cpu")

    response = translate_text(text, tokenizer, translator)

    return response
