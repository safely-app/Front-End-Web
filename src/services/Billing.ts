import IBilling from '../components/interfaces/IBilling';
import { createHttpConfig } from '../http-common';

class Billing {

    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/stripe/stripe/billing");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/stripe/stripe/billing/${id}`);
    }

    create(data: IBilling, token: string) {
        // const validateInvoice = isInvoiceValid(data);

        // if (validateInvoice.isValid === false)
        //     throw new Error(validateInvoice.error);
        return createHttpConfig(this.baseURL, token).post("/stripe/stripe/billing", data);
    }

    update(id: string, data: IBilling, token: string) {
        // const validateInvoice = isInvoiceValid(data);

        // if (validateInvoice.isValid === false)
        //     throw new Error(validateInvoice.error);
        return createHttpConfig(this.baseURL, token).put(`/stripe/stripe/billing/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/stripe/stripe/billing/${id}`);
    }
}

export default new Billing();