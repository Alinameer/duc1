"use client";
import { getRoles } from '@/api/api';
import AdminOnlyPage from '@/components/genral/Admin-page';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const App: React.FC = () => {
    // Example user object
    const { data } = useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
      });

    return (
        <div>
            <AdminOnlyPage user={data} />
        </div>
    );
};

export default App;