"use client";
import MyEditor from "@/components/genral/Editor";
import { getRoles } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  return (
    <div>
      <MyEditor user={data} />
    </div>
  );
}
