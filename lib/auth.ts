type Permission = {
    id: string;
    permission: string;
};

type User = {
    id: string;
    roles: null | string[];
    permissions: Permission[];
};

export function hasPermission(
    user: User, 
    requiredPermission: string
): boolean {
    // Check if the user has the required permission directly
    return user?.permissions?.some(
        (permission) => permission?.permission === requiredPermission
    );
}