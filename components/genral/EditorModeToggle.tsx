import { ActionButton } from "@/app/components/torch/components/ActionButton";
import { Button } from "@/app/components/torch/components/Button";
import React from "react";

interface EditorToolbarProps {
  editorMode: "wysiwyg" | "markdown";
  toggleMode: () => void;
  onSave: () => void;
  onUndo: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editorMode,
  toggleMode,
}) => {
  return (
    <div className="flex p-1 justify-end items-start gap-1 rounded-[10px] border border-white/20 bg-black/75 backdrop-blur-lg">
      <Button className="text-white" size={"L"} onClick={toggleMode}>
        {editorMode === "wysiwyg" ? "Markdown" : "WYSIWYG"}
      </Button>
      <Button className="text-white" size={"L"}>
        View
      </Button>
      <Button className="text-white" size={"L"}>
        Print Layout
      </Button>
      <div className="h-8 w-px bg-slate-400" />
      <ActionButton className="hover:bg-red-600" size={"M"}>
        {<i className="text-white ri-close-fill"></i>}
      </ActionButton>
    </div>
  );
};

export default EditorToolbar;
