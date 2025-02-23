import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { ReactNode } from "react";

interface MenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface ReusableContextMenuProps {
  trigger: ReactNode;
  items: MenuItem[];
}

export function ReusableContextMenu({
  trigger,
  items,
}: ReusableContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{trigger}</ContextMenuTrigger>
      <ContextMenuContent className="bg-background border border-gray-200 rounded-lg shadow-lg">
        {items.map((item, index) => (
          <ContextMenuItem key={index} onClick={item.onClick}>
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
