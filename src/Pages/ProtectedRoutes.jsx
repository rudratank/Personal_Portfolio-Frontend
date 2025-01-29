import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userAppStore } from '../store';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userinfo, isLoading, checkAuth } = userAppStore();
  const location = useLocation();
  const token = document.cookie.includes('token'); // Check if token exists in cookies

  React.useEffect(() => {
    const verifyAuth = async () => {
      const isAuthorized = await checkAuth();
      if (!isAuthorized && adminOnly) {
        window.location.href = '/unauthorized';
      }
    };
    verifyAuth();
  }, [checkAuth, adminOnly]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Strict token check for admin routes
  if (adminOnly && !token) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for admin email if token exists
  if (adminOnly && token && userinfo?.email !== import.meta.env.VITE_ADMIN_EMAIL) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
