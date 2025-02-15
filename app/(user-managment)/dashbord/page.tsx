"use client";
import { getRoles } from '@/api/api';
import AdminOnlyPage from '@/components/genral/Admin-page';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const App: React.FC = () => {
    // Example user object
    const { data:roleInUser } = useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
      });


    return (
        <div>
            <AdminOnlyPage user={roleInUser} />
        </div>
    );
};

export default App;