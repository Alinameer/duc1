
import React from "react";
import WrapperRoleId from "./WrapperRoleId";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  return (
<WrapperRoleId id={id}/>
  );
};

