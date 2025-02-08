"use client";

import { ReactNode, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  ChevronDown,
  ChevronRight,
  ClipboardPaste,
  Copy,
  Edit,
  Trash,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

import {
  getCategory,
  updateDocument,
  updateCategory,
  deleteCategory,
  deleteDocument,
  createCategory,
  createDocument,
} from "@/api/api";

import { FilePlus2, FolderPlus } from "lucide-react";

import SearchComponent from "@/components/genral/Search";
import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";

//
// Interfaces
//
interface MenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface ReusableContextMenuProps {
  trigger: ReactNode;
  items: MenuItem[];
}

export interface Document {
  id: string;
  title: string;
  content: string;
}

export interface Category {
  id: string;
  name: string;
  cate_parent: string | null;
  subcategories: Category[];
  documents: Document[];
}

//
// Reusable Context Menu Component
//
export function ReusableContextMenu({
  trigger,
  items,
}: ReusableContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger> {trigger}</ContextMenuTrigger>
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

function DocumentItem({ doc }: { doc: Document }) {
  const queryClient = useQueryClient();

  const { mutate: updateDoc } = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["c"] });
    },
    onError: (error: any) => {
      console.error("Error during document update:", error);
    },
  });

  const { mutate: deleteDoc } = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["c"] });
    },
    onError: (error: any) => {
      console.error("Error during document deletion:", error);
    },
  });

  const handleRename = () => {
    const newTitle = prompt("Enter new title", doc.title);
    if (newTitle && newTitle !== doc.title) {
      updateDoc({
        id: doc.id,
        title: newTitle,
      });
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete document "${doc.title}"?`)) {
      deleteDoc({ id: doc.id });
    }
  };

  const contextMenuItems: MenuItem[] = [
    {
      label: "Rename",
      icon: (
        <span className="w-4 h-4">
          <Edit />
        </span>
      ),
      onClick: handleRename,
    },
    {
      label: "Delete",
      icon: <Trash />,
      onClick: handleDelete,
    },
    {
      label: "Cut",
      icon: <Copy />,
      onClick: () => alert("Cut clicked"),
    },
    {
      label: "Paste",
      icon: <ClipboardPaste />,
      onClick: () => alert("Paste clicked"),
    },
  ];

  return (
    <ReusableContextMenu
      trigger={
        <SidebarMenuSubItem>
          <Link href={`/${doc.id}`}>
            <div>{doc.title}</div>
          </Link>
        </SidebarMenuSubItem>
      }
      items={contextMenuItems}
    />
  );
}

//
// CategoryItem Component (renders recursively)
//
function CategoryItem({
  category,
  setSelectId,
  selectId,
}: {
  category: Category;
  setSelectId: any;
  selectId: any;
}) {
  const queryClient = useQueryClient();

  const { mutate: updateCat } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["c"] });
    },
    onError: (error: any) => {
      console.error("Error during category update:", error);
    },
  });

  const { mutate: deleteCat } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["c"] });
    },
    onError: (error: any) => {
      console.error("Error during category deletion:", error);
    },
  });

  const handleRename = () => {
    const newName = prompt("Enter new category name", category.name);
    if (newName && newName !== category.name) {
      updateCat({ id: category.id, name: newName });
    }
  };

  const handleDelete = () => {
    if (
      confirm(`Are you sure you want to delete category "${category.name}"?`)
    ) {
      deleteCat({ id: category.id });
    }
  };

  const contextMenuItems: MenuItem[] = [
    {
      label: "Rename",
      icon: (
        <span className="w-4 h-4">
          <Edit />
        </span>
      ),
      onClick: handleRename,
    },
    {
      label: "Delete",
      icon: <Trash />,
      onClick: handleDelete,
    },
    {
      label: "Cut",
      icon: <Copy />,
      onClick: () => alert("Cut clicked"),
    },
    {
      label: "Paste",
      icon: <ClipboardPaste />,
      onClick: () => alert("Paste clicked"),
    },
  ];

  const hasChildren = category.subcategories?.length > 0;
  const hasDocuments = category.documents?.length > 0;
  console.log(category.id === setSelectId);
  console.log(selectId, "selectId");
  console.log(category.id);

  return (
    <SidebarGroup>
      <Collapsible defaultOpen>
        <ReusableContextMenu
          trigger={
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className={twMerge(
                    "flex items-center ",
                    category.id === selectId
                      ? "bg-red-500 hover:bg-red-500 text-accent-foreground"
                      : null
                  )}
                  onClick={() => setSelectId(category.id)} // Set the category as selected
                >
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
                <CategoryItem
                  key={subcat.id}
                  category={subcat}
                  setSelectId={setSelectId}
                  selectId={selectId}
                />
              ))}
            {hasDocuments &&
              category.documents.map((doc) => (
                <DocumentItem key={doc.id} doc={doc} />
              ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}

//
// AppSidebar Component
//

export function AppSidebar() {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["c"],
    queryFn: getCategory,
  });

  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["c"] });
    },
    onError: (error: any) => {
      console.error("Error during category creation:", error);
    },
  });
  const [selectId, setSelectId] = useState(null);
  console.log(selectId, "dddddddddddddd");

  const handleAddCategory = () => {
    const newCategoryName = prompt("Enter new category name");
    if (newCategoryName) {
      const categoryData = {
        name: newCategoryName,
        cate_parent: selectId || null,
      };
      createCategoryMutation.mutate(categoryData);
    }
  };
  if (isLoading) return <div>Loading...</div>;
  if (isError || !categories) return <div>Error fetching categories.</div>;

    const createDocumentMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["c"] });
    },
    onError: (error: any) => {
      console.error("Error during document creation:", error);
    },
  });



  const handleAddDocument = () => {
    alert("Add document clicked");
  }; 

  return (
    <Sidebar className="absolute">
      <SearchComponent />
      <SidebarHeader>
        <SidebarMenu>
          <SidebarGroup>
            -{" "}
            <SidebarMenuItem className="flex w-full gap-2 items-center justify-center">
              <FolderPlus
                className="w-5 h-5 text-blue-500 cursor-pointer"
                onClick={handleAddCategory}
              />
              <FilePlus2
                className="w-5 h-5 text-blue-500 cursor-pointer"
                /* onClick={handleAddDocument} */
              />
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <Collapsible defaultOpen>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {categories.map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      setSelectId={setSelectId}
                      selectId={selectId}
                    />
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
