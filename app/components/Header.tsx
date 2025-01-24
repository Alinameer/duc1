"use client";
import LogoutButton from '@/components/genral/LogoutButton';
import TopBar from '@/components/genral/TopBar';
import React from 'react';

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
        rightIcon={<LogoutButton onClick={handleLogout} />} // Add this line
      />
    </header>
  );
};

export default Header;