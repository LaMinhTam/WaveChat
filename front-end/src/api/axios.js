import axios from "axios";
import { getToken } from "../utils/auth";

export default axios.create({
    baseURL: "http://localhost:3000",
});

export const axiosPrivate = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
    },
});
