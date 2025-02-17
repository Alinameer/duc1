'use client';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const token = Cookies.get("token");
  
  const { mutate, status } = useMutation({
    mutationFn: () => axios.post(`http://192.168.0.148:8000/api/user/logout?refresh_token=${token}`),
    onSuccess: () => {
      // On successful logout, remove the token from cookies
      Cookies.remove("token");
      router.push("/auth/sign-in"); // Redirect to sign-in page
    },
    onError: (error) => {
      if (error?.response?.data?.message === "Token does not exist or is already revoked") {
        Cookies.remove("token");
        router.push("/auth/sign-in");
      }
    },
  });

  const handleLogout = () => {
    mutate();
  };

  console.log(status);

  return (
    <button
      onClick={handleLogout}
      className=" text-black font-bold py-2 4 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
