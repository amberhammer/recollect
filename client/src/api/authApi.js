import axios from 'axios';
import { apiUrl } from './apiConfig';

const API = axios.create({
  baseURL: apiUrl('/auth/'),
  headers: {
    'Content-Type': 'application/json',
  },
});

const registerUser = async (userData) => {
  const response = await API.post('register', userData);
  return response.data;
};

const loginUser = async (userData) => {
  const response = await API.post('login', userData);
  return response.data;
};

export { registerUser, loginUser };
