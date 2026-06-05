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

const getBorrowedBookById = async (id, token) => {
    const response = await API.get(`/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const updateBorrowedBook = async (id, payload, token) => {
    const response = await API.patch(`/${id}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export { createBorrowedBook, getBorrowedBookById, updateBorrowedBook };
