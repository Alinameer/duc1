'use client';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Cookies from 'js-cookie';
import { signout } from "@/api/api";

const LogoutButton: React.FC = () => {
  const token = Cookies.get("token");
  const { mutate, status } = useMutation({
    mutationFn: signout,
    onSuccess: () => {
      // On successful logout, remove the token from cookies
      Cookies.remove("token");  // Assuming your token is stored in a cookie named "token"
    },
  });

  const handleLogout = () => {
    mutate();
  };

  console.log(status);

  return (
    <button
      onClick={handleLogout}
      className="hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
    >
      Logout 
    </button>
  );
};

export default LogoutButton;
