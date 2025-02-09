"use client";

import { ReactNode, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

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
import { twMerge } from "tailwind-merge";
import { ReusableContextMenu } from "./ReusableContextMenu";
import InputModal from "./InputModal";

//
// Interfaces
//
interface MenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
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
// DocumentItem Component – uses InputModal for renaming
//
function DocumentItem({ doc }: { doc: Document }) {
  const queryClient = useQueryClient();

  const { mutate: updateDoc } = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["c"] }),
    onError: (error: any) =>
      console.error("Error during document update:", error),
  });

  const { mutate: deleteDoc } = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["c"] }),
    onError: (error: any) =>
      console.error("Error during document deletion:", error),
  });

  // State to control the renaming modal
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const handleRename = () => {
    setIsRenameModalOpen(true);
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
    <>
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
      <InputModal
        open={isRenameModalOpen}
        title="Rename Document"
        placeholder="Enter new title"
        initialValue={doc.title}
        onSave={(newTitle) => {
          if (newTitle && newTitle !== doc.title) {
            updateDoc({ id: doc.id, title: newTitle });
          }
          setIsRenameModalOpen(false);
        }}
        onCancel={() => setIsRenameModalOpen(false)}
        onOpenChange={(open) => setIsRenameModalOpen(open)}
      />
    </>
  );
}

//
// CategoryItem Component – uses InputModal for renaming (renders recursively)
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["c"] }),
    onError: (error: any) =>
      console.error("Error during category update:", error),
  });

  const { mutate: deleteCat } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["c"] }),
    onError: (error: any) =>
      console.error("Error during category deletion:", error),
  });

  // State for the renaming modal
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const handleRename = () => {
    setIsRenameModalOpen(true);
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
  return (
    <>
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
                        ? "bg-gray-200 hover:bg-gray-200 text-accent-foreground"
                        : ""
                    )}
                    onClick={() => setSelectId(category.id)}
                  >
                    <span className="mr-2">
                      {selectId ? <ChevronDown /> : <ChevronRight />}
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
      <InputModal
        open={isRenameModalOpen}
        title="Rename Category"
        placeholder="Enter new category name"
        initialValue={category.name}
        onSave={(newName) => {
          if (newName && newName !== category.name) {
            updateCat({ id: category.id, name: newName });
          }
          setIsRenameModalOpen(false);
        }}
        onCancel={() => setIsRenameModalOpen(false)}
        onOpenChange={(open) => setIsRenameModalOpen(open)}
      />
    </>
  );
}

//
// AppSidebar Component – uses InputModal to add new categories/documents
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["c"] }),
    onError: (error: any) =>
      console.error("Error during category creation:", error),
  });
  const [selectId, setSelectId] = useState<string | null>(null);

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);

  const createDocumentMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["c"] }),
    onError: (error: any) =>
      console.error("Error during document creation:", error),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !categories)
    return <div>Error fetching categories.</div>;

  const handleAddCategory = () => {
    setIsAddCategoryModalOpen(true);
  };

  const handleAddDocument = () => {
    setIsAddDocumentModalOpen(true);
  };

  return (
    <>
      <Sidebar className="absolute">
        <SearchComponent />
        <SidebarHeader>
          <SidebarMenu>
            <SidebarGroup>
              <SidebarMenuItem className="flex w-full gap-2 items-center justify-center">
                <FolderPlus
                  className="w-5 h-5 text-blue-500 cursor-pointer"
                  onClick={handleAddCategory}
                />
                <FilePlus2
                  className="w-5 h-5 text-blue-500 cursor-pointer"
                  onClick={handleAddDocument}
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

      {/* Modal for Adding a New Category */}
      <InputModal
        open={isAddCategoryModalOpen}
        title="Add New Category"
        placeholder="Enter category name"
        initialValue=""
        onSave={(newCategoryName) => {
          if (newCategoryName) {
            createCategoryMutation.mutate({
              name: newCategoryName,
              cate_parent: selectId || null,
            });
          }
          setIsAddCategoryModalOpen(false);
        }}
        onCancel={() => setIsAddCategoryModalOpen(false)}
        onOpenChange={(open) => setIsAddCategoryModalOpen(open)}
      />

      {/* Modal for Adding a New Document */}
      <InputModal
        open={isAddDocumentModalOpen}
        title="Add New Document"
        placeholder="Enter document title"
        initialValue=""
        onSave={(newDocumentTitle) => {
          if (newDocumentTitle) {
            createDocumentMutation.mutate({
              title: newDocumentTitle,
              content: "",
              category: selectId,
            });
          }
          setIsAddDocumentModalOpen(false);
        }}
        onCancel={() => setIsAddDocumentModalOpen(false)}
        onOpenChange={(open) => setIsAddDocumentModalOpen(open)}
      />
    </>
  );
}
