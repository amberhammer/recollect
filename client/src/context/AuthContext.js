import { useState, createContext } from 'react';
import { loginUser, registerUser } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const register = async (formData) => {
    try {
      const response = await registerUser(formData);
      return response.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  const login = async (formData) => {
    try {
      const response = await loginUser(formData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
    } catch (err) {
      throw err.response.data;
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