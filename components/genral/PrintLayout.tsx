import React, { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import TurndownService from "turndown"; // Convert HTML back to Markdown

const turndownService = new TurndownService();

interface PrintLayoutProps {
  content: string;
  onContentChange?: (newContent: string) => void;
}

const PrintLayout: React.FC<PrintLayoutProps> = ({
  content,
  onContentChange,
}) => {
  const [htmlContent, setHtmlContent] = useState("");
  const editableRef = useRef<HTMLDivElement>(null);
  const isEditingRef = useRef(false);

  useEffect(() => {
    if (!isEditingRef.current) {
      const sanitizedHTML = DOMPurify.sanitize(marked(content));
      setHtmlContent(sanitizedHTML);
    }
  }, [content]);

  const handleFocus = () => {
    isEditingRef.current = true;
  };

  const handleBlur = () => {
    isEditingRef.current = false;
    if (editableRef.current) {
      const newHTML = editableRef.current.innerHTML;
      setHtmlContent(newHTML);
      if (onContentChange) {
        const markdownContent = turndownService.turndown(newHTML);
        onContentChange(markdownContent);
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newHTML = e.currentTarget.innerHTML;
    setHtmlContent(newHTML);
    if (onContentChange) {
      onContentChange(newHTML);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <div className="bg-white shadow-xl border border-gray-300 p-8 w-[21cm] min-h-[29.7cm] overflow-auto">
        <div
          ref={editableRef}
          className="prose mx-auto whitespace-pre-wrap break-words outline-none"
          contentEditable
          suppressContentEditableWarning={true}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default PrintLayout;
