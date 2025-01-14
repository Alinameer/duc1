"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  const [folders, setFolders] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [renamingItem, setRenamingItem] = useState<{
    type: "folder" | "file";
    index: number;
  } | null>(null);
  const [newName, setNewName] = useState("");

  const handleAddFolder = () => {
    const folderName = `New Folder ${folders.length + 1}`;
    setFolders([...folders, folderName]);
  };

  const handleAddFile = () => {
    const fileName = `New File ${files.length + 1}`;
    setFiles([...files, fileName]);
  };

  const handleRightClick = (
    event: React.MouseEvent,
    type: "folder" | "file",
    index: number
  ) => {
    event.preventDefault();
    setRenamingItem({ type, index });
    setNewName(type === "folder" ? folders[index] : files[index]);
  };

  const handleRename = () => {
    if (renamingItem && newName.trim()) {
      if (renamingItem.type === "folder") {
        const updatedFolders = [...folders];
        updatedFolders[renamingItem.index] = newName;
        setFolders(updatedFolders);
      } else {
        const updatedFiles = [...files];
        updatedFiles[renamingItem.index] = newName;
        setFiles(updatedFiles);
      }
      setRenamingItem(null);
      setNewName("");
    }
  };

  return (
    <Sidebar className="absolute">
      {/* Header with Workspace Dropdown */}
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

          {/* Additional Menu Items */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="flex w-full gap-2 items-center justify-center">
                  <FolderPlus
                    className="w-5 h-5 text-blue-500 cursor-pointer"
                    onClick={handleAddFolder}
                  />
                  <FilePlus2
                    className="w-5 h-5 text-blue-500 cursor-pointer"
                    onClick={handleAddFile}
                  />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Render Folders */}
          {folders.map((folder, index) => (
            <SidebarGroup
              key={index}
              onContextMenu={(e) => handleRightClick(e, "folder", index)}
            >
              {renamingItem?.type === "folder" &&
              renamingItem.index === index ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleRename}
                  onKeyPress={(e) => e.key === "Enter" && handleRename()}
                  autoFocus
                />
              ) : (
                <SidebarGroupLabel>{folder}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                {/* You can add nested files or folders here if needed */}
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

          {/* Render Files */}
          {files.map((file, index) => (
            <SidebarMenuItem
              key={index}
              onContextMenu={(e) => handleRightClick(e, "file", index)}
            >
              {renamingItem?.type === "file" && renamingItem.index === index ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleRename}
                  onKeyPress={(e) => e.key === "Enter" && handleRename()}
                  autoFocus
                />
              ) : (
                <span>{file}</span>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}
