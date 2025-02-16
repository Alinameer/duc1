"use client";
import MyEditor from "@/components/genral/Editor";
import { getRoles } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

export default function WrapperEditer({ docId }: { docId: string }) {
  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  return (
    <div>
      <MyEditor user={data} docId={docId} />
    </div>
  );
}

