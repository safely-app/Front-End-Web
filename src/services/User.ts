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
        return createHttpConfig(token).delete(`/user/${id}`);
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
        return createHttpConfig().post("/user/forgotPassword", {
            email: data.email
        });
    }

    changePassword(id: string, token: string, data: UserData) {
        return createHttpConfig().post("/user/changePassword", {
            userId: id,
            token: token,
            password: data.password
        });
    }
}

export default new User();