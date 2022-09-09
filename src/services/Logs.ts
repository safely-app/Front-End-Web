import { createHttpConfig } from '../http-common';

class Logs {
    private readonly baseURL: string = process.env.REACT_APP_SERVER_URL as string;

    getAll(token: string) {
        return createHttpConfig(this.baseURL, token).get("/support/log");
    }
}

export default new Logs();