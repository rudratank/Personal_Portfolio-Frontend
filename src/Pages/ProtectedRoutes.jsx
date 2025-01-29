import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userAppStore } from '../store';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { userinfo, isLoading, checkAuth } = userAppStore();
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // Add useEffect to check auth on mount
    React.useEffect(() => {
        if (!userinfo && isAuthenticated) {
            checkAuth();
        }
    }, [checkAuth, userinfo, isAuthenticated]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (adminOnly && (!isAuthenticated || !userinfo)) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (adminOnly && userinfo?.email !== import.meta.env.VITE_ADMIN_EMAIL) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};
