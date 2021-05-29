import IUser from '../components/interfaces/IUser';
import { createHttpConfig } from '../http-common';

interface UserData {
    email: string;
    username: string;
    password: string;
}

class User {
    getAll(token: string) {
        return createHttpConfig(token).get("/user");
    }

    get(id: string, token: string) {
        return createHttpConfig(token).get(`/user/${id}`);
    }

    update(id: string, data: IUser, token: string) {
        return createHttpConfig(token).put(`/user/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(token).get(`/user/${id}`);
    }

    register(data: UserData) {
        return createHttpConfig().post("/register", data);
    }

    login(data: UserData) {
        return createHttpConfig().post("/login", {
            email: data.email,
            password: data.password
        });
    }

    forgotPassword(data: UserData) {
        return createHttpConfig().post("/forgotPassword", {
            email: data.email
        });
    }
}

export default new User();