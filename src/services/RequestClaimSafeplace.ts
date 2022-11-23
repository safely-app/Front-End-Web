import IRequestClaimSafeplace from '../components/interfaces/IRequestClaimSafeplace';
import { createHttpConfig } from '../http-common';

class RequestClaimSafeplace {

    private readonly baseURL: string = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/safeplace/requestClaimSafeplace");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/safeplace/requestClaimSafeplace/${id}`);
    }

    getByOwnerId(userId: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/safeplace/requestClaimSafeplace/ownerRequestClaim/${userId}`);
    }

    create(data: IRequestClaimSafeplace, token: string) {
        const { id, ...tmpData } = data;
        return createHttpConfig(this.baseURL, token).post("/safeplace/requestClaimSafeplace", tmpData);
    }

    update(_id: string, data: IRequestClaimSafeplace, token: string) {
        const { id, ...tmpData } = data;
        return createHttpConfig(this.baseURL, token).put(`/safeplace/requestClaimSafeplace/${id}`, tmpData);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/safeplace/requestClaimSafeplace/${id}`);
    }
}

export default new RequestClaimSafeplace();