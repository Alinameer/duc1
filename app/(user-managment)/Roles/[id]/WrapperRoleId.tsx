
'use client';
import {  getPermissionsInRole, getPermissionsNotInRole } from "@/api/api";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowLeftCircle } from "lucide-react";
import React from "react";


 function WrapperRoleId  ({id}: {id:any}) {
  const { data: permissionsInRole } = useQuery({
    queryKey: ["permissions",id],
    queryFn: ()=>getPermissionsInRole(id),
  });
  const {data: permission_not_in_role} = useQuery({
    queryKey: ['role-permission',id],
    queryFn: ()=>getPermissionsNotInRole(id)
  })
/*   const {} = useMutation({
    mutationFn: (
  })
 */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-4">Permissions  {id}</h1>
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
            <Button >
              <ArrowLeftCircle className="bg-white text-black"/>
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
            <Button >
              <ArrowLeftCircle className="bg-white text-black"/>
            </Button>
          </div>
        ))}
        </div>

      </div>

    </div>
  );
};

export default WrapperRoleId;
