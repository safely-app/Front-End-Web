import IProfessional from '../components/interfaces/IProfessional';
import { createHttpConfig } from '../http-common';
import { isProfessionalValid } from './utils';

class ProfessionalInfo {

    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/professionalinfo");
    }

    getOwner(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/professionalinfo/owner/${id}`);
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

    update(_id: string, data: IProfessional, token: string) {
        const { id, ...tmpData } = data;
        const validateProfessional = isProfessionalValid(data);

        if (validateProfessional.isValid === false)
            throw new Error(validateProfessional.error);
        return createHttpConfig(this.baseURL, token).put(`/professionalinfo/${_id}`, tmpData);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/professionalinfo/${id}`);
    }
}

export default new ProfessionalInfo();