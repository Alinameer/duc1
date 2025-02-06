"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DocumentTitleContextType {
  title: string;
  setTitle: (title: string) => void;
}

const DocumentTitleContext = createContext<DocumentTitleContextType>({
  title: "TechDoc",
  setTitle: () => {},
});

export const useDocumentTitle = () => useContext(DocumentTitleContext);

export const DocumentTitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState("TechDoc");

  return (
    <DocumentTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </DocumentTitleContext.Provider>
  );
};