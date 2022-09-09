import IReport from '../components/interfaces/IReport';
import { createHttpConfig } from '../http-common';

class BugReportManager {
    private readonly baseURL: string = process.env.REACT_APP_SERVER_URL as string;

    send(userId: string, data: IReport, token: string) {
        return createHttpConfig(this.baseURL, token).post("/support/support", {
            userId: userId,
            title: data.title,
            comment: data.comment,
            type: 'Bug',
        });
    };

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get('/support/support');
    }

    update(_id: string, supportRequest: IReport, token: string) {
        const { id, userId, ...data } = supportRequest;

        return createHttpConfig(this.baseURL, token).put(`/support/support/${_id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/support/support/${id}`);
    }
}

export default new BugReportManager();