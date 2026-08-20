import {
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  InsertCodeBlock,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  searchPlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  type MDXEditorMethods,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";
import type { RefObject } from "react";

interface Props {
  editorReference: RefObject<MDXEditorMethods | null>;
}

const EditorComponent = ({ editorReference }: Props) => {
  return (
    <div className="mt-4 border h-11/12 overflow-y-auto flex-1 rounded-lg" lang="es" spellCheck>
      <MDXEditor
        className="dark-theme dark-editor"
        contentEditableClassName=""
        ref={editorReference}
        markdown=""
        spellCheck
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          markdownShortcutPlugin(),
          searchPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: "JavaScript",
              css: "CSS",
              txt: "text",
              tsx: "TypeScript",
            },
          }),
          diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <Separator />

                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />

                <ListsToggle />
                <Separator />

                <CreateLink />
                {/* <InsertImage /> */}
                <InsertTable />
                <InsertThematicBreak />
                <Separator />

                {/* <MdxSearchToolbar /> */}

                <InsertCodeBlock />
                <ConditionalContents
                  options={[
                    {
                      when: (editor) => editor?.editorType === "codeblock",
                      contents: () => <ChangeCodeMirrorLanguage />,
                    },
                    {
                      fallback: () => <InsertCodeBlock />,
                    },
                  ]}
                />
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
      />
    </div>
  );
};

export default EditorComponent;
