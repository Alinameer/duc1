import { hasPermission, Role } from '@/lib/auth';
import React from 'react';
import UserCard from './UserCard';


const AdminOnlyPage: React.FC<{ user: { id: string; role?: Role } }> = ({ user }) => {
    if (!hasPermission(user, 'view')) {
        return <div>Access Denied. You do not have permission to view this page.</div>;
    }

    return (
        <div>
            <h1>Admin Only Page</h1>
            <p>Welcome, {user.id}! You have access to this admin-only page.</p>
            <UserCard />
        </div>
    );
};

export default AdminOnlyPage;
