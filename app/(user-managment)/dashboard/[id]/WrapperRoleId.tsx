"use client";
import {
  assignRoleToUser,
  deleteRoleFromUser,
  getRoleInUser,
  getRolesNotInUser,
} from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/torch/components/Button";

function WrapperRoleId({ id }: { id: string }) {
  const router = useRouter();

  const { data: rolesInUser } = useQuery({
    queryKey: ["roles-in-user", id],
    queryFn: () => getRoleInUser(id),
  });

  const { data: rolesNotInUser } = useQuery({
    queryKey: ["roles-not-in-user", id],
    queryFn: () => getRolesNotInUser(id),
  });

  const queryClient = useQueryClient();

  // Mutation for assigning a role to the user
  const { mutate: assignRole } = useMutation({
    mutationFn: assignRoleToUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles-in-user", id] });
      queryClient.invalidateQueries({ queryKey: ["roles-not-in-user", id] });
      console.log("Role assigned successfully");
    },
    onError: (error) => {
      console.error("Error during role assignment:", error);
    },
  });

  const handleAssignRole = (roleId: string) => {
    assignRole({ user_id: id, role_id: [roleId] });
  };

  const { mutate: removeRole } = useMutation({
    mutationFn: ({ roleId, userId }: { userId: string; roleId: string }) =>
      deleteRoleFromUser([roleId], userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles-in-user", id] });
      queryClient.invalidateQueries({ queryKey: ["roles-not-in-user", id] });
      console.log("Role removed successfully");
    },
    onError: (error: any) => console.error("Error during role removal:", error),
  });

  const handleDelete = (roleId: string) => {
    removeRole({ roleId, userId: id });
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-black mb-2">Roles</h1>
        <Button onClick={() => router.push("/dashboard")} className="mb-2">
          Return to dashboard
        </Button>
        <div className="block bg-black h-0.5 w-full my-4" />
      </div>

      <div className="w-full flex p-32 gap-8">
        <div className="flex flex-col h-[500px] overflow-auto text-stone-900 gap-4 w-full border p-8 rounded-lg">
          {rolesNotInUser?.map((role: any) => (
            <div
              key={role.id}
              className="bg-white p-4 shadow-md rounded-lg flex justify-between hover:bg-blue-50 transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {role.role}
              </h2>
              <Button onClick={() => handleAssignRole(role?.id)}>
                <ArrowRightCircle className="bg-white text-black" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col h-[500px] overflow-auto text-stone-900 gap-4 w-full border p-8 rounded-lg">
          {rolesInUser?.map((role: any) => (
            <div
              key={role.id}
              className="bg-white p-4 shadow-md rounded-lg flex justify-between hover:bg-blue-50 transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {role.role}
              </h2>

              <Button onClick={() => handleDelete(role.id)}>
                <ArrowLeftCircle className="bg-white text-black" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WrapperRoleId;
