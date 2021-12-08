import IBilling from '../components/interfaces/IBilling';
import { createHttpConfig } from '../http-common';
import { isBillingValid } from './utils';

class Billing {

    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/stripe/stripe/billing");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/stripe/stripe/billing/${id}`);
    }

    getByUser(userId: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/stripe/stripe/billingUser/${userId}`);
    }

    create(data: IBilling, token: string) {
        const validateBilling = isBillingValid(data);

        if (validateBilling.isValid === false)
            throw new Error(validateBilling.error);
        return createHttpConfig(this.baseURL, token).post("/stripe/stripe/billing", data);
    }

    update(id: string, stripeId: string, data: IBilling, token: string) {
        const validateBilling = isBillingValid(data);

        if (validateBilling.isValid === false)
            throw new Error(validateBilling.error);
        return createHttpConfig(this.baseURL, token).put(`/stripe/stripe/billing/${id}`, {
            stripeId: stripeId,
            description: data.description,
            receipt_email: data.receiptEmail
        });
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/stripe/stripe/billing/${id}`);
    }
}

export default new Billing();