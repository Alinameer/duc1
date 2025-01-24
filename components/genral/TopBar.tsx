import React from "react";

interface TopBarProps {
  title?: string;
  pages?: { name: string; href: string }[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode; // Add this line
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  pages = [],
  leftIcon,
  rightIcon, // Add this line
  className,
}) => {
  return (
    <div className={`p-4 bg-blue-600 text-white shadow-md ${className}`}>
      <div className="flex items-center justify-between">
        {" "}
        {/* Change this line */}
        <div className="flex items-center space-x-2">
          {leftIcon && <div>{leftIcon}</div>}
          {title && <h1 className="text-xl font-semibold">{title}</h1>}
        </div>
        {rightIcon && <div>{rightIcon}</div>} {/* Add this line */}
      </div>
    </div>
  );
};

export default TopBar;
