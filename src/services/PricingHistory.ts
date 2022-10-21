import {createHttpConfig} from "../http-common";

class PricingHistory {

    private readonly baseURL = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get(`/advertising/cost/history`);
    }
}

export default new PricingHistory();