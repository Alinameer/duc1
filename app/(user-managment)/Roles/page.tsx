"use client";
import { createRole, deleteRole, updateRole, getRoles } from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Link from "next/link";
import InputModal from "@/app/components/InputModal";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/app/components/torch/components/Button";

// Define the Role interface for type safety.
interface Role {
  id: string;
  role: string;
}

const Roles: React.FC = () => {
  const queryClient = useQueryClient();

  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState<boolean>(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);

  const { data: roles } = useQuery<Role[]>({
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

  const updateRoleMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: (data) => {
      console.log("Role updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["base-roles"] });
    },
    onError: (error: any) => console.error("Error during role update:", error),
  });

  const { mutate: deleteRoles } = useMutation({
    mutationFn: deleteRole,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["base-roles"] }),
    onError: (error: any) =>
      console.error("Error during role deletion:", error),
  });

  const handleDelete = (role: Role) => {
    if (confirm(`Are you sure you want to delete role "${role.role}"?`)) {
      deleteRoles({ id: role.id });
    }
  };

  return (
    <div className="p-6 m-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Roles</h1>
        <Button onClick={() => setIsAddRoleModalOpen(true)}>Add a Role</Button>
      </div>
      <div className="block bg-black h-0.5 w-full my-4" />
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {roles?.map((role: Role) => (
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
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setRoleToEdit(role);
                  }}
                  className="text-blue-700 cursor-pointer hover:text-blue-500"
                >
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

      {/* Modal for Adding a New Role */}
      <InputModal
        open={isAddRoleModalOpen}
        title="Add New Role"
        placeholder="Enter role name"
        initialValue=""
        onSave={(newRoleName: string) => {
          if (newRoleName) {
            createRoleMutation.mutate(
              { role: newRoleName },
              {
                onSuccess: () => {
                  setIsAddRoleModalOpen(false);
                },
              }
            );
          }
        }}
        onCancel={() => setIsAddRoleModalOpen(false)}
        onOpenChange={(open: boolean) => setIsAddRoleModalOpen(open)}
      />

      {/* Modal for Editing a Role */}
      <InputModal
        open={roleToEdit !== null}
        title="Edit Role"
        placeholder="Enter new role name"
        initialValue={roleToEdit ? roleToEdit.role : ""}
        onSave={(newRoleName: string) => {
          if (roleToEdit && newRoleName && newRoleName !== roleToEdit.role) {
            updateRoleMutation.mutate(
              { id: roleToEdit.id, role: newRoleName },
              {
                onSuccess: () => {
                  setRoleToEdit(null);
                },
              }
            );
          } else {
            setRoleToEdit(null);
          }
        }}
        onCancel={() => setRoleToEdit(null)}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setRoleToEdit(null);
          }
        }}
      />
    </div>
  );
};

export default Roles;
