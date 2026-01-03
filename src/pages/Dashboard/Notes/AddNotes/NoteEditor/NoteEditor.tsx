// src/components/editor/SimpleEditor.tsx
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";

export default function NoteEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your note here...",
      }),
    ],
    content: "",
  });

  if (!editor) return null;

  return (
    <div className="w-full max-w-3xl mx-auto border rounded-lg p-4">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "font-bold text-blue-500" : ""}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "italic text-blue-500" : ""}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "text-blue-500" : ""}
        >
          • List
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="prose max-w-none" />
    </div>
  );
}
