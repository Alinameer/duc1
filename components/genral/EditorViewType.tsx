import { Button } from "@/app/components/torch/components/Button";
import TabFormItem from "@/app/components/torch/components/TabFormItem";
import { useState } from "react";
import { marked } from "marked";

interface EditorViewTypeProps {
  editorMode: "wysiwyg" | "markdown" | "print";
  setEditorMode: (mode: "wysiwyg" | "markdown" | "print") => void;
  markdownContent: string;
  documentTitle: string;
}

const EditorViewType: React.FC<EditorViewTypeProps> = ({
  editorMode,
  setEditorMode,
  markdownContent,
  documentTitle,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const handlePrint = () => {
    const htmlContent = marked(markdownContent); // Convert Markdown to HTML

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${documentTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              pre, code { white-space: pre-wrap; word-wrap: break-word; }
              button { display: none; } /* Hide button when printing */
            </style>
          </head>
          <body>
            <h1>${documentTitle}</h1>
            <div>${htmlContent}</div>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="relative">
      <div
        className={`transition-all duration-300 ease-in-out transform ${
          collapsed
            ? "animate-float-out pointer-events-none"
            : "animate-float-in"
        }`}
      >
        <div className="flex p-1 justify-end items-start gap-1 rounded-[10px] border border-white/20 bg-black-alpha-75 backdrop-blur-[20px]">
          <TabFormItem
            theme="dark"
            active={editorMode === "markdown"}
            componentType={"top"}
            onClick={() => setEditorMode("markdown")}
          >
            Markdown
          </TabFormItem>
          <TabFormItem
            theme="dark"
            componentType={"top"}
            active={editorMode === "wysiwyg"}
            onClick={() => setEditorMode("wysiwyg")}
          >
            View
          </TabFormItem>
          <div className="bg-white-alpha-20 w-[1px] h-[28px]" />
          <TabFormItem
            theme="dark"
            componentType={"top"}
            active={editorMode === "print"}
            onClick={() => setEditorMode("print")}
          >
            Print Layout
          </TabFormItem>
          <div className="bg-white-alpha-20 w-[1px] h-[28px]" />
          <Button
            theme="dark"
            buttonType={"icon"}
            variant={"RedContStyle"}
            size="L"
            onClick={() => setCollapsed(true)}
          >
            <i className="ri-close-fill transition-all duration-300 ease-in-out" />
          </Button>
        </div>
      </div>

      {collapsed && (
        <div className="absolute bottom-4 right-4 animate-float-in">
          <Button
            buttonType={"icon"}
            size="L"
            onClick={() => setCollapsed(false)}
          >
            <i className="ri-add-fill" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditorViewType;
