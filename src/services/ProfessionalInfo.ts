import IProfessional from '../components/interfaces/IProfessional';
import { createHttpConfig } from '../http-common';
import { isProfessionalValid } from './utils';

class ProfessionalInfo {

    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/professionalinfo");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/professionalinfo/${id}`);
    }

    create(data: IProfessional) {
        const { id, ...tmpData } = data;
        const validateProfessional = isProfessionalValid(data);

        if (validateProfessional.isValid === false)
            throw new Error(validateProfessional.error);
        return createHttpConfig(this.baseURL).post("/professionalinfo", tmpData);
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