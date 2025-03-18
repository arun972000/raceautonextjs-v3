"use client"; // Ensure it's a client component in Next.js 13+

import { useState, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { EditorState } from "lexical";

import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

const theme = {
  // Customize Lexical Editor styles
  paragraph: "editor-paragraph",
};

const initialConfig = {
  namespace: "LexicalEditor",
  theme,
  onError(error: Error) {
    console.error("Lexical error:", error);
  },
};

export default function LexicalEditor() {
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container border p-3">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-content" />}
          placeholder={<div className="editor-placeholder">Start typing...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <OnChangePlugin onChange={setEditorState} />
      </div>
    </LexicalComposer>
  );
}
