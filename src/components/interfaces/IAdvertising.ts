export default interface IAdvertising {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  campaignId?: string;
  imageUrl: string;
  targets: string[];
}