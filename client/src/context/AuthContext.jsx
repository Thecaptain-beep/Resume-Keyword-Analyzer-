import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('resumecheck_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('resumecheck_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('resumecheck_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('resumecheck_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn('Session expired or invalid token.');
          localStorage.removeItem('resumecheck_token');
          localStorage.removeItem('resumecheck_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data.success) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('resumecheck_token', data.token);
      localStorage.setItem('resumecheck_user', JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.fullName}!`);
    }
    return data;
  };

  const register = async (fullName, email, password) => {
    const data = await authService.register(fullName, email, password);
    if (data.success) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('resumecheck_token', data.token);
      localStorage.setItem('resumecheck_user', JSON.stringify(data.user));
      toast.success('Account created successfully!');
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('resumecheck_token');
    localStorage.removeItem('resumecheck_user');
    toast.success('Logged out successfully.');
  };

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('resumecheck_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
