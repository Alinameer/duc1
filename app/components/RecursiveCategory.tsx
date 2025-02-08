"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getCategory } from "@/api/api";

const RecursiveCategory = ({
  category,
  depth = 0,
}: {
  category: any;
  depth?: number;
}) => {
  return (
    <div className={`text-white ${depth > 0 ? "pl-4" : ""}`}>
      <Link
        href={`/${category.id}`}
        className="flex items-center gap-1 px-1 hover:underline"
      >
        <i className="ri-file-list-line"></i>
        {category.name}
      </Link>
      {category.subcategories?.length > 0 && (
        <div className="mt-1">
          {category.subcategories.map((subCategory: any) => (
            <RecursiveCategory
              key={subCategory.id}
              category={subCategory}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};


function PageDoc() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data)
    return <div>Error fetching categories. Please try again later.</div>;

  const topLevelCategories = data.filter((item: any) => !item.cate_parent);

  return (
    <div className="container-aside bg-black p-4">
      {topLevelCategories.map((item: any) => (
        <div key={item.id} className="mb-4">
          <div className="text-xl font-bold border-b border-gray-700 pb-1">
            {item.name}
          </div>
          <div className="mt-2">
            {item.subcategories?.map((child: any) => (
              <RecursiveCategory key={child.id} category={child} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PageDoc;
