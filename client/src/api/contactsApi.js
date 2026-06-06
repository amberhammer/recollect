import axios from "axios";
import { apiUrl } from "./apiConfig";

const API = axios.create({
    baseURL: apiUrl("/api/contacts/"),
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

const getContacts = async () => {
    const response = await API.get("/");
    return response.data;
};

export { getContacts };
