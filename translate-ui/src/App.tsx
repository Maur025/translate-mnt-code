import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef } from "react";
import EditorComponent from "./components/EditorComponent";

const handleSetMarkdown = (editor: MDXEditorMethods | null, text: string) => {
  if (!editor || text === null || text === undefined) {
    console.error("No found editor or text is invalid");
    return;
  }

  editor.setMarkdown(text);
};

const handleGetMarkdown = (editor: MDXEditorMethods | null) => {
  if (!editor) {
    console.error("No found editor");
    return;
  }

  return editor.getMarkdown();
};

const cleanText = (rawText: string) => {
  return rawText
    .replace(/(?<![.!?”"])\n\n+/g, " ")
    .replace(/([.!?”"])\n\n+([a-z])/g, "$1 $2")
    .replace(/[ \t]+/g, " ");
};

const cleanMarkdownText = (editor: MDXEditorMethods | null) => {
  if (!editor) {
    console.error("No found editor");
    return;
  }

  const rawText = editor.getMarkdown();

  handleSetMarkdown(editor, cleanText(rawText));
};

const translateToEs = async (
  inputEditor: MDXEditorMethods | null,
  outputEditor: MDXEditorMethods | null,
) => {
  if (!inputEditor || !outputEditor) {
    console.error("Not found editors to translate");
    return;
  }

  const inputRawText = handleGetMarkdown(inputEditor);
  console.log(inputRawText);

  // const response = await fetch("http://127.0.0.1:8000/api/v1/translate", {
  //   method: "post",
  //   headers: {
  //     "content-Type": "application/json",
  //   },
  //   body: JSON.stringify(payload),
  // });

  const response = await fetch("http://127.0.0.1:8000/api/v1/translate/stream/", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify({ text: inputRawText }),
  });

  if (!response.ok) {
    console.error("Error en la petición");
  }

  // const dataResponse = await response.json();
  // const outputText = dataResponse.data?.translate_text;

  // console.log(dataResponse);

  // // handleSetMarkdown(outputEditor, outputText);
  // outputEditor.insertMarkdown(outputText);

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    console.info("empty stream response");
    return;
  }

  let accumulatedText = handleGetMarkdown(outputEditor) ?? "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    accumulatedText += chunk;

    handleSetMarkdown(outputEditor, accumulatedText);
  }
};

function App() {
  const inputEditorRef = useRef<MDXEditorMethods>(null);

  const outputEditorRef = useRef<MDXEditorMethods>(null);

  return (
    <>
      <main className="h-svh flex flex-col p-6">
        <h1 className="text-3xl">Traductor</h1>

        <section className="mt-2 overflow-hidden">
          <div className="flex flex-row gap-4">
            <button
              className="border p-2 hover:border-gray-400 cursor-pointer"
              type="button"
              onClick={() => handleSetMarkdown(inputEditorRef.current, "new text")}
            >
              Set new markdown
            </button>

            <button
              className="border p-2 hover:border-gray-400 cursor-pointer"
              type="button"
              onClick={() => handleGetMarkdown(inputEditorRef.current)}
            >
              Get markdown
            </button>

            <button
              className="border p-2 hover:border-gray-400 cursor-pointer"
              type="button"
              onClick={() => cleanMarkdownText(inputEditorRef.current)}
            >
              Clean
            </button>

            <button
              className="border p-2 hover:border-gray-400 cursor-pointer"
              type="button"
              onClick={() => translateToEs(inputEditorRef.current, outputEditorRef.current)}
            >
              Translate ES
            </button>
          </div>
        </section>

        <section className="mt-2 h-5/6 overflow-y-hidden flex flex-row gap-4">
          <EditorComponent editorReference={inputEditorRef} />
          <EditorComponent editorReference={outputEditorRef} />
        </section>
      </main>
    </>
  );
}

export default App;
