export default interface IStripe {
    id: string;
    name: string;
    address: string;
    phone: string;
    description: string;
}

export interface IStripeCard {
    id: string;
    customerId: string;
    brand: string;
    country: string;
    expMonth: number;
    expYear: number;
    last4: string;
}