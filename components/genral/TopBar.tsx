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

       {/* TODO: adding buget and button  */}

      {/* Left Section (title WITH | ) */}
      <div className="flex items-stretch">
        <div className="flex items-center space-x-2">
          {title && (
            <h1 className="text-[var(--Content-Presentation-Global-Primary,#000)] font-[510] text-[28px] leading-normal uppercase [font-feature-settings:'cv05'] font-[var(--Font-family-System-Font-En,_SF_Pro)]">
              {title}
            </h1>
          )}
          <div className="h-6 w-px bg-slate-400" />
        </div>
      </div>

      {/* Right Section (icon) */}
      {rightIcon && <div>{rightIcon}</div>}
    </div>
  );
};

export default TopBar;
