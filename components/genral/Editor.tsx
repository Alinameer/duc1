"use client";
import { getDocument } from "@/api/api";

import React, { useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import dynamic from "next/dynamic";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Dynamically import the Editor component
const Editor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

const MyEditor = () => {
  const editorRef = useRef<any | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const [plugins, setPlugins] = useState<any[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownItems, setDropdownItems] = useState<string[]>([]);
  const [initialContent, setInitialContent] = useState<string>("Loading...");

 
  function post(data:any){
    const res = axios.post("http://192.168.0.148:8000/api/document/create-doc",{title:"test",content:data})
    return res
  }
const {mutate} = useMutation({
  mutationFn: post
})
const handleSave = () => {
  if (editorRef.current) {
    const markdown = editorRef.current.getInstance().getMarkdown();
    console.log("Markdown content:", markdown);
    mutate(markdown)
    localStorage.setItem("markdown", markdown);
  }
};
  useEffect(() => {
    const loadPlugins = async () => {
      const colorSyntax = (await import("@toast-ui/editor-plugin-color-syntax"))
        .default;
      const uml = (await import("@toast-ui/editor-plugin-uml")).default;
      setPlugins([colorSyntax, uml]);
    };

    loadPlugins();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentData = await getDocument();
        setInitialContent(documentData.content || ""); // Set the fetched content
      } catch (error) {
        console.error("Failed to fetch document:", error);
        setInitialContent("");
      }
    };

    fetchData();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "/") {
      event.preventDefault();
      const editorContainer = editorContainerRef.current;
      const editorInstance = editorRef.current?.getInstance();

      if (editorContainer && editorInstance) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (range) {
          const rect = range.getBoundingClientRect();
          const containerRect = editorContainer.getBoundingClientRect();
          const scrollY = window.scrollY;
          const scrollX = window.scrollX;

          // Calculate the position of the dropdown
          let top = rect.bottom + scrollY;
          let left = rect.left + scrollX;

          const dropdownHeight = 200;
          const dropdownWidth = 160;

          if (top + dropdownHeight > window.innerHeight + scrollY) {
            top = rect.top + scrollY - dropdownHeight;
          }

          if (left + dropdownWidth > window.innerWidth + scrollX) {
            left = rect.right + scrollX - dropdownWidth;
          }

          setDropdownPosition({ top, left });
          setDropdownVisible(true);

          // Define dropdown items manually based on available commands
          const items = [
            "Heading1",
            "bold",
            "italic",
            "strike",
            "hr",
            "quote",
            "ul",
            "ol",
            "task",
            "indent",
            "outdent",
            "table",
            "image",
            "link",
            "code",
            "codeblock",
          ];
          setDropdownItems(items);
        }
      }
    } else if (event.key !== "Tab") {
      setDropdownVisible(false);
    }
  };

  const handleDropdownSelect = (item: string) => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.exec(item); 
    }
    setDropdownVisible(false);
  };

  return (
    <div className="relative">
      <div
        ref={editorContainerRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="focus:outline-none"
      >
        {plugins.length > 0 && (
          <Editor
            ref={editorRef}
            height="800px"
            initialEditType="markdown"
            previewStyle="vertical"
            initialValue={initialContent} 
            plugins={plugins}
          />
        )}
      </div>

      <button
        onClick={handleSave}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Save
      </button>

      <DropdownMenu open={dropdownVisible} onOpenChange={setDropdownVisible}>
        <DropdownMenuTrigger asChild>
          <div
            style={{
              position: "absolute",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              transform: "translateY(5px)", // Slight offset to prevent overlap
            }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-white border rounded shadow-lg w-40"
          style={{
            position: "fixed",
            top: dropdownPosition.top,
            left: dropdownPosition.left,
          }}
        >
          {dropdownItems.map((item) => (
            <DropdownMenuItem
              key={item}
              onClick={() => handleDropdownSelect(item)}
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MyEditor;
