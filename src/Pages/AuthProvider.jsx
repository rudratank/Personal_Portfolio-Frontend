import React, { useEffect, useState } from 'react';
import { userAppStore } from '../store';
import { useLocation } from 'react-router-dom';

export const AuthProvider = ({ children }) => {
  const { checkAuth, isLoading } = userAppStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      if (!isInitialized && mounted) {
        const isProtectedRoute = location.pathname.startsWith('/admin');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (isProtectedRoute || isAuthenticated) {
          await checkAuth();
        }
        setIsInitialized(true);
      }
    };

    initAuth();

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'isAuthenticated') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      mounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth, isInitialized, location]);

  if (isLoading && !isInitialized) {
    return <div>Loading...</div>;
  }

  return children;
};