"use client";
import TopBar from '@/components/genral/TopBar';
import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import LogoutButton from '@/components/genral/LogoutButton';

const Header = () => {
  const handleLogout = () => {
    // Implement your logout logic here
    console.log("User logged out");
    // For example, clear the user's session or token
  };

  return (
    <header className="sticky w-full top-0 z-50">
      <TopBar
        title="TechDoc"
        leftIcon={<SidebarTrigger className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" />}
        rightIcon={<LogoutButton onClick={handleLogout} />}
      />
    </header>
  );
};

export default Header;