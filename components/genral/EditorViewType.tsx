import { Button } from "@/app/components/torch/components/Button";
import TabFormItem from "@/app/components/torch/components/TabFormItem";
import { useState } from "react";

interface EditorViewTypeProps {
  editorMode: "wysiwyg" | "markdown" | "print";
  setEditorMode: (mode: "wysiwyg" | "markdown" | "print") => void;
}

const EditorViewType: React.FC<EditorViewTypeProps> = ({
  editorMode,
  setEditorMode,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative ">
      {/* Toolbar container with animation */}
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
            active={editorMode == "markdown"}
            componentType={"top"}
            onClick={() => setEditorMode("markdown")}
          >
            Markdown
          </TabFormItem>
          <TabFormItem
            theme="dark"
            componentType={"top"}
            active={editorMode == "wysiwyg"}
            onClick={() => setEditorMode("wysiwyg")}
          >
            View
          </TabFormItem>
          <div className="  bg-white-alpha-20 w-[1px] h-[28px]" />
          <TabFormItem
            theme="dark"
            componentType={"top"}
            active={editorMode === "print"}
            onClick={() => setEditorMode("print")}
          >
            Print Layout
          </TabFormItem>
          <div className="  bg-white-alpha-20 w-[1px] h-[28px]" />
          <Button
            theme="dark"
            buttonType={"icon"}
            variant={"RedContStyle"}
            size="L"
            onClick={() => setCollapsed(true)}
          >
            <i className=" ri-close-fill transition-all duration-300 ease-in-out" />
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
