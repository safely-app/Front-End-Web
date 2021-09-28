import ISafeplace from '../components/interfaces/ISafeplace';
import { createHttpConfig } from '../http-common';

class Safeplace {

    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    getAll() {
        return createHttpConfig(this.baseURL).get("/safeplace/safeplace");
    }

    get(id: string) {
        return createHttpConfig(this.baseURL).get(`/safeplace/safeplace/${id}`);
    }

    update(id: string, data: ISafeplace, token: string) {
        return createHttpConfig(this.baseURL, token).put(`/safeplace/safeplace/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/safeplace/safeplace/${id}`);
    }
}

export default new Safeplace();