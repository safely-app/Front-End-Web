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

    register(data: UserData) {
        return createHttpConfig().post("/register", data);
    }

    login(data: UserData) {
        return createHttpConfig().post("/login", {
            email: data.email,
            password: data.password
        });
    }
}

export default new User();