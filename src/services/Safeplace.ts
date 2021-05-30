import IUser from '../components/interfaces/IUser';
import axios from 'axios';

const createHttpConfig = (token?: string) => axios.create({
    baseURL: "http://localhost:8080/",
    headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
    }
});

class Safeplace {
    getAll(token: string) {
        return createHttpConfig(token).get("/safeplace");
    }

    get(id: string, token: string) {
        return createHttpConfig(token).get(`/safeplace/${id}`);
    }

    update(id: string, data: IUser, token: string) {
        return createHttpConfig(token).put(`/safeplace/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(token).delete(`/safeplace/${id}`);
    }
}

export default new Safeplace();