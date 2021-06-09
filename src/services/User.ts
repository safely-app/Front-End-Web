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

    login(data: IUser) {
        if (!isEmailValid(data.email))
            throw new Error("Email invalide");
        if (data.password === undefined || !isPasswordValid(data.password))
            throw new Error("Mot de passe invalide");
        return createHttpConfig().post("/login", {
            email: data.email,
            password: data.password
        });
    }

    forgotPassword(data: IUser) {
        if (!isEmailValid(data.email))
            throw new Error("Email invalide");
        return createHttpConfig().post("/user/forgotPassword", {
            email: data.email
        });
    }

    changePassword(id: string, token: string, data: IUser) {
        if (data.password === undefined || data.password !== data.confirmedPassword || !isPasswordValid(data.password))
            throw new Error("Mot de passe invalide");
        return createHttpConfig().post("/user/changePassword", {
            userId: id,
            token: token,
            password: data.password
        });
    }
}

export default new User();