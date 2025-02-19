"use client";
import TopBar from "@/components/genral/TopBar";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import LogoutButton from "@/components/genral/LogoutButton";
import { useDocumentTitle } from "@/hooks/DocumentTitleContext";

const Header = () => {
  const { title } = useDocumentTitle();

  return (
    <header className="w-full top-0 z-50">
      <TopBar
        title={title} 
        rightIcon={<LogoutButton />}
      />
    </header>
  );
};

export default Header;
