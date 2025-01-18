import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userAppStore } from '../store';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userinfo, isLoading } = userAppStore();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // For admin routes, if there's no authentication at all, send to unauthorized
  if (adminOnly && !isAuthenticated && !userinfo) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated but not admin, send to unauthorized
  if (adminOnly && userinfo?.email !== import.meta.env.VITE_ADMIN_EMAIL) {
    return <Navigate to="/unauthorized" replace />;
  }

  // For authenticated routes that need login but aren't admin-only
  if (!adminOnly && !isAuthenticated && !userinfo) {a
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};