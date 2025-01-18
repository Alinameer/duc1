'use client';

import React, { useEffect, useRef, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import dynamic from 'next/dynamic';

// Dynamically import the Editor component
const Editor = dynamic(() => import('@toast-ui/react-editor').then((mod) => mod.Editor), { ssr: false });

const MyEditor = () => {
  const editorRef = useRef<any | null>(null);
  const [plugins, setPlugins] = useState<any[]>([]); // State to store loaded plugins

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

  // Dynamically load plugins
  useEffect(() => {
    const loadPlugins = async () => {
      const colorSyntax = (await import('@toast-ui/editor-plugin-color-syntax')).default;
      const uml = (await import('@toast-ui/editor-plugin-uml')).default;
      setPlugins([colorSyntax, uml]);
    };

    loadPlugins();
  }, []);

  return (
    <div>
      {plugins.length > 0 && ( // Render the editor only after plugins are loaded
        <Editor
          ref={editorRef}
          height="800px"
          initialEditType="wysiwyg"
          previewStyle="vertical"
          initialValue="Hello, Markdown!"
          plugins={plugins}
        />
      )}
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
