"use client";
import { getRoles } from '@/api/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Link from 'next/link';

const Roles = () => {
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {roles.map((role: any) => (
        <Link key={role.id} href={`/Roles/${role.id}`}>
          <div className="bg-white p-6 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800">{role.role}</h2>
            <p className="text-sm text-gray-500 mt-2">Manage permissions and settings</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Roles;
