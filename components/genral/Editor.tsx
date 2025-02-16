"use client";

import React, { useEffect, useRef, useReducer, useState } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "@toast-ui/editor/dist/toastui-editor.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDocument, updateDocument } from "@/api/api";
import { useDocumentTitle } from "@/hooks/DocumentTitleContext";

// Dynamically import the Editor (disables SSR)
const Editor = dynamic(() => import("@toast-ui/react-editor").then(mod => mod.Editor), {
  ssr: false,
});


interface DropdownState {
  visible: boolean;
  position: { top: number; left: number };
  items: string[];
}

type DropdownAction =
  | {
      type: "OPEN";
      payload: { position: { top: number; left: number }; items: string[] };
    }
  | { type: "CLOSE" };

interface MyEditorProps {
  docId: string;
}

const dropdownReducer = (state: DropdownState, action: DropdownAction): DropdownState => {
  switch (action.type) {
    case "OPEN":
      return {
        visible: true,
        position: action.payload.position,
        items: action.payload.items,
      };
    case "CLOSE":
      return { ...state, visible: false };
    default:
      return state;
  }
};

const MyEditor: React.FC<MyEditorProps> = ({ docId }) => {
  const editorRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const { setTitle } = useDocumentTitle();

  const [dropdownState, dispatchDropdown] = useReducer(dropdownReducer, {
    visible: false,
    position: { top: 0, left: 0 },
    items: [],
  });
  const [plugins, setPlugins] = useState<any[]>([]);

  // Load Editor plugins dynamically
  useEffect(() => {
    const loadPlugins = async () => {
      const { default: Prism } = await import("prismjs");
      const [
        codeSyntaxHighlight,
        colorSyntax,
        tableMergedCell,
        uml,
        chart,
      ] = await Promise.all([
        import("@toast-ui/editor-plugin-code-syntax-highlight").then(mod => mod.default),
        import("@toast-ui/editor-plugin-color-syntax").then(mod => mod.default),
        import("@toast-ui/editor-plugin-table-merged-cell").then(mod => mod.default),
        import("@toast-ui/editor-plugin-uml").then(mod => mod.default),
        import("@toast-ui/editor-plugin-chart").then(mod => mod.default),
      ]);

      setPlugins([
        [chart, { minWidth: 100, maxWidth: 600, minHeight: 100, maxHeight: 300 }],
        [codeSyntaxHighlight, { highlighter: Prism }],
        colorSyntax,
        tableMergedCell,
        uml,
      ]);
    };

    loadPlugins();
  }, []);

  // Fetch document data using react-query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["documents", docId],
    queryFn: () => getDocument(docId),
  });

  useEffect(() => {
    if (data?.[0]?.title) {
      setTitle(data[0].title);
    }
  }, [data, setTitle]);

  const queryClient = useQueryClient();
  const { mutate: updateDoc } = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", docId] });
    },
    onError: (error: any) => {
      console.error("Error during document update:", error);
    },
  });

  const handleSave = () => {
    if (!editorRef.current) return;
    const editorInstance = editorRef.current.getInstance();
    const markdown = editorInstance.getMarkdown();
    updateDoc({ id: docId, content: markdown });
    localStorage.setItem("markdown", markdown);
  };

  // Handle keydown events to open/close the dropdown
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) return;
  
    const key = event.key.toLowerCase();
    const isCtrlPressed = event.ctrlKey || event.metaKey; // Support Mac ⌘ key
  
    const commandMapping: Record<string, () => void> = {
      // Basic Formatting
      "d": () => editorInstance.exec("bold"),          // Ctrl + B for bold
      "i": () => editorInstance.exec("italic"),        // Ctrl + I for italic
      "`": () => editorInstance.exec("code"),          // Ctrl + ` for inline code
      
      // Headings
      "1": () => editorInstance.exec("heading", { level: 1 }), // Ctrl + 1 for H1
      "2": () => editorInstance.exec("heading", { level: 2 }), // Ctrl + 2 for H2
      "3": () => editorInstance.exec("heading", { level: 3 }), // Ctrl + 3 for H3
      "4": () => editorInstance.exec("heading", { level: 4 }), // Ctrl + 4 for H4
      "5": () => editorInstance.exec("heading", { level: 5 }), // Ctrl + 5 for H5
      "6": () => editorInstance.exec("heading", { level: 6 }), // Ctrl + 6 for H6
    
      // Lists
      "o": () => editorInstance.exec("ol"),            // Ctrl + O for ordered list
      "u": () => editorInstance.exec("ul"),            // Ctrl + U for unordered list
    
      // Block Quotes and Code Blocks
      "e": () => editorInstance.exec("codeBlock"),     // Ctrl + E for code block
   
      // Save
      "s": () => handleSave(),                         // Ctrl + S for save
    };
    
  
    if (isCtrlPressed && commandMapping[key]) {
      event.preventDefault();
      commandMapping[key]?.();
      return;
    }
  
    // Open dropdown on `/` key
    if (event.key === "/") {
      event.preventDefault();
      if (!editorContainerRef.current) return;
  
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
  
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorContainerRef.current.getBoundingClientRect();
  
      const dropdownItems = [
        "Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5", "Heading 6",
        "bold", "italic", "strike", "hr", "ul", "ol", "task", "code", "codeblock",
      ];
  
      dispatchDropdown({
        type: "OPEN",
        payload: { position: { top: rect.top - editorRect.top, left: rect.left - editorRect.left }, items: dropdownItems },
      });
    } else if (event.key !== "Tab") {
      dispatchDropdown({ type: "CLOSE" });
    }
  };
  
  const handleDropdownSelect = (item: string) => {
    if (!editorRef.current) return;
    const editorInstance = editorRef.current.getInstance();
    const commandMapping: Record<string, () => void> = {
      "Heading 1": () => editorInstance.exec("heading", { level: 1 }),
      "Heading 2": () => editorInstance.exec("heading", { level: 2 }),
      "Heading 3": () => editorInstance.exec("heading", { level: 3 }),
      "Heading 4": () => editorInstance.exec("heading", { level: 4 }),
      "Heading 5": () => editorInstance.exec("heading", { level: 5 }),
      "Heading 6": () => editorInstance.exec("heading", { level: 6 }),
      bold: () => editorInstance.exec("bold"),
      italic: () => editorInstance.exec("italic"),
      strike: () => editorInstance.exec("strike"),
      hr: () => editorInstance.exec("hr"),
      ul: () => editorInstance.exec("bulletList"),
      ol: () => editorInstance.exec("orderedList"),
      task: () => editorInstance.exec("taskList"),
      code: () => editorInstance.exec("code"),
      codeblock: () => editorInstance.exec("codeBlock"),
    };

    commandMapping[item]?.();
    editorInstance.focus();
    dispatchDropdown({ type: "CLOSE" });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading document.</div>;

  return (
    <div className="relative">
      <div
        ref={editorContainerRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="focus:outline-none"
      >
        <Editor
          ref={editorRef}
          height="800px"
          initialValue={data?.[0]?.content || "Enter your content here..."  }
          initialEditType="wysiwyg"
          previewStyle="vertical"
          plugins={plugins}
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Save
      </button>

      {dropdownState.visible && (
        <div
          style={{
            position: "absolute",
            top: dropdownState.position.top,
            left: dropdownState.position.left,
            zIndex: 1000,
          }}
        >
          <DropdownMenu
            open={dropdownState.visible}
            onOpenChange={() => dispatchDropdown({ type: "CLOSE" })}
          >
            <DropdownMenuTrigger asChild>
              <div />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border rounded shadow-lg w-40">
              {dropdownState.items.map(item => (
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
      )}
    </div>
  );
};

export default MyEditor;
