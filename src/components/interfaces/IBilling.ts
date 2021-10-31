export default interface IBilling {
    id: string;
    paymentMethod: string;
    receiptEmail: string;
    description: string;
    currency: string;
    status: string;
    amount: number;
}