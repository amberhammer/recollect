import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth/',
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