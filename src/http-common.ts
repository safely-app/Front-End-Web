import axios from 'axios';

export const createHttpConfig = (url: string, token?: string) => axios.create({
    baseURL: url,
    headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
    }
});
