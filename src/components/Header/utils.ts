export enum Role {
    NONE,
    USER,
    TRADER,
    ADMIN
};

const strToRole = (str_role) => {
    switch (str_role) {
        case "user":
            return Role.USER;
        case "trader":
            return Role.TRADER;
        case "admin":
            return Role.ADMIN;
        default:
            return Role.NONE;
    };
};

export const canAccess = (role: string, limitation: Role): boolean => {
    if (limitation <= strToRole(role))
        return true;
    return false;
};