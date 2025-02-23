"use client";

import { Button } from "@/app/components/torch/components/Button";
import { console } from "inspector";
import React, { useEffect } from "react";

interface CustomToolbarProps {
  editor: any; // Replace 'any' with a more specific type if available
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ editor }) => {
  const handleCommand = (command: any) => {
    if (editor) {
      editor.exec(command);
      editor.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          handleCommand("redo");
        } else {
          handleCommand("undo");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  const handleImage = () => {
    if (editor) {
      editor.eventEmitter.emit("openPopup", "image");
    }
  };

  const handleTable = () => {
    if (editor) {
      editor.eventEmitter.emit("openPopup", "table");
      // Alternatively, if your version exposes getUI():
      // editor.getUI().openPopup('table');
    }
  };

  return (
    <div className="flex h-[42px] pr-2 p-[5px] gap-[2px] items-center self-stretch border-b border-[var(--Border-Presentation-Global-Primary,#d4d4d4)] bg-[var(--Background-Presentation-Form-Header,rgba(255,255,255,0.2))] shadow-[0px_2px_9px_0px_var(--Background-Presentation-Form-Header-Shadow,rgba(0,0,0,0.1))] backdrop-blur-[8px] rounded-[4px]">
      <Button size={"M"} variant={"BorderStyle"}>
        <i className="ri-arrow-left-s-line"></i>
        Editor
      </Button>

      <div className="bg-border-presentation-global-primary w-[1px] h-[28px]" />

      <Button
        size={"M"}
        variant={"BlueContStyle"}
        onClick={() => handleCommand("undo")}
      >
        <i className="ri-arrow-go-back-line"></i>
      </Button>

      <Button
        size={"M"}
        variant={"BlueContStyle"}
        onClick={() => handleCommand("redo")}
      >
        <i className="ri-arrow-go-forward-line"></i>
      </Button>

      <div className="bg-border-presentation-global-primary w-[1px] h-[28px]" />

      <Button
        size={"M"}
        variant={"BlueContStyle"}
        onClick={() => handleCommand("bold")}
      >
        Normal Text
        <i className="ri-arrow-down-s-line"></i>
      </Button>

      <Button
        size={"M"}
        variant={"BlueContStyle"}
        onClick={() => handleCommand("bold")}
      >
        <i className="ri-align-left"></i>
        <i className="ri-arrow-down-s-line"></i>
      </Button>

      <Button
        variant={"BlueContStyle"}
        size={"M"}
        onClick={() => handleCommand("bold")}
      >
        <i className="ri-bold"></i>
      </Button>

      <Button
        variant={"BlueContStyle"}
        size={"M"}
        onClick={() => handleCommand("italic")}
      >
        <i className="ri-italic"></i>
      </Button>

      <Button
        variant={"BlueContStyle"}
        size={"M"}
        onClick={() => handleCommand("underline")}
      >
        <i className="ri-underline"></i>
      </Button>

      <Button
        variant={"BlueContStyle"}
        size={"M"}
        onClick={() => handleCommand("strike")}
      >
        <i className="ri-strikethrough"></i>
      </Button>

      <Button
        variant={"BlueContStyle"}
        size={"M"}
        onClick={() => handleCommand("bulletList")}
      >
        <i className="ri-list-unordered"></i>
      </Button>

      <Button
        variant={"BlueContStyle"}
        size={"M"}
        onClick={() => handleCommand("orderedList")}
      >
        <i className="ri-list-ordered-2"></i>
      </Button>

      <Button variant={"BlueContStyle"} size={"M"} onClick={handleImage}>
        <i className="ri-image-add-fill"></i>
      </Button>

      <Button variant={"BlueContStyle"} size={"M"} onClick={handleTable}>
        <i className="ri-table-line"></i>
      </Button>
    </div>
  );
};

export default CustomToolbar;
