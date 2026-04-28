import axios from "axios";

function buildApiBaseUrl(rawUrl) {
    const fallbackUrl = "http://localhost:4000/api";

    if (!rawUrl) {
        return fallbackUrl;
    }

    const trimmedUrl = rawUrl.trim().replace(/\/+$/, "");

    if (trimmedUrl.endsWith("/api")) {
        return trimmedUrl;
    }

    return `${trimmedUrl}/api`;
}

const baseURL = buildApiBaseUrl(process.env.REACT_APP_API_URL);

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
