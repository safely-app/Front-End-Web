import ISupportRequest from "../components/interfaces/ISupportRequest";
import { createHttpConfig } from "../http-common";

class SupportRequest {

    private readonly baseURL: string = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get('/support/support');
    }

    update(_id: string, supportRequest: ISupportRequest, token: string) {
        const { id, userId, ...data } = supportRequest;

        return createHttpConfig(this.baseURL, token).put(`/support/support/${_id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/support/support/${id}`);
    }
}

export default new SupportRequest();