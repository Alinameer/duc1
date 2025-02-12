"use client";
import { createRole, deleteRole, getRoles } from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InputModal from "@/app/components/InputModal";
import { Edit, Trash } from "lucide-react";

const Roles = () => {
  const queryClient = useQueryClient();
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);

  const { data: roles } = useQuery({
    queryKey: ["base-roles"],
    queryFn: getRoles,
  });

  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: (data) => {
      console.log("Role created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["base-roles"] });
    },
    onError: (error: any) =>
      console.error("Error during role creation:", error),
  });

  const { mutate: deleteRoles } = useMutation({
    mutationFn: deleteRole,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["base-roles"] }),
    onError: (error: any) =>
      console.error("Error during category deletion:", error),
  });

  const handleDelete = (role: any) => {
    if (confirm(`Are you sure you want to delete role "${role.role}"?`)) {
      deleteRoles({ id: role.id });
    }
  };

  return (
    <div className="  p-6 m-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold ">Roles</h1>
        <Button onClick={() => setIsAddRoleModalOpen(true)}>Add a Role</Button>
      </div>
      <div className="block bg-black h-0.5 w-full my-4" />
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {roles?.map((role: any) => (
          <Link key={role.id} href={`/Roles/${role.id}`}>
            <div className="relative bg-white p-6 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
              <div className="absolute top-2 right-2 flex space-x-2">
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(role);
                  }}
                  className="text-red-700 cursor-pointer hover:text-red-500"
                >
                  <Trash size={20} />
                </span>
                <span className="text-blue-700 cursor-pointer hover:text-blue-500">
                  <Edit size={20} />
                </span>
              </div>

              <h2 className="text-xl overflow-hidden font-semibold text-gray-800">
                {role.role}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Manage permissions and settings
              </p>
            </div>
          </Link>
        ))}
      </div>
      <InputModal
  open={isAddRoleModalOpen}
  title="Add New Role"
  placeholder="Enter role name"
  initialValue=""
  onSave={(newRoleName) => {
    if (newRoleName) {
      createRoleMutation.mutate({ role: newRoleName }, {
        onSuccess: (data) => {
          // After successful creation, close the modal.
          setIsAddRoleModalOpen(false);
        },
      });
    }
  }}
  onCancel={() => setIsAddRoleModalOpen(false)}
  onOpenChange={(open) => setIsAddRoleModalOpen(open)}
/>

    </div>
  );
};

export default Roles;
