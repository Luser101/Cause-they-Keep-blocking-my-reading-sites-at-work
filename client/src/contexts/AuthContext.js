import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';

    if (savedToken) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setDarkMode(savedDarkMode);
    setLoading(false);
  }, []);

  const register = useCallback(async (name, email, password, confirmPassword) => {
    const response = await authAPI.register({ name, email, password, confirmPassword });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setToken(token);
    setUser(user);
    
    return response.data;
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setToken(token);
    setUser(user);
    
    return response.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const toggleDarkMode = useCallback(async () => {
    const newDarkMode = !darkMode;
    try {
      await authAPI.updateTheme(newDarkMode);
      setDarkMode(newDarkMode);
      localStorage.setItem('darkMode', newDarkMode);
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  }, [darkMode]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        darkMode,
        register,
        login,
        logout,
        toggleDarkMode,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
