"use client";
import React, { useEffect, useRef, useReducer } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import "@toast-ui/editor/dist/toastui-editor.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDocument } from "@/api/api";

// Dynamically import the Editor component
const Editor = dynamic(() => import("@toast-ui/react-editor").then((mod) => mod.Editor), { ssr: false });

// Types
interface DropdownState {
  visible: boolean;
  position: { top: number; left: number };
  items: string[];
}

type DropdownAction =
  | { type: "OPEN"; payload: { position: { top: number; left: number }; items: string[] } }
  | { type: "CLOSE" };

const dropdownReducer = (state: DropdownState, action: DropdownAction): DropdownState => {
  switch (action.type) {
    case "OPEN":
      return { visible: true, position: action.payload.position, items: action.payload.items };
    case "CLOSE":
      return { ...state, visible: false };
    default:
      return state;
  }
};

const MyEditor = () => {
  const editorRef = useRef<any>(null); // ToastUI editor instance
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  const [dropdownState, dispatchDropdown] = useReducer(dropdownReducer, {
    visible: false,
    position: { top: 0, left: 0 },
    items: [],
  });

  const { mutate } = useMutation({
    mutationFn: (data: string) =>
      axios.post("http://192.168.0.148:8000/api/document/create-doc", { title: "test", content: data }),
  });

  const handleSave = () => {
    if (editorRef.current) {
      const markdown = editorRef.current.getInstance().getMarkdown();
      mutate(markdown);
      localStorage.setItem("markdown", markdown);
    }
  };

  useEffect(() => {
    const loadPlugins = async () => {
      const [colorSyntax, uml] = await Promise.all([
        import("@toast-ui/editor-plugin-color-syntax").then((mod) => mod.default),
        import("@toast-ui/editor-plugin-uml").then((mod) => mod.default),
      ]);
      editorRef.current?.getInstance().addPlugins([colorSyntax, uml]);
    };

    loadPlugins();
  }, []);

  // useEffect(() => {
  //   const fetchDocument = async () => {
  //     try {
  //       const documentData = await getDocument();
  //       editorRef.current?.getInstance().setMarkdown(documentData.content || "");
  //     } catch (error) {
  //       console.error("Failed to fetch document:", error);
  //     }
  //   };

  //   fetchDocument();
  // }, []);
const { data } = useQuery({
  queryKey: ["documents"],
  queryFn: getDocument,
})
useEffect(() => {
  if(data){
    editorRef.current?.getInstance().setMarkdown(data?.content || "");
  }

},[data])
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "/") {
      event.preventDefault();
      const selection = window.getSelection()?.getRangeAt(0);
      if (!selection || !editorContainerRef.current) return;

      const rect = selection.getBoundingClientRect();
      const dropdownItems = [
        "Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5", "Heading 6",
        "bold", "italic", "strike", "hr", "quote", "ul", "ol", "task", "indent", "outdent", "table", "image", "link", "code", "codeblock",
      ];

      const top = Math.min(rect.bottom, window.innerHeight - 200);
      const left = Math.min(rect.left, window.innerWidth - 160);

      dispatchDropdown({
        type: "OPEN",
        payload: { position: { top, left }, items: dropdownItems },
      });
    } else if (event.key !== "Tab") {
      dispatchDropdown({ type: "CLOSE" });
    }
  };

  const handleDropdownSelect = (item: string) => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      switch (item) {
        case "Heading 1":
          editorInstance.exec("heading", { level: 1 });
          break;
        case "Heading 2":
          editorInstance.exec("heading", { level: 2 });
          break;
        case "Heading 3":
          editorInstance.exec("heading", { level: 3 });
          break;
        case "Heading 4":
          editorInstance.exec("heading", { level: 4 });
          break;
        case "Heading 5":
          editorInstance.exec("heading", { level: 5 });
          break;
        case "Heading 6":
          editorInstance.exec("heading", { level: 6 });
          break;
        case "bold":
          editorInstance.exec("bold");
          break;
        case "italic":
          editorInstance.exec("italic");
          break;
        case "strike":
          editorInstance.exec("strike");
          break;
        case "hr":
          editorInstance.exec("hr");
          break;
        case "quote":
          editorInstance.exec("blockquote");
          break;
        case "ul":
          editorInstance.exec("bulletList");
          break;
        case "ol":
          editorInstance.exec("orderedList");
          break;
        case "task":
          editorInstance.exec("taskList");
          break;
        case "indent":
          editorInstance.exec("indent");
          break;
        case "outdent":
          editorInstance.exec("outdent");
          break;
        case "code":
          editorInstance.exec("code");
          break;
        case "codeblock":
          editorInstance.exec("codeBlock");
          break;
        default:
          break;
      }
      editorInstance.focus(); // Restore focus to the editor
    }
    dispatchDropdown({ type: "CLOSE" });
  };

  return (
    <div className="relative">
      <div
        ref={editorContainerRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="focus:outline-none"
        aria-label="Markdown editor"
      >
        <Editor
          ref={editorRef}
          height="800px"
          initialEditType="markdown"
          previewStyle="vertical"
        />
      </div>

      <button onClick={handleSave} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Save
      </button>

      {dropdownState.visible && (
        <DropdownMenu open={dropdownState.visible} onOpenChange={() => dispatchDropdown({ type: "CLOSE" })}>
          <DropdownMenuTrigger asChild>
            <div
              style={{
                position: "absolute",
                top: dropdownState.position.top,
                left: dropdownState.position.left,
              }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border rounded shadow-lg w-40">
            {dropdownState.items.map((item) => (
              <DropdownMenuItem key={item} onClick={() => handleDropdownSelect(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default MyEditor;
