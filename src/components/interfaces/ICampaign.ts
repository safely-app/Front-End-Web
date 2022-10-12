export default interface ICampaign {
    id: string;
    ownerId: string;
    name: string;
    budget: number;
    budgetSpent?: number;
    status: string;
    safeplaceId?: string;
    startingDate: string;
    targets: string[];
}