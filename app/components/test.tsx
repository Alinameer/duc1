"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

// Define the File interface
interface File {
  id: string;
  name: string;
}

// Define the Folder interface
interface Folder {
  id: string;
  name: string;
  files: File[];
}

const ItemTypes = {
  FOLDER: "folder",
  FILE: "file",
} as const;

type ItemTypesKeys = keyof typeof ItemTypes;

interface DraggedItem {
  id: string;
  type: ItemTypesKeys;
  folderId?: string | null;
  index?: number;
}

const routes = [
  { label: "Frontend", path: "/Frontend" },
  { label: "Backend", path: "/Backend" },
  { label: "API", path: "/Apis" },
  { label: "Server", path: "/Server" },
];

const DraggableFolder = ({
  folder,
  index,
  moveFolder,
  moveFile,
  onRightClick,
}: {
  folder: Folder;
  index: number;
  moveFolder: (fromIndex: number, toIndex: number) => void;
  moveFile: (
    fromFolderId: string | null,
    toFolderId: string | null,
    fromIndex: number,
    toIndex: number
  ) => void;
  onRightClick: (
    event: React.MouseEvent,
    id: string,
    type: "folder" | "file"
  ) => void;
}) => {
  const [, drag] = useDrag({
    type: ItemTypes.FOLDER,
    item: { id: folder.id, index },
  });

  const [, drop] = useDrop({
    accept: [ItemTypes.FOLDER, ItemTypes.FILE],
    hover: (draggedItem: {
      id: string;
      index: number;
      type: string;
      folderId?: string;
    }) => {
      if (
        draggedItem.type === ItemTypes.FOLDER &&
        draggedItem.index !== index
      ) {
        moveFolder(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    drop: (draggedItem: { id: string; type: string; folderId?: string }) => {
      if (draggedItem.type === ItemTypes.FILE) {
        moveFile(
          draggedItem.folderId || null,
          folder.id,
          draggedItem.index,
          folder.files.length
        );
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))}>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarMenuItem
          onContextMenu={(e) => onRightClick(e, folder.id, "folder")}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>{folder.name}</SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {folder.files.map((file, fileIndex) => (
                <DraggableFile
                  key={file.id}
                  file={file}
                  folderId={folder.id}
                  fileIndex={fileIndex}
                  moveFile={moveFile}
                  onRightClick={onRightClick}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </div>
  );
};

const DraggableFile = ({
  file,
  folderId,
  fileIndex,
  moveFile,
  onRightClick,
}: {
  file: File;
  folderId: string | null;
  fileIndex: number;
  moveFile: (
    fromFolderId: string | null,
    toFolderId: string | null,
    fromIndex: number,
    toIndex: number
  ) => void;
  onRightClick: (
    event: React.MouseEvent,
    id: string,
    type: "folder" | "file"
  ) => void;
}) => {
  const [, drag] = useDrag({
    type: ItemTypes.FILE,
    item: { id: file.id, folderId, fileIndex, type: ItemTypes.FILE },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.FILE,
    hover: (draggedItem: {
      id: string;
      folderId: string | null;
      fileIndex: number;
    }) => {
      if (
        draggedItem.folderId === folderId &&
        draggedItem.fileIndex !== fileIndex
      ) {
        moveFile(
          draggedItem.folderId,
          folderId,
          draggedItem.fileIndex,
          fileIndex
        );
        draggedItem.fileIndex = fileIndex;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      onContextMenu={(e) => onRightClick(e, file.id, "file")}
    >
      <SidebarMenuSubItem>{file.name}</SidebarMenuSubItem>
    </div>
  );
};

export function test() {
  const [selectedWorkspace, setSelectedWorkspace] =
    useState("Select Workspace");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [topLevelFiles, setTopLevelFiles] = useState<File[]>([]);
  const [renamingItem, setRenamingItem] = useState<{
    id: string;
    type: "folder" | "file";
  } | null>(null);
  const [newName, setNewName] = useState("");

  const handleAddFolder = () => {
    const folderName = `New Folder ${folders.length + 1}`;
    setFolders([
      ...folders,
      { id: `folder-${Date.now()}`, name: folderName, files: [] },
    ]);
  };

  const handleAddFile = () => {
    const fileName = `New File ${topLevelFiles.length + 1}`;
    setTopLevelFiles([
      ...topLevelFiles,
      { id: `file-${Date.now()}`, name: fileName },
    ]);
  };

  const handleRightClick = (
    event: React.MouseEvent,
    id: string,
    type: "folder" | "file"
  ) => {
    event.preventDefault();
    setRenamingItem({ id, type });
    const item =
      type === "folder"
        ? folders.find((folder) => folder.id === id)
        : [...folders.flatMap((folder) => folder.files), ...topLevelFiles].find(
            (file) => file.id === id
          );
    if (item) setNewName(item.name);
  };

  const handleRename = () => {
    if (renamingItem && newName.trim()) {
      if (renamingItem.type === "folder") {
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === renamingItem.id
              ? { ...folder, name: newName }
              : folder
          )
        );
      } else {
        setTopLevelFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === renamingItem.id ? { ...file, name: newName } : file
          )
        );
        setFolders((prevFolders) =>
          prevFolders.map((folder) => ({
            ...folder,
            files: folder.files.map((file) =>
              file.id === renamingItem.id ? { ...file, name: newName } : file
            ),
          }))
        );
      }
      setRenamingItem(null);
      setNewName("");
    }
  };

  const moveFolder = (fromIndex: number, toIndex: number) => {
    const newFolders = [...folders];
    const [removed] = newFolders.splice(fromIndex, 1);
    newFolders.splice(toIndex, 0, removed);
    setFolders(newFolders);
  };

  const moveFile = (
    fromFolderId: string | null,
    toFolderId: string | null,
    fromIndex: number,
    toIndex: number
  ) => {
    if (fromFolderId === toFolderId) {
      // Reorder within the same folder or top level
      if (fromFolderId === null) {
        const newFiles = [...topLevelFiles];
        const [removed] = newFiles.splice(fromIndex, 1);
        newFiles.splice(toIndex, 0, removed);
        setTopLevelFiles(newFiles);
      } else {
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === fromFolderId
              ? {
                  ...folder,
                  files: (() => {
                    const newFiles = [...folder.files];
                    const [removed] = newFiles.splice(fromIndex, 1);
                    newFiles.splice(toIndex, 0, removed);
                    return newFiles;
                  })(),
                }
              : folder
          )
        );
      }
    } else {
      // Move between folders or between top level and folder
      let movedFile: File;
      if (fromFolderId === null) {
        const newFiles = [...topLevelFiles];
        [movedFile] = newFiles.splice(fromIndex, 1);
        setTopLevelFiles(newFiles);
      } else {
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === fromFolderId
              ? {
                  ...folder,
                  files: (() => {
                    const newFiles = [...folder.files];
                    [movedFile] = newFiles.splice(fromIndex, 1);
                    return newFiles;
                  })(),
                }
              : folder
          )
        );
      }

      if (toFolderId === null) {
        setTopLevelFiles((prevFiles) => {
          const newFiles = [...prevFiles];
          newFiles.splice(toIndex, 0, movedFile);
          return newFiles;
        });
      } else {
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === toFolderId
              ? {
                  ...folder,
                  files: (() => {
                    const newFiles = [...folder.files];
                    newFiles.splice(toIndex, 0, movedFile);
                    return newFiles;
                  })(),
                }
              : folder
          )
        );
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Sidebar className="absolute">
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

            {/* Top-level files */}
            {topLevelFiles.map((file, index) => (
              <DraggableFile
                key={file.id}
                file={file}
                folderId={null}
                fileIndex={index}
                moveFile={moveFile}
                onRightClick={handleRightClick}
              />
            ))}

            {/* Folders */}
            {folders.map((folder, index) => (
              <DraggableFolder
                key={folder.id}
                folder={folder}
                index={index}
                moveFolder={moveFolder}
                moveFile={moveFile}
                onRightClick={handleRightClick}
              />
            ))}
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>
    </DndProvider>
  );
}
