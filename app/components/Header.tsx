// components/Header.tsx
"use client";
import TopBar from '@/components/genral/TopBar';
import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import LogoutButton from '@/components/genral/LogoutButton';
import { useDocumentTitle } from '@/hooks/DocumentTitleContext';

const Header = () => {
  const { title } = useDocumentTitle();

  return (
    <header className="sticky w-full top-0 z-50">
      <TopBar
        title={title}
        leftIcon={<SidebarTrigger className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" />}
        rightIcon={<LogoutButton />}
      />
    </header>
  );
};

export default Header;