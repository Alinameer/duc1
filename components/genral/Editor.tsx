"use client";

import React, {
  useEffect,
  useRef,
  useReducer,
  useState,
  KeyboardEvent,
} from "react";
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

import CustomToolbar from "./CustomToolbar";
import EditorViewType from "./EditorViewType";
import PrintLayout from "./PrintLayout";

// Dynamically import the Editor (disables SSR)
const Editor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

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

const dropdownReducer = (
  state: DropdownState,
  action: DropdownAction
): DropdownState => {
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

  // Extend editorMode type to include "print"
  const [editorMode, setEditorMode] = useState<
    "wysiwyg" | "markdown" | "print"
  >("wysiwyg");
  const [dropdownState, dispatchDropdown] = useReducer(dropdownReducer, {
    visible: false,
    position: { top: 0, left: 0 },
    items: [],
  });
  const [plugins, setPlugins] = useState<any[]>([]);

  // Load editor plugins dynamically.
  useEffect(() => {
    const loadPlugins = async () => {
      const { default: Prism } = await import("prismjs");
      const [codeSyntaxHighlight, tableMergedCell, uml, chart] =
        await Promise.all([
          import("@toast-ui/editor-plugin-code-syntax-highlight").then(
            (mod) => mod.default
          ),
          import("@toast-ui/editor-plugin-table-merged-cell").then(
            (mod) => mod.default
          ),
          import("@toast-ui/editor-plugin-uml").then((mod) => mod.default),
          import("@toast-ui/editor-plugin-chart").then((mod) => mod.default),
        ]);

      setPlugins([
        [
          chart,
          { minWidth: 100, maxWidth: 600, minHeight: 100, maxHeight: 300 },
        ],
        [codeSyntaxHighlight, { highlighter: Prism }],
        tableMergedCell,
        uml,
      ]);
    };

    loadPlugins();
  }, []);

  // Fetch document data using react-query.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["documents", docId],
    queryFn: () => getDocument(docId),
    enabled: !!docId,
  });
  console.log(data, "dddddddddddd");

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

  // Handle keydown events (skip in print mode)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (editorMode === "print") return;

    const editorInstance = editorRef.current?.getInstance();
    if (!editorInstance) return;

    const key = event.key.toLowerCase();
    const isCtrlPressed = event.ctrlKey || event.metaKey;

    const commandMapping: Record<string, () => void> = {
      d: () => editorInstance.exec("bold"),
      i: () => editorInstance.exec("italic"),
      "`": () => editorInstance.exec("code"),
      "1": () => editorInstance.exec("heading", { level: 1 }),
      "2": () => editorInstance.exec("heading", { level: 2 }),
      "3": () => editorInstance.exec("heading", { level: 3 }),
      "4": () => editorInstance.exec("heading", { level: 4 }),
      "5": () => editorInstance.exec("heading", { level: 5 }),
      "6": () => editorInstance.exec("heading", { level: 6 }),
      o: () => editorInstance.exec("ol"),
      u: () => editorInstance.exec("ul"),
      e: () => editorInstance.exec("codeBlock"),
      s: () => handleSave(),
    };

    if (isCtrlPressed && commandMapping[key]) {
      event.preventDefault();
      commandMapping[key]?.();
      return;
    }

    if (event.key === "/") {
      event.preventDefault();
      if (!editorContainerRef.current) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorContainerRef.current.getBoundingClientRect();

      const dropdownItems = [
        "Heading 1",
        "Heading 2",
        "Heading 3",
        "Heading 4",
        "Heading 5",
        "Heading 6",
        "bold",
        "italic",
        "strike",
        "hr",
        "ul",
        "ol",
        "task",
        "code",
        "codeblock",
      ];

      dispatchDropdown({
        type: "OPEN",
        payload: {
          position: {
            top: rect.top - editorRect.top,
            left: rect.left - editorRect.left,
          },
          items: dropdownItems,
        },
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

  // Updated function to handle mode changes.
  const handleEditorModeChange = (mode: "wysiwyg" | "markdown" | "print") => {
    setEditorMode(mode);
    if (mode === "print") {
      // No need to adjust the editor instance for print mode.
      return;
    }
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.changeMode(mode);
      editorInstance.focus();
    }
  };

  return (
    <div className="relative">
      <div
        ref={editorContainerRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="focus:outline-none"
      >
        <div className="absolute bottom-4 right-4 z-50">
          <EditorViewType
            editorMode={editorMode}
            setEditorMode={handleEditorModeChange}
            markdownContent={data?.[0]?.content || ""}
            documentTitle={data?.[0]?.title || "Untitled Document"}
          />
        </div>
        {editorMode !== "print" && (
          <>
            {editorRef.current && (
              <CustomToolbar editor={editorRef.current.getInstance()} />
            )}
            <Editor
              ref={editorRef}
              height="86vh"
              initialValue={data?.[0]?.content || "Enter your content here..."}
              initialEditType="wysiwyg"
              previewStyle="vertical"
              plugins={plugins}
              onChange={handleSave}
            />
          </>
        )}
        {editorMode === "print" && (
          <PrintLayout
            content={data?.[0]?.content || "Enter your content here..."}
          />
        )}
      </div>

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
              {dropdownState.items.map((item) => (
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
