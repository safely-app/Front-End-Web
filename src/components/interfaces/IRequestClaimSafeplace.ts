export default interface IRequestClaimSafeplace {
    id: string;
    userId: string;
    safeplaceId: string;
    safeplaceName: string;
    status: string;
    adminComment?: string;
    safeplaceDescription: string;
    coordinate: string[];
    adminId?: string;
    userComment?: string;
}