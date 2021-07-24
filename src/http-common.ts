import axios from 'axios';

const createHttpConfigWithAuthorization = (baseURL: string, token: string) => axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
    }
});

const createHttpConfigWithoutAuthorization = (baseURL: string) => axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "application/json"
    }
});

export const createHttpConfig = (baseURL: string, token?: string) => (token !== undefined)
    ? createHttpConfigWithAuthorization(baseURL, token)
    : createHttpConfigWithoutAuthorization(baseURL);
