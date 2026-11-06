import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('quickbite_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (token) {
        try {
          const res = await api.get('/user/profile');
          if (res.data.success && res.data.user.role === 'admin') {
            setAdminUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Admin session validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAdmin();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/user/login', { email, password });
    if (res.data.success) {
      if (res.data.user.role !== 'admin') {
        throw new Error('Access denied: You do not have administrator privileges.');
      }
      localStorage.setItem('quickbite_admin_token', res.data.token);
      setToken(res.data.token);
      setAdminUser(res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('quickbite_admin_token');
    setToken(null);
    setAdminUser(null);
  };

  const value = {
    adminUser,
    token,
    loading,
    isAuthenticated: !!token && !!adminUser,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

