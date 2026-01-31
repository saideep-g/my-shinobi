import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '@/types/auth';

/**
 * ROLE-BASED ACCESS GUARD (RBAC)
 * Restricts access to routes based on user roles (e.g., ADMIN, TEACHER).
 * * If a student tries to access an /admin route, they are redirected 
 * to their appropriate dashboard instead of just being "blocked".
 */

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
    children,
    allowedRoles,
    redirectTo = '/'
}) => {
    const { profile, loading } = useAuth();

    if (loading) return null; // Let the ProtectedRoute handle the loading spinner

    // If profile doesn't exist or role isn't allowed, redirect
    if (!profile || !allowedRoles.includes(profile.role)) {
        console.warn(`[RBAC] Access Denied. User role '${profile?.role}' is not in [${allowedRoles}]`);
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};
