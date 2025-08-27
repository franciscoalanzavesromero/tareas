import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";

const WysiwygEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      BulletList,
      OrderedList,
      ListItem,
      Link,
    ],
    content: value ?? "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div style={{ marginBottom: "1rem" }}>
      {/* Toolbar */}
      <div className="mb-2 d-flex gap-1 flex-wrap">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • Lista
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. Lista
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          minHeight: 120,
          maxHeight: 300,
          padding: "0.5rem",
          width: "100%",
          boxSizing: "border-box",
          overflowY: "auto",
          backgroundColor: "#fff", // fondo blanco
        }}
      />
    </div>
  );
};

export default WysiwygEditor;
