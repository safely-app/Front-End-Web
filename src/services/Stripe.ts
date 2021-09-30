import IStripe from "../components/interfaces/IStripe";
import { createHttpConfig } from '../http-common';

class Stripe {
    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    get(id: string, token: string) {
        return createHttpConfig(this.baseURL, token).get(`/Stripe/user/${id}`);
    }

    create(data: IStripe, token: string) {
        const { id, ...stripeData } = data;
        return createHttpConfig(this.baseURL, token).post('/Stripe/user', stripeData);
    }

    update(_id: string, data: IStripe, token: string) {
        const { id, ...stripeData } = data;
        return createHttpConfig(this.baseURL, token).put(`/Stripe/user/${_id}`, stripeData);
    }

    linkCard(data: { cardId: string, stripeId: string }, token: string) {
        return createHttpConfig(this.baseURL, token).post('/Stripe/cardLink', data);
    }
}

export default new Stripe();