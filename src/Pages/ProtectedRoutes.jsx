import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userAppStore } from '../store';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userinfo, isLoading } = userAppStore();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // For admin routes, check if user exists and is admin
  if (adminOnly && !userinfo) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // If authenticated but not admin, send to unauthorized
  if (adminOnly && userinfo?.email !== import.meta.env.VITE_ADMIN_EMAIL) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};
