// src/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../services/api';

const AuthContext = createContext({});

const AuthProvider = ({ children }:any) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAuthenticated(true);
      setUserId(userId);
    }
    setLoading(false);
  }, []);

  const login = async (email:string, password:string) => {
    try {
      const response = await api.post('/api/login', { email, password });
      const { userId, token } = response.data;
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAuthenticated(true);
      setUserId(userId);
    } catch (error:any) {
      if (error.response && error.response.status === 401) {
        alert('Senha incorreta!');
      } else {
        alert('Erro ao efetuar login!');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
  
    return context;
  };
  
export default AuthProvider

export { useAuth };

// export { AuthContext, AuthProvider };
