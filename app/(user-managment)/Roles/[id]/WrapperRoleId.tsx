"use client";
import {
  assignPermissionToRole,
  deletePermission,
  getPermissionsInRole,
  getPermissionsNotInRole,
} from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/torch/components/Button";

type Permission = {
  id: string;
  permission: string;
};

function WrapperRoleId({ id }: { id: any }) {
  const router = useRouter();

  const { data: permissionsInRole } = useQuery({
    queryKey: ["permissions", id],
    queryFn: () => getPermissionsInRole(id),
  });
  const { data: permission_not_in_role } = useQuery({
    queryKey: ["role-permission", id],
    queryFn: () => getPermissionsNotInRole(id),
  });

  const queryClient = useQueryClient();

  const { mutate: assignPermission } = useMutation({
    mutationFn: assignPermissionToRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions", id] });
      queryClient.invalidateQueries({ queryKey: ["role-permission", id] });
      console.log("Permission assigned successfully");
    },
    onError: (error) => {
      console.error("Error during login:", error);
    },
  });

  const handleAssignPermission = (s: string) => {
    assignPermission({ role_id: id, permission_id: [s] });
  };

  const { mutate: removePermission } = useMutation({
    mutationFn: ({
      permissionId,
      roleId,
    }: {
      permissionId: string;
      roleId: string;
    }) =>
      // Pass the permission ID inside an array to match the expected request body format.
      deletePermission([permissionId], roleId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions", id] });
      queryClient.invalidateQueries({ queryKey: ["role-permission", id] });
      console.log("Permission removed successfully");
    },
    onError: (error: any) =>
      console.error("Error during permission removal:", error),
  });

  const handleDelete = (permissionId: string) => {
    removePermission({ permissionId, roleId: id });
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-black mb-2">Permissions</h1>
        <Button onClick={() => router.push("/Roles")} className="mb-2">
          Return to Roles
        </Button>
        <div className="block bg-black h-0.5 w-full my-4" />
      </div>

      <div className="w-full  flex p-32">
        <div className="flex flex-col h-[500px] overflow-auto text-stone-900  gap-4 w-full border p-8 rounded-lg ">
          {permission_not_in_role?.map((permission: any) => (
            <div
              key={permission.id}
              className="bg-white p-4 shadow-md rounded-lg flex justify-between hover:bg-blue-50 transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {permission.permission}
              </h2>
              <Button onClick={() => handleAssignPermission(permission.id)}>
                <ArrowRightCircle className="bg-white text-black" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col h-[500px] overflow-auto text-stone-900  gap-4 w-full border p-8 rounded-lg ">
          {permissionsInRole?.map((permission: any) => (
            <div
              key={permission.id}
              className="bg-white p-4 shadow-md rounded-lg flex flex-row-reverse justify-between hover:bg-blue-50 transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {permission.permission}
              </h2>
              <Button onClick={() => handleDelete(permission.id)}>
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
