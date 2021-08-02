import IUser from "../components/interfaces/IUser";

export const isEmailValid = (email: string): boolean => {
    return email !== "" && email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g) !== null;
};

export const isUsernameValid = (username: string): boolean => {
    return !!username && username.length > 1 && username.length < 50;
};

export const isPasswordValid = (password: string): boolean => {
    return !!password && password.length >= 3;
};

interface IUserError {
    isValid: boolean;
    error?: string;
}

export const isUserValid = (user: IUser): IUserError => {
    if (!isEmailValid(user.email))
        return { isValid: false, error: "Email invalide" };
    if (!isUsernameValid(user.username))
        return { isValid: false, error: "Nom d'utilisateur invalide" };
    if (user.password !== undefined && !isPasswordValid(user.password))
        return { isValid: false, error: "Mot de passe invalide" };
    return { isValid: true };
};