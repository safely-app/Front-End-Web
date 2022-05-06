import INotification from "../components/interfaces/INotification";
import { createHttpConfig } from "../http-common";

class Notification {

    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/commercial/notifications");
    }

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/commercial/notifications/${id}`);
    }

    create(notif: INotification, token: string) {
        const { id, ...data } = notif;

        return createHttpConfig(this.baseURL, token).post(`/commercial/notifications`, data);
    }

    update(_id: string, notif: INotification, token: string) {
        const { id, ...data } = notif;

        return createHttpConfig(this.baseURL, token).put(`/commercial/notifications/${_id}`, data);
    }

    delete(_id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/commercial/notifications/${_id}`);
    }
}

export default new Notification();