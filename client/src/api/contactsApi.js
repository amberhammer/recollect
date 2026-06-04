import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api/contacts/",
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
