import axios from 'axios';

export const baseURL = "https://api.safely-app.fr";

const createHttpConfigWithAuthorization = (token: string) => axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
    }
});

const createHttpConfigWithoutAuthorization = () => axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "application/json"
    }
});

export const createHttpConfig = (token?: string) => (token !== undefined)
    ? createHttpConfigWithAuthorization(token)
    : createHttpConfigWithoutAuthorization();
