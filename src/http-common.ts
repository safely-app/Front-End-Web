import axios from 'axios';

export default axios.create({
    baseURL: "http://api.safely-app.fr",
    headers: {
        "Content-type": "application/json"
    }
});
