export type Role = keyof typeof ROLES;
type Permission =( typeof ROLES)[Role][number];


const ROLES = {
    ADMIN: [
        "view",
        "edit",
        "delete"
    ],
    Editor: [
        "view",
],
} as const;

export function hasPermission(
    users: { id: string; role?: Role }[], 
    permission: Permission
) {
    return users?.some((user) => {
        const role = user.role?.toUpperCase() as Role | undefined; // Normalize to uppercase
        return role && ROLES[role]?.includes(permission);
      });
} 
