export default interface IUser {
    id: string;
    username: string;
    email: string;
    role: string;
    password?: string;
    confirmedPassword?: string;
}

export const createNewUser = (): IUser => ({
    id: "",
    username: "",
    email: "",
    role: ""
})
