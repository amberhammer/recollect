import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api/books/',
    headers: {
        'Content-Type': 'application/json',
    },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const searchBooks = async (query) => {
    const response = await API.get(`search?q=${encodeURIComponent(query)}`);
    return response.data;
};

const addBookToLibrary = async (payload, token) => {
    const response = await API.post("/", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};


export { searchBooks, addBookToLibrary };
