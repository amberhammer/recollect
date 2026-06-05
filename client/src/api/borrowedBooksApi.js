import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api/borrowed-books",
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

const createBorrowedBook = async (payload, token) => {
    const response = await API.post("/", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export { createBorrowedBook };
