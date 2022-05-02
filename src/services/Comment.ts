import IComment from "../components/interfaces/IComment";
import { createHttpConfig } from "../http-common";

class Comment {

    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/safeplace/comment");
    }

    get(userId: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/safeplace/comment/${userId}`);
    }

    getBest(amount: number, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/safeplace/comment/best/${amount}`);
    }

    getBestSafeplace(safeplaceId: string, amount: number, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/safeplace/comment/best/${safeplaceId}/${amount}`);
    }

    getWorst(amount: number, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/safeplace/comment/worst/${amount}`);
    }

    getWorstSafeplace(safeplaceId: string, amount: number, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/safeplace/comment/worst/${safeplaceId}/${amount}`);
    }

    create(comment: IComment, token: string) {
        const { id, ...data } = comment;
        return createHttpConfig(this.baseURL, token).post("/safeplace/comment", data);
    }

    update(_id: string, comment: IComment, token: string) {
        const { id, userId, safeplaceId, ...data } = comment;
        return createHttpConfig(this.baseURL, token).put(`/safeplace/comment/${_id}`, data);
    }

    delete(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).delete(`/safeplace/comment/${id}`);
    }
}

export default new Comment();