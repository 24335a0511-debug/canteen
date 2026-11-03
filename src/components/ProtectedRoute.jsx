import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute({ allowedRoles, children, currentUser }) {
  const location = useLocation();
  const user = currentUser || authService.getCurrentUser();

  // 1. Unauthenticated users are redirected to /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role-based isolation guard: If user's role is not authorized for this route,
  // redirect them to their own authorized dashboard.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const authorizedPath = authService.getDashboardPath(user.role);
    return (
      <Navigate 
        to={authorizedPath} 
        state={{ 
          unauthorizedAttempt: location.pathname,
          message: `Access denied to ${location.pathname}. You have been redirected to your ${user.roleBadge} portal.`
        }} 
        replace 
      />
    );
  }

  return children;
}
