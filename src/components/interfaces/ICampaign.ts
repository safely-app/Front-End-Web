export default interface ICampaign {
    id: string;
    ownerId: string;
    name: string;
    budget: string;
    status: string;
    safeplaceId?: string;
    startingDate: string;
    targets: string[];
}