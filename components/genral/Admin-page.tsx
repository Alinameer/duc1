"use client";
import React from "react";
import { getAllUsers } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { Role } from "@/lib/auth";
import Link from "next/link";

// Ensure the correct structure for props, passing the user object properly
const AdminOnlyPage: React.FC<{ user: { id: string; role?: Role } }> = ({ user }) => {
  const { data } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users List</h2>

      <ul className="space-y-4">
        {data?.map((user) => (
          <Link key={user.id} href={`/dashboard/${user.id}`}>

              <li className="p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer">
                <div className="flex items-center justify-between">
                  <strong className="text-xl font-medium text-gray-800">{user.username}</strong>
                  <div className="text-sm text-gray-600">
                    <strong className="font-semibold">Roles:</strong>{" "}
                    {user.roles.length > 0
                      ? user.roles.map((role) => role.role).join(", ")
                      : "No roles assigned"}
                  </div>
                </div>
              </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default AdminOnlyPage;
