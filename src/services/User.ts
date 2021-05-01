import http from '../http-common';

interface UserData {
    email: string;
    username: string;
    password: string;
}

class User {
    register(data: UserData) {
        return http.post("/register");
    }

    login(data: UserData) {
        return http.post("/login");
    }
}

export default new User();