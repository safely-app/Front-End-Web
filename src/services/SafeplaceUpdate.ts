import ISafeplaceUpdate from '../components/interfaces/ISafeplaceUpdate';
import { createHttpConfig } from '../http-common';
import { isSafeplaceUpdateValid } from './utils';

class SafeplaceUpdate {
    private readonly baseURL: string = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/commercial/modif");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/commercial/modif/${id}`);
    }

    create(data: ISafeplaceUpdate, token: string) {
        const { id, ...fData } = data;
        const validateSafeplaceUpdate = isSafeplaceUpdateValid(data);

        if (validateSafeplaceUpdate.isValid === false)
            throw new Error(validateSafeplaceUpdate.error);
        return createHttpConfig(this.baseURL, token).post('/commercial/modif', fData);
    }

    update(_id: string, data: ISafeplaceUpdate, token: string) {
        const { id, ...fData } = data;
        const validateSafeplaceUpdate = isSafeplaceUpdateValid(data);

        if (validateSafeplaceUpdate.isValid === false)
            throw new Error(validateSafeplaceUpdate.error);
        return createHttpConfig(this.baseURL, token).put(`/commercial/modif/${_id}`, fData);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/commercial/modif/${id}`);
    }
}

export default new SafeplaceUpdate();