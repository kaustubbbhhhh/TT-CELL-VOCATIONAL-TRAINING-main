import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
    };

    window.addEventListener('auth_session_expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth_session_expired', handleSessionExpired);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      const { access_token, user: backendUser } = response.data;
      
      const mappedUser = {
        ...backendUser,
        name: backendUser.full_name,
        title: backendUser.role === 'admin'
          ? 'Administrator · Training Office'
          : `Trainee · ${backendUser.email}`,
      };

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      
      setUser(mappedUser);
      return mappedUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error on backend:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      return await authApi.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password request failed:', error);
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      return await authApi.resetPasswordWithToken(token, newPassword);
    } catch (error) {
      console.error('Reset password request failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, forgotPassword, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
