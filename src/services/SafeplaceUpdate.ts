import ISafeplaceUpdate from '../components/interfaces/ISafeplaceUpdate';
import { createHttpConfig } from '../http-common';
import { isSafeplaceUpdateValid } from './utils';

class SafeplaceUpdate {
    // private readonly baseURL: string = process.env.REACT_APP_SERVER_URL as string;
    private readonly baseURL: string = 'http://localhost:3001';

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/safeplace/safeplaceUpdate");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/safeplace/safeplaceUpdate/${id}`);
    }

    create(data: ISafeplaceUpdate, token: string) {
        const { id, ...fData } = data;
        const validateSafeplaceUpdate = isSafeplaceUpdateValid(data);

        if (validateSafeplaceUpdate.isValid === false)
            throw new Error(validateSafeplaceUpdate.error);
        return createHttpConfig(this.baseURL, token).post('/safeplace/safeplaceUpdate', fData);
    }

    update(_id: string, data: ISafeplaceUpdate, token: string) {
        const { id, ...fData } = data;
        const validateSafeplaceUpdate = isSafeplaceUpdateValid(data);

        if (validateSafeplaceUpdate.isValid === false)
            throw new Error(validateSafeplaceUpdate.error);
        return createHttpConfig(this.baseURL, token).put(`/safeplace/safeplaceUpdate/${_id}`, fData);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/safeplace/safeplaceUpdate/${id}`);
    }
}

export default new SafeplaceUpdate();