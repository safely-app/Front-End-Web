import IInvoice from '../components/interfaces/IInvoice';
import { createHttpConfig } from '../http-common';

class Invoice {

    // private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;
    private readonly baseURL = 'http://localhost:8080';

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/invoice");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/invoice/${id}`);
    }

    create(data: IInvoice, token: string) {
        return createHttpConfig(this.baseURL, token).post(`/invoice`, data);
    }

    update(id: string, data: IInvoice, token: string) {
        return createHttpConfig(this.baseURL, token).put(`/invoice/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/invoice/${id}`);
    }
}

export default new Invoice();