import IRequestClaimSafeplace from '../components/interfaces/IRequestClaimSafeplace';
import { createHttpConfig } from '../http-common';

class RequestClaimSafeplace {

    private readonly baseURL: string = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/requestClaimSafeplace");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/requestClaimSafeplace/${id}`);
    }

    create(data: IRequestClaimSafeplace, token: string) {
        return createHttpConfig(this.baseURL, token).post("/requestClaimSafeplace", data);
    }

    update(id: string, data: IRequestClaimSafeplace, token: string) {
        return createHttpConfig(this.baseURL, token).put(`/requestClaimSafeplace/${id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/requestClaimSafeplace/${id}`);
    }
}

export default new RequestClaimSafeplace();