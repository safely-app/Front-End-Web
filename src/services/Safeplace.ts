import ISafeplace from '../components/interfaces/ISafeplace';
import { createHttpConfig } from '../http-common';

class Safeplace {

    private readonly baseURL = 'http://api.safely-app.fr:8081';

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/safeplace/${id}`);
    }

    update(id: string, data: ISafeplace, token: string) {
        return createHttpConfig(this.baseURL, token).put(`/safeplace/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/safeplace/${id}`);
    }
}

export default new Safeplace();