import http from '../http-common';

interface UserData {
    email: string;
    username: string;
    password: string;
}

class User {
    register(data: UserData) {
        return http.post("/register", data);
    }

    login(data: UserData) {
        return http.post("/login", {
            email: data.email,
            password: data.password
        });
    }
}

export default new User();