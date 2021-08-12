import IUser from '../components/interfaces/IUser';
import { createHttpConfig } from '../http-common';

class Safeplace {
    private url: string = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.url, token).get("/");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.url, token).get(`/safeplace/${id}`);
    }

    update(id: string, data: IUser, token: string) {
        return createHttpConfig(this.url, token).put(`/safeplace/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.url, token).delete(`/safeplace/${id}`);
    }
}

export default new Safeplace();
