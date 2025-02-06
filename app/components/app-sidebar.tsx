"use client";
import { ReactNode, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
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
import {
  ChevronDown,
  ChevronRight,
  ClipboardPaste,
  Copy,
  Edit,
  FilePlus2,
  FolderPlus,
  Trash,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

import { getCategory } from "@/api/api";
import SearchComponent from "@/components/genral/Search";

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

interface Document {
  id: string;
  title: string;
  content: string;
}

interface Category {
  id: string;
  name: string;
  cate_parent: string | null;
  subcategories: Category[];
  documents: Document[];
}

const routes = [
  { label: "Frontend", path: "/frontend" },
  { label: "Backend", path: "/backend" },
  { label: "API", path: "/api" },
  { label: "Server", path: "/server" },
  { label: "Finance", path: "/finance" },
];

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
    label: "Cut",
    icon: <span>{<Copy />}</span>,
    onClick: () => alert("Cut clicked"),
  },
  {
    label: "Paste",
    icon: <span>{<ClipboardPaste />}</span>,
    onClick: () => alert("Paste clicked"),
  },
];

interface CategoryItemProps {
  category: Category;
}

function CategoryItem({ category }: CategoryItemProps) {
  const hasChildren =
    category.subcategories && category.subcategories.length > 0;
  const hasDocuments = category.documents && category.documents.length > 0;

  return (
    <SidebarGroup>
      <Collapsible defaultOpen>
        <ReusableContextMenu
          trigger={
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="flex items-center">
                  <span className="mr-2">
                    {hasChildren ? <ChevronDown /> : <ChevronRight />}
                  </span>
                  {category.name}
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          }
          items={contextMenuItems}
        />
        <CollapsibleContent>
          <SidebarMenuSub>
            {hasChildren &&
              category.subcategories.map((subcat) => (
                <CategoryItem key={subcat.id} category={subcat} />
              ))}
            {hasDocuments &&
              category.documents.map((doc) => (
                <SidebarMenuSubItem key={doc.id}>
                  <Link href={`/${doc.id}`}>
                    <div>{doc.title}</div>
                  </Link>
                </SidebarMenuSubItem>
              ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  // State for workspace and manual submenus
  const [selectedWorkspace, setSelectedWorkspace] =
    useState("Select Workspace");
  const [subMenus, setSubMenus] = useState<{ id: string; items: string[] }[]>([]);
  const [selectedSubMenuId, setSelectedSubMenuId] = useState<string | null>(null);
  const collapsibleStates = useRef<Record<string, boolean>>({});

  const handleAddSubMenu = () => {
    const newSubMenu = {
      id: `Folder-${subMenus.length + 1}`,
      items: [],
    };
    setSubMenus([...subMenus, newSubMenu]);
    setSelectedSubMenuId(newSubMenu.id);
    collapsibleStates.current[newSubMenu.id] = true;
  };

  const handleAddSubMenuItem = () => {
    if (!selectedSubMenuId) return;
    setSubMenus((prevSubMenus) =>
      prevSubMenus.map((subMenu) =>
        subMenu.id === selectedSubMenuId
          ? {
              ...subMenu,
              items: [
                ...subMenu.items,
                `Document-${subMenu.items.length + 1}`,
              ],
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
    setSubMenus([...subMenus]); // Trigger a re-render
  };

  // Fetch categories from the API using your getCategory function
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["c"],
    queryFn: getCategory,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !categories) return <div>Error fetching categories.</div>;

  return (
    <Sidebar className="absolute">
      <SearchComponent />
      <SidebarHeader>
        <SidebarMenu>
          {/* Workspace Selection (currently commented out)
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
          */}

          {/* Manual Submenu Controls (currently commented out)
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="flex w-full gap-2 items-center justify-center">
                  <FolderPlus
                    className="w-5 h-5 text-blue-500 cursor-pointer"
                    onClick={handleAddSubMenu}
                  />
                  <FilePlus2
                    className="w-5 h-5 text-blue-500 cursor-pointer"
                    onClick={handleAddSubMenuItem}
                  />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          

          {/* Render manually added submenus (currently commented out)
          {subMenus.map((subMenu) => (
            <SidebarGroup key={subMenu.id}>
              <Collapsible
                open={collapsibleStates.current[subMenu.id] || false}
                onOpenChange={() => toggleCollapsible(subMenu.id)}
              >
                <ReusableContextMenu
                  trigger={
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={`${
                            selectedSubMenuId === subMenu.id ? "bg-blue-100" : ""
                          }`}
                          onClick={() => handleSelectSubMenu(subMenu.id)}
                        >
                          <span>
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
          */}

          {/* Render Categories recursively from your API data */}
          <SidebarGroup>
            <Collapsible defaultOpen>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {categories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}
