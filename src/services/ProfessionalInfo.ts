import IProfessional from '../components/interfaces/IProfessional';
import { createHttpConfig } from '../http-common';
import { isProfessionalValid } from './utils';

class ProfessionalInfo {

    // private readonly baseURL = 'https://api.safely-app.fr';
    private readonly baseURL = 'http://localhost:8080';

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/professionalinfo");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/professionalinfo/${id}`);
    }

    create(data: IProfessional, token: string) {
        const validateProfessional = isProfessionalValid(data);

        if (validateProfessional.isValid === false)
            throw new Error(validateProfessional.error);
        return createHttpConfig(this.baseURL, token).post("/professionalinfo", data);
    }

    update(id: string, data: IProfessional, token: string) {
        const validateProfessional = isProfessionalValid(data);

        if (validateProfessional.isValid === false)
            throw new Error(validateProfessional.error);
        return createHttpConfig(this.baseURL, token).put(`/professionalinfo/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/professionalinfo/${id}`);
    }
}

export default new ProfessionalInfo();