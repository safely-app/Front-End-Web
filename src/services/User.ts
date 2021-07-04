import IUser from '../components/interfaces/IUser';
import { createHttpConfig } from '../http-common';
import {
    isEmailValid,
    isPasswordValid,
    isUserValid
} from './utils';

class User {
    getAll(token: string) {
        return createHttpConfig(token).get("/user");
    }

    get(id: string, token: string) {
        return createHttpConfig(token).get(`/user/${id}`);
    }

    update(id: string, data: IUser, token: string) {
        const validateUser = isUserValid(data);

        if (validateUser.isValid === false)
            throw new Error(validateUser.error);
        return createHttpConfig(token).put(`/user/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(token).delete(`/user/${id}`);
    }

    register(data: IUser) {
        const validateUser = isUserValid(data);

        if (validateUser.isValid === false)
            throw new Error(validateUser.error);
        if (data.password !== data.confirmedPassword)
            throw new Error("Mot de passe invalide");
        return createHttpConfig().post("/register", {
            username: data.username,
            email: data.email,
            password: data.password,
        });
    }

    login(email: string, password: string) {
        if (!isEmailValid(email))
            throw new Error("Email invalide");
        if (password === undefined || !isPasswordValid(password))
            throw new Error("Mot de passe invalide");
        return createHttpConfig().post("/login", {
            email: email,
            password: password
        });
    }

    forgotPassword(email: string) {
        if (!isEmailValid(email))
            throw new Error("Email invalide");
        return createHttpConfig().post("/user/forgotPassword", {
            email: email
        });
    }

    changePassword(id: string, token: string, password: string, confirmedPassword: string) {
        if (password === undefined || password !== confirmedPassword || !isPasswordValid(password))
            throw new Error("Mot de passe invalide");
        return createHttpConfig().post("/user/changePassword", {
            userId: id,
            token: token,
            password: password
        });
    }
}

export default new User();