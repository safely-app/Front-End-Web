import axios from 'axios';

export const createHttpConfig = (token?: string) => axios.create({
    baseURL: "http://api.safely-app.fr",
    headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
    }
});
