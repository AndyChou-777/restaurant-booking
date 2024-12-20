import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkSession } from '@/service/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  // 初始化時檢查 session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkSession();
        if (response.status === 200 && response.data) {
          setIsLoggedIn(true);
          setUserRole(response.data.role);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setIsLoggedIn(false);
        setUserRole('');
      }
    };

    checkAuth();
  }, []);

  const updateAuthState = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const clearAuthState = () => {
    setIsLoggedIn(false);
    setUserRole('');
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      userRole, 
      updateAuthState, 
      clearAuthState 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};