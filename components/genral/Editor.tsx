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
import { hasPermission, Role } from "@/lib/auth";

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

interface MyEditorProps {
  user: { id: string; role?: Role };
}

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

const MyEditor: React.FC<MyEditorProps> = ({ user }) => {
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocument,
  });

  useEffect(() => {
    if (data && editorRef.current) {
      editorRef.current.getInstance().setMarkdown(data.content || "");
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading document.</div>;
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "/") {
      event.preventDefault();

      const editorInstance = editorRef.current?.getInstance();
      if (!editorInstance || !editorContainerRef.current) return;

      // Get the editor's DOM element
      const editorElement = editorInstance.getEditorElements().mdEditor;

      // Get the cursor's position within the editor
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Calculate the position relative to the editor container
      const editorRect = editorContainerRef.current.getBoundingClientRect();
      const isCursorAtStart = rect.top === 0 && rect.left === 0;
      const top = isCursorAtStart
        ? editorElement.scrollTop
        : rect.top - editorRect.top + editorElement.scrollTop;
      const left = isCursorAtStart
        ? 0 
        : rect.left - editorRect.left;

      const dropdownItems = [
        "Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5", "Heading 6",
        "bold", "italic", "strike", "hr", "ul", "ol", "task", "code", "codeblock",
      ];

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
        case "ul":
          editorInstance.exec("bulletList");
          break;
        case "ol":
          editorInstance.exec("orderedList");
          break;
        case "task":
          editorInstance.exec("taskList");
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
      editorInstance.focus();
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
          initialValue={data?.content || ""}
          initialEditType="wysiwyg"
          previewStyle="vertical"
        />
      </div>

      <button onClick={handleSave} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Save
      </button>

       {hasPermission(user, "edit") && (
        <button className="mt-4 p-2 bg-green-500 text-white rounded ml-2">
          Edit
        </button>
      )} 

      {dropdownState.visible && (
        <div
          style={{
            position: "absolute",
            top: dropdownState.position.top,
            left: dropdownState.position.left,
            zIndex: 1000,
          }}
        >
          <DropdownMenu open={dropdownState.visible} onOpenChange={() => dispatchDropdown({ type: "CLOSE" })}>
            <DropdownMenuTrigger asChild>
              <div />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border rounded shadow-lg w-40">
              {dropdownState.items.map((item) => (
                <DropdownMenuItem key={item} onClick={() => handleDropdownSelect(item)}>
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default MyEditor;