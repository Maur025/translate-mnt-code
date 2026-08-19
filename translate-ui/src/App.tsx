import {
  codeBlockPlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import { useRef } from "react";

import "@mdxeditor/editor/style.css";

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

  console.log(editor.getMarkdown());
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

function App() {
  const editorRef = useRef<MDXEditorMethods>(null);

  const handlePasteCapture = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const rawText = event.clipboardData.getData("text/plain");

    if (!rawText) return;

    console.log(rawText);

    event.preventDefault();

    // const textClean = cleanText(rawText);

    // console.log(textClean);

    // handleSetMarkdown(editorRef.current, "");
    // handleSetMarkdown(editorRef.current, textClean);
  };

  return (
    <>
      <main className="flex flex-col">
        <h1 className="text-3xl">Traductor</h1>

        <section className="mt-2">
          <div className="flex flex-row gap-4">
            <button
              className="border p-2 hover:border-gray-400 cursor-pointer"
              type="button"
              onClick={() => handleSetMarkdown(editorRef.current, "new text")}
            >
              Set new markdown
            </button>

            <button
              className="border p-2 hover:border-gray-400 cursor-pointer"
              type="button"
              onClick={() => handleGetMarkdown(editorRef.current)}
            >
              Get markdown
            </button>

            <button
              className="border p-2 hover:border-gray-400 cursor-pointer"
              type="button"
              onClick={() => cleanMarkdownText(editorRef.current)}
            >
              Clean
            </button>
          </div>

          <div className="mt-4" onPasteCapture={handlePasteCapture}>
            <MDXEditor
              ref={editorRef}
              markdown="# Hello world"
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                tablePlugin(),
                markdownShortcutPlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
                diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
                toolbarPlugin({
                  toolbarContents: () => (
                    <DiffSourceToggleWrapper>
                      <UndoRedo />
                      <Separator />
                    </DiffSourceToggleWrapper>
                  ),
                }),
              ]}
            />
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
