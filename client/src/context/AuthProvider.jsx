import { useState } from 'react';
import { loginUser, registerUser } from '../api/authApi';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const register = async (formData) => {
    try {
      const response = await registerUser(formData);
      return response;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  const login = async (formData) => {
    try {
      const response = await loginUser(formData);
      const { token, user } = response;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = { user, token, login, register, logout, isAuthenticated: !!token };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
