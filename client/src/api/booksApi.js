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

const editLibraryEntry = async (google_books_id, payload, token) => {
    const response = await API.put(`/${google_books_id}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const deleteLibraryEntry = async (google_books_id, token) => {
    const response = await API.delete(`/${google_books_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export { searchBooks, addBookToLibrary, editLibraryEntry, deleteLibraryEntry };
