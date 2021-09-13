import ISafeplace from '../components/interfaces/ISafeplace';
import { createHttpConfig } from '../http-common';
import { isSafeplaceValid } from './utils';

class Safeplace {
    private readonly baseURL: string = process.env.REACT_APP_SERVER_URL as string;

    getAll() {
        return createHttpConfig(this.baseURL).get("/safeplace");
    }

    get(id: string) {
        return createHttpConfig(this.baseURL).get(`/safeplace/${id}`);
    }

    update(id: string, data: ISafeplace, token: string) {
        const validateSafeplace = isSafeplaceValid(data);

        if (validateSafeplace.isValid === false)
            throw new Error(validateSafeplace.error);
        return createHttpConfig(this.baseURL, token).put(`/safeplace/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/safeplace/${id}`);
    }
}

export default new Safeplace();
