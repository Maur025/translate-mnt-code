import re
import ctranslate2
import transformers
from transformers import AutoTokenizer

GLOSSARY = {}


def translate_with_masking(text: str, translator, tokenizer) -> str:
    masked_text = text
    restoration_map = {}

    for idx, (source_word, target_word) in enumerate(GLOSSARY.items()):
        print(f"idx: {idx}, source_word: {source_word}, target_word: {target_word}")

        pattern = re.compile(rf'\b{re.escape(source_word)}\b', re.IGNORECASE)
        placeholder = f"__GLOSSARY_{idx}__"

        if pattern.search(masked_text):
            masked_text = pattern.sub(placeholder, masked_text)
            restoration_map[placeholder] = target_word

    source_tokens = tokenizer.convert_ids_to_tokens(tokenizer.encode(masked_text))
    results = translator.translate_batch([source_tokens], beam_size=1)
    target_tokens = results[0].hypotheses[0]
    translated_text = tokenizer.decode(tokenizer.convert_tokens_to_ids(target_tokens))

    print(f"translated_text: {translated_text}")

    for placeholder, target_word in restoration_map.items():
        translated_text = translated_text.replace(placeholder, target_word)

    return translated_text


def main():
    translator = ctranslate2.Translator("marian_ct2_model/")
    tokenizer = AutoTokenizer.register(translator)
    response = translate_with_masking("High throughput on each thread.", translator, tokenizer)

    print(f'translate response: {response}')


if __name__ == "__main__":
    main()
