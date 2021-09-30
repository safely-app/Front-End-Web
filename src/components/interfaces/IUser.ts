export default interface IUser {
    id: string;
    username: string;
    email: string;
    role: string;
    password?: string;
    confirmedPassword?: string;
    stripeId?: string;
}