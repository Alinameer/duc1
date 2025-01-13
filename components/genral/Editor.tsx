'use client';

import React, { useEffect, useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import '@toast-ui/editor/dist/toastui-editor.css';

const MyEditor = () => {
  const editorRef = useRef<Editor | null>(null);

  const handleSave = () => {
    if (editorRef.current) {
      const markdown = editorRef.current.getInstance().getMarkdown();
      localStorage.setItem('markdown', markdown);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      const storedMarkdown = localStorage.getItem('markdown');
      if (storedMarkdown) {
        editorRef.current.getInstance().setMarkdown(storedMarkdown);
      }
    }
  }, []);

  return (
    <div>
      <Editor
        ref={editorRef}
        height="800px"
        initialEditType="wysiwyg"
        previewStyle="vertical"
        initialValue="Hello, Markdown!"
        plugins={[colorSyntax]}
      />
      <button
        onClick={handleSave}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Save
      </button>
    </div>
  );
};

export default MyEditor;
