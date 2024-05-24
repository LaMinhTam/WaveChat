import axios from "axios";
import { getToken } from "../utils/auth";

export default axios.create({
    baseURL: "http://localhost:3000",
});
export const axiosPrivate = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosPrivate.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
