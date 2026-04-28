import axios from "axios";

const baseURL =
    process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const API = axios.create({
    baseURL,
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
        alert(err.response?.data || "API Error");
        return Promise.reject(err);
    },
);

export default API;
