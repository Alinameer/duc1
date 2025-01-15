"use client"; 
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { ReactNode, useState, useRef } from "react";

interface MenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface ReusableContextMenuProps {
  trigger: ReactNode; // The content that triggers the context menu
  items: MenuItem[]; // Array of menu items
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

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, ClipboardPaste, Copy, Delete, DeleteIcon, Edit, FilePlus2, FolderPlus, Trash } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

const routes = [
  { label: "Frontend", path: "/frontend" },
  { label: "Backend", path: "/backend" },
  { label: "API", path: "/api" },
  { label: "Server", path: "/server" },
  { label: "Finance", path: "/finance" },
];

export function AppSidebar() {
  const [selectedWorkspace, setSelectedWorkspace] =
    useState("Select Workspace");
  const [subMenus, setSubMenus] = useState<{ id: string; items: string[] }[]>(
    []
  );
  const [selectedSubMenuId, setSelectedSubMenuId] = useState<string | null>(
    null
  );

  // Use a ref to track the open/closed state of each collapsible section
  const collapsibleStates = useRef<Record<string, boolean>>({});

  const handleAddSubMenu = () => {
    const newSubMenu = {
      id: `Folder-${subMenus.length + 1}`,
      items: [],
    };
    setSubMenus([...subMenus, newSubMenu]);
    setSelectedSubMenuId(newSubMenu.id); // Automatically select the newly created submenu
    collapsibleStates.current[newSubMenu.id] = true; // Automatically open the newly created submenu
  };

  const handleAddSubMenuItem = () => {
    if (!selectedSubMenuId) return;
    setSubMenus((prevSubMenus) =>
      prevSubMenus.map((subMenu) =>
        subMenu.id === selectedSubMenuId
          ? {
              ...subMenu,
              items: [...subMenu.items, `Document-${subMenu.items.length + 1}`],
            }
          : subMenu
      )
    );
  };

  const handleSelectSubMenu = (subMenuId: string) => {
    setSelectedSubMenuId(subMenuId);
  };

  const toggleCollapsible = (subMenuId: string) => {
    collapsibleStates.current[subMenuId] =
      !collapsibleStates.current[subMenuId];
    // Force re-render by updating state
    setSubMenus([...subMenus]);
  };

  const contextMenuItems: MenuItem[] = [
    {
      label: "Rename",
      icon: <span className="w-4 h-4">{<Edit />}</span>,
      onClick: () => alert("Rename clicked"),
    },
    {
      label: "Delete",
      icon: <span>{<Trash />}</span>,
      onClick: () => alert("Delete clicked"),
    },
    {
      label: "Copy",
      icon: <span>{<Copy />}</span>,
      onClick: () => alert("Copy clicked"),
    },
    {
      label: "Paste",
      icon: <span>{<ClipboardPaste />}</span>,
      onClick: () => alert("Paste clicked"),
    },
  ];

  return (
    <Sidebar className="absolute">
      <SidebarHeader>
        <SidebarMenu>
          {/* Workspace Selection */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center justify-between">
                  <span>{selectedWorkspace}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                {routes.map((route) => (
                  <DropdownMenuItem key={route.path}>
                    <Link href={route.path}>
                      <div onClick={() => setSelectedWorkspace(route.label)}>
                        <span>{route.label}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          {/* Add Submenu and Items */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="flex w-full gap-2 items-center justify-center">
                  <FolderPlus
                    className="w-5 h-5 text-blue-500"
                    onClick={handleAddSubMenu}
                  />
                  <FilePlus2
                    className="w-5 h-5 text-blue-500"
                    onClick={handleAddSubMenuItem}
                  />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Submenus */}
          {subMenus.map((subMenu) => (
            <SidebarGroup key={subMenu.id}>
              <Collapsible
                open={collapsibleStates.current[subMenu.id] || false}
                onOpenChange={() => toggleCollapsible(subMenu.id)}
                className="group/collapsible"
              >
                <ReusableContextMenu
                  trigger={
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={`${
                            selectedSubMenuId === subMenu.id
                              ? "bg-blue-100"
                              : ""
                          }`}
                          onClick={() => handleSelectSubMenu(subMenu.id)}
                        >
                          <span>
                            {/* Conditional rendering based on ref state */}
                            {collapsibleStates.current[subMenu.id] ? (
                              <ChevronDown />
                            ) : (
                              <ChevronRight />
                            )}
                          </span>
                          {subMenu.id}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {subMenu.items.map((item) => (
                            <SidebarMenuSubItem key={item}>
                              {item}
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  }
                  items={contextMenuItems}
                />
              </Collapsible>
            </SidebarGroup>
          ))}
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}