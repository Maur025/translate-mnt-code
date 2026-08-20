import os
import re
from collections.abc import Generator

import ctranslate2
from dotenv import load_dotenv
from transformers import AutoTokenizer

load_dotenv()

model_dir = os.getenv("MODEL_DIR", "nllb-200-600m-ct2")
# hf_model_id = "Helsinki-NLP/opus-mt-en-es"
hf_model_id = "facebook/nllb-200-distilled-600M"
is_local_files_only = os.getenv("HF_HUB_OFFLINE", "1") == "1"


tokenizer = AutoTokenizer.from_pretrained(
    hf_model_id, local_files_only=is_local_files_only, src_lang="eng_Latn"
)
translator = ctranslate2.Translator(model_dir, device="cpu")


def split_into_sentences(text: str) -> list[str]:
    paragraphs = text.split("\n")

    sentences = []

    for paragraph in paragraphs:
        if not paragraph.strip():
            sentences.append("")
            continue

        chunks = re.split(r"(?<=[.!?])\s+", paragraph.strip())
        sentences.extend(chunks)

    return sentences


def split_in_paragraphs(text: str) -> list[str]:
    return [p.strip() for p in text.split("\n\n") if p.strip()]


def translate_text(text: str) -> str:
    # tokens = tokenizer.convert_ids_to_tokens(tokenizer.encode(text))
    sentences = split_into_sentences(text)

    non_empty_indices = [
        index for index, sentence in enumerate(sentences) if sentence.strip()
    ]
    non_empty_sentences = [sentences[index] for index in non_empty_indices]

    if not non_empty_sentences:
        return text

    tokens_batch = [
        tokenizer.convert_ids_to_tokens(tokenizer.encode(ne_sentence))
        for ne_sentence in non_empty_sentences
    ]

    target_prefix = [["spa_Latn"]] * len(tokens_batch)

    results = translator.translate_batch(
        tokens_batch,
        target_prefix=target_prefix,
        beam_size=5,
        repetition_penalty=1.1,
        max_decoding_length=512,
    )

    translated_sentences = []

    for result in results:
        target_tokens = result.hypotheses[0]

        if target_tokens[0] == "spa_Latn":
            target_tokens = target_tokens[1:]

        translated_text = tokenizer.decode(
            tokenizer.convert_tokens_to_ids(target_tokens)
        )
        translated_sentences.append(translated_text)

    final_translation = "".join(translated_sentences)
    print(f"\n{final_translation}")
    return final_translation


def translate_text_stream(text: str) -> Generator[str]:
    sentences = split_into_sentences(text)

    for sentence in sentences:
        if not sentence.strip():
            yield "\n\n"
            continue

        print(f"{sentence}\n")

        tokens = tokenizer.convert_ids_to_tokens(tokenizer.encode(sentence))

        results = translator.translate_batch(
            [tokens],
            target_prefix=[["spa_Latn"]],
            beam_size=4,
            repetition_penalty=1.1,
            max_decoding_length=512,
        )

        target_tokens = results[0].hypotheses[0]

        if target_tokens and target_tokens[0] == "spa_Latn":
            target_tokens = target_tokens[1:]

        translated_text = tokenizer.decode(
            tokenizer.convert_tokens_to_ids(target_tokens)
        )

        yield translated_text + " "
