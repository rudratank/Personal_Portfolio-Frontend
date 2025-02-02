import React, { createContext, useContext, useEffect } from 'react';
import { userAppStore } from '../store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { checkAuth, isLoading } = userAppStore();

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
    };
    initializeAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
