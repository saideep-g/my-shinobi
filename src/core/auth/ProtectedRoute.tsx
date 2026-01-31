import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * PROTECTED ROUTE GUARD
 * Higher-Order Component that prevents unauthenticated access to specific routes.
 * * It preserves the intended destination in the location state so users 
 * can be redirected back after a successful login.
 */

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isInitializing } = useAuth();
    const location = useLocation();

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-app-bg">
                <div className="w-12 h-12 border-4 border-app-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        // Redirect to login, but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
