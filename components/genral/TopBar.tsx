import { ActionButton } from "@/app/components/torch/components/ActionButton";
import { Badge } from "@/app/components/torch/components/Badge";
import { Button } from "@/app/components/torch/components/Button";
import {
  DropDownButton,
  DropDownButtonContent,
  DropDownButtonItem,
  DropDownButtonTrigger,
  DropDownButtonValue,
} from "@/app/components/torch/components/DropDownButton";
import React from "react";

interface TopBarProps {
  title?: string;
  pages?: { name: string; href: string }[];
  rightIcon?: React.ReactNode;
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title, rightIcon, className }) => {
  return (
    <div
      style={{
        borderBottom:
          "1px solid var(--Border-Presentation-Global-Primary, #D4D4D4)",
        boxShadow:
          "0px 2px 9px 0px var(--Background-Presentation-Form-Header-Shadow, rgba(0, 0, 0, 0.10))",
        backdropFilter: "blur(8px)",
      }}
      className={`
        bg-[var(--Background-Presentation-Form-Header, rgba(255, 255, 255, 0.20))]
        flex
        items-center
        justify-between
        p-2  /* 8px padding */
        text-black
        ${className ?? ""}
      `}
    >
      {/* Left Section (title with divider and badge) */}
      <div className="flex items-stretch">
        <div className="flex items-center space-x-2">
          {title && (
            <h1 className="text-[var(--Content-Presentation-Global-Primary,#000)] text-[28px] leading-normal uppercase [font-feature-settings:'cv05'] font-[var(--Font-family-System-Font-En,_SF_Pro)]">
              {title}
            </h1>
          )}
          <div className="h-6 w-px bg-slate-400" />

          <Badge
            className="bg-gradient-to-r from-[#1A7C8F] via-[#235066] to-[#243C59]"
            size={"M"}
            label="Auto SAVE"
            theme="dark"
          />
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 self-stretch">
        <div className="h-6 w-px bg-slate-400" />
        <Button size={"L"}>Print</Button>
        <Button variant={"BlueContStyle"} size={"L"}>
          Create New Revidion
        </Button>
        <div className="h-6 w-px bg-slate-400" />
        <DropDownButton>
          <DropDownButtonTrigger size={"M"}>
            <DropDownButtonValue placeholder="More" />
          </DropDownButtonTrigger>
          <DropDownButtonContent className="z-[99]">
            <DropDownButtonItem value="apple">Apple</DropDownButtonItem>
            <DropDownButtonItem value="banana">Banana</DropDownButtonItem>
            <DropDownButtonItem value="blueberry">Blueberry</DropDownButtonItem>
            <DropDownButtonItem value="grapes">Grapes</DropDownButtonItem>
            <DropDownButtonItem value="pineapple">Pineapple</DropDownButtonItem>
          </DropDownButtonContent>
        </DropDownButton>
        <div className="h-6 w-px bg-slate-400" />
        <Button buttonType={"icon"} variant={"RedSecStyle"} size={"M"}>
          {<i className="ri-close-fill"></i>}
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
