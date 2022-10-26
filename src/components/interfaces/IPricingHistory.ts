export default interface IPricingHistory {
  id: string;
  campaignId: string;
  eventType: string;
  userAge: string;
  userCsp: string;
  eventCost: number;
  totalCost: number;
  matchingOn: string[];
  createdAt: Date;
  updatedAt?: Date;
}