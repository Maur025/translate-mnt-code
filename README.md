# Translate nmt code

Test of translate text using models nmt

this project use [uv](https://docs.astral.sh/uv/)

install dependencies:

```SHELL
uv sync
```

to download model and convert in binary

```SHELL
uv run ct2-transformers-converter --model Helsinki-NLP/opus-mt-en-es --output_dir opus-mt-en-es-ct2 --quantization int8
```

run server

```SHELL
uv run fastapi dev
```
