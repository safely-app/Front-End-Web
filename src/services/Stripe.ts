import IStripe from "../components/interfaces/IStripe";
import { createHttpConfig } from '../http-common';

class Stripe {
    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/stripe/user/${id}`);
    }

    create(data: IStripe, token: string) {
        const { id, ...stripeData } = data;
        return createHttpConfig(this.baseURL, token).post('/stripe/user', stripeData);
    }

    update(_id: string, data: IStripe, token: string) {
        const { id, ...stripeData } = data;
        return createHttpConfig(this.baseURL, token).put(`/stripe/user/${_id}`, stripeData);
    }

    linkCard(data: { cardId: string, stripeId: string }, token: string) {
        return createHttpConfig(this.baseURL, token).post('/stripe/cardLink', data);
    }
}

export default new Stripe();