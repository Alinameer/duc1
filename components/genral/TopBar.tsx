import React from "react";

interface TopBarProps {
  title?: string;
  pages?: { name: string; href: string }[];
  leftIcon?: React.ReactNode;
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  pages = [],
  leftIcon,
  className,
}) => {
  return (
    <div
      className={`p-4 bg-blue-600 text-white shadow-md ${className}`}
    >
      <div className="flex items-center space-x-2">
        {leftIcon && <div>{leftIcon}</div>}
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
      </div>
    </div>
  );
};

export default TopBar;
