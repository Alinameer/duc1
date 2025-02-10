
import { getPermissions } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import WrapperRoleId from "./WrapperRoleId";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  return (
<WrapperRoleId id={id}/>
  );
};

