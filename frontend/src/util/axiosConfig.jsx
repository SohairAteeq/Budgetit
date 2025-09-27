import axios from "axios";
import { baseUrl } from "./ApiEndPoints";

const axiosConfig = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

const excludeEndpoints = [
    "/status",
    "/health",
    "/login",
    "/register",
    "/activate"
];

axiosConfig.interceptors.request.use((config) => {
    const shouldSkipToken = excludeEndpoints.some(
        endpoint => config.url?.includes(endpoint)
    );

    if(!shouldSkipToken) {
        const token = localStorage.getItem("token");
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosConfig.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if(error.response) {
        if(error.response.status === 401) {
            window.location.href = "/login";
        }
        else if(error.response.status === 500) {
            console.error("Internal Server Error");
        }
    }
    else if(error.code === "ECONNABORTED") {
        console.error("Request timed out");
    }
    else {
        console.error("An unknown error occurred");
    }
    return Promise.reject(error);
});

export default axiosConfig;


