export default interface IRequestClaimSafeplace {
    id: string;
    userId: string;
    safeplaceId: string;
    status: string;
    comment?: string;
}