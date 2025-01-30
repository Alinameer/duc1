"use client";
import React from "react";
import { getAllUsers } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { hasPermission, Role } from "@/lib/auth";

// Ensure the correct structure for props, passing the user object properly
const AdminOnlyPage: React.FC<{ user: { id: string; role?: Role } }> = ({ user }) => {
  // Fetch users with useQuery
  const { data, isLoading, isError } = useQuery({
    queryKey: ["documents"],
    queryFn: getAllUsers,
  });

  // Check if the user has permission to view the page
  if (!hasPermission(user, "view")) {
    return <div>Access Denied. You do not have permission to view this page.</div>;
  }

  // Display loading state while fetching data
  if (isLoading) return <div>Loading...</div>;

  // Display error message if fetching fails
  if (isError) return <div>Error fetching users.</div>;

  // Render user data once it's fetched
  return (
<div className="p-6 bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users List</h2>
  <ul className="space-y-4">
    {data?.map((user) => (
      <li key={user.id} className="p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100">
        <div className="flex items-center justify-between">
          <strong className="text-xl font-medium text-gray-800">{user.username}</strong>
          <div className="text-sm text-gray-600">
            <strong className="font-semibold">Roles:</strong>{" "}
            {user.roles.length > 0 
              ? user.roles.map(role => role.role).join(", ") 
              : "No roles assigned"}
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

  );
};

export default AdminOnlyPage;
