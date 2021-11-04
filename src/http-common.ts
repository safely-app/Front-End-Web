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

export const createHttpConfig = (baseURL: string, token?: string) => {
    const axios_instance = (token !== undefined && token !== "")
        ? createHttpConfigWithAuthorization(baseURL, token)
        : createHttpConfigWithoutAuthorization(baseURL);

    axios_instance.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        const errorStatus = error.response.status;

        if (errorStatus === 401)
            window.location.href = `${process.env.PUBLIC_URL}/logout`;
        return Promise.reject(error);
    });

    return axios_instance;
};
