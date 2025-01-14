"use client";

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
import { ChevronDown, FilePlus2, FolderPlus } from "lucide-react";
import { useState } from "react";
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
  { label: "Finans", path: "/finans" },
];

export function AppSidebar() {
  const [selectedWorkspace, setSelectedWorkspace] =
    useState("Select Workspace");
  const [subMenus, setSubMenus] = useState<{ id: string; items: string[] }[]>(
    []
  );

  const handleAddSubMenu = () => {
    const newSubMenu = {
      id: `submenu-${subMenus.length + 1}`,
      items: [],
    };
    setSubMenus([...subMenus, newSubMenu]);
  };

  const handleAddSubMenuItem = (subMenuId: string) => {
    setSubMenus((prevSubMenus) =>
      prevSubMenus.map((subMenu) =>
        subMenu.id === subMenuId
          ? {
              ...subMenu,
              items: [...subMenu.items, `item-${subMenu.items.length + 1}`],
            }
          : subMenu
      )
    );
  };


  

  return (
    <Sidebar className="absolute">
      {/* Header with Workspace Selection */}
      <SidebarHeader>
        <SidebarMenu>
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
                    onClick={() =>
                      handleAddSubMenuItem(subMenus[subMenus.length - 1]?.id)
                    }
                  />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {subMenus.map((subMenu) => (
            <SidebarGroup key={subMenu.id}>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton> <span>{<ChevronDown />}</span> {subMenu.id}</SidebarMenuButton>
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
              </Collapsible>
            </SidebarGroup>
          ))}
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}
