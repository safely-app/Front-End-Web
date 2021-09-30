import IInvoice from '../components/interfaces/IInvoice';
import { createHttpConfig } from '../http-common';
import { isInvoiceValid } from './utils';

class Invoice {

    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/mock/invoice");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/mock/invoice/${id}`);
    }

    create(data: IInvoice, token: string) {
        const validateInvoice = isInvoiceValid(data);

        if (validateInvoice.isValid === false)
            throw new Error(validateInvoice.error);
        return createHttpConfig(this.baseURL, token).post(`/mock/invoice`, data);
    }

    update(id: string, data: IInvoice, token: string) {
        const validateInvoice = isInvoiceValid(data);

        if (validateInvoice.isValid === false)
            throw new Error(validateInvoice.error);
        return createHttpConfig(this.baseURL, token).put(`/mock/invoice/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/mock/invoice/${id}`);
    }
}

export default new Invoice();