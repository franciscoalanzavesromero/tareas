import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";

const WysiwygEditor = ({ value, onChange, placeholder = "Escribe aquí..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Bold,
      Italic,
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary text-decoration-underline',
        },
      }),
    ],
    content: value ?? "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
        placeholder: placeholder,
      },
    },
    immediatelyRender: false,
  });

  // Función para añadir enlace
  const addLink = () => {
    if (!editor) return;
    
    const url = window.prompt('Ingresa la URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  // Función para quitar enlace
  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  };

  // Si el editor no está listo, mostramos un loading
  if (!editor) {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <div className="mb-2 d-flex gap-1 flex-wrap align-items-center p-2 bg-light rounded border">
          <div className="d-flex gap-1 me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
              <strong>B</strong>
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
              <em>I</em>
            </button>
          </div>
          <div className="d-flex gap-1 me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
              <i className="bi bi-list-ul"></i>
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
              <i className="bi bi-list-ol"></i>
            </button>
          </div>
          <div className="d-flex gap-1">
            <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
              <i className="bi bi-link-45deg"></i>
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
              <i className="bi bi-link-45deg"></i>
            </button>
          </div>
          <div className="ms-auto">
            <small className="text-muted">Cargando editor...</small>
          </div>
        </div>
        <div
          style={{
            border: "1px solid #dee2e6",
            borderRadius: "0.375rem",
            minHeight: "150px",
            padding: "0.75rem",
            width: "100%",
            backgroundColor: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6c757d",
          }}
        >
          Inicializando editor...
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      {/* Toolbar mejorado */}
      <div className="mb-2 d-flex gap-1 flex-wrap align-items-center p-2 bg-light rounded border">
        {/* Grupo de formato de texto */}
        <div className="d-flex gap-1 me-2">
          <button
            type="button"
            className={`btn btn-sm ${editor.isActive('bold') ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Negrita"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${editor.isActive('italic') ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Cursiva"
          >
            <em>I</em>
          </button>
        </div>

        {/* Grupo de listas */}
        <div className="d-flex gap-1 me-2">
          <button
            type="button"
            className={`btn btn-sm ${editor.isActive('bulletList') ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Lista con viñetas"
          >
            <i className="bi bi-list-ul"></i>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${editor.isActive('orderedList') ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Lista numerada"
          >
            <i className="bi bi-list-ol"></i>
          </button>
        </div>

        {/* Grupo de enlaces */}
        <div className="d-flex gap-1">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={addLink}
            title="Añadir enlace"
          >
            <i className="bi bi-link-45deg"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={removeLink}
            title="Quitar enlace"
            disabled={!editor.isActive('link')}
          >
            <i className="bi bi-link-45deg"></i>
          </button>
        </div>

        {/* Indicador de estado activo - SOLUCIÓN DEL ERROR */}
        <div className="ms-auto">
          <small className="text-muted">
            {editor.storage.characterCount ? editor.storage.characterCount.characters() : 0} caracteres
          </small>
        </div>
      </div>

      {/* Editor con mejor estilo */}
      <div
        style={{
          border: "1px solid #dee2e6",
          borderRadius: "0.375rem",
          minHeight: "150px",
          maxHeight: "400px",
          padding: "0.75rem",
          width: "100%",
          boxSizing: "border-box",
          overflowY: "auto",
          backgroundColor: "#fff",
          transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
        }}
        className="editor-container"
      >
        <EditorContent
          editor={editor}
          style={{
            minHeight: "120px",
            outline: "none",
          }}
        />
      </div>

      {/* Información de ayuda */}
      <div className="mt-1">
        <small className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          Usa los botones para formatear tu texto. Soporta negritas, cursivas, listas y enlaces.
        </small>
      </div>

      {/* Estilos adicionales para el contenido del editor */}
      <style jsx>{`
        .editor-container:focus-within {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        .ProseMirror {
          outline: none;
          min-height: 120px;
        }
        
        .ProseMirror p {
          margin-bottom: 0.5rem;
        }
        
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .ProseMirror li {
          margin-bottom: 0.25rem;
        }
        
        .ProseMirror a {
          color: #0d6efd;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default WysiwygEditor;