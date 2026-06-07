import axios from "axios";
import { apiUrl } from "./apiConfig";

const API = axios.create({
    baseURL: apiUrl("/api/loans"),
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const createLoan = async (payload, token) => {
    const response = await API.post("/", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const returnLoan = async (loanId, token) => {
    const response = await API.patch(`/${loanId}/return`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export { createLoan, returnLoan };
