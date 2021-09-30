import ISafeplace from '../components/interfaces/ISafeplace';
import { createHttpConfig } from '../http-common';
import { isSafeplaceValid } from './utils';

class Safeplace {
    private readonly baseURL: string = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/safeplace/safeplace");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/safeplace/safeplace/${id}`);
    }

    update(id: string, data: ISafeplace, token: string) {
        const validateSafeplace = isSafeplaceValid(data);

        if (validateSafeplace.isValid === false)
            throw new Error(validateSafeplace.error);
        return createHttpConfig(this.baseURL, token).put(`/safeplace/safeplace/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/safeplace/safeplace/${id}`);
    }
}

export default new Safeplace();
