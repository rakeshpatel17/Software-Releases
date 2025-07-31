// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // if roles prop is provided, check it
  if (roles && !roles.includes(user.role)) {
    // you could redirect to a 403 page, or dashboard
    return <Navigate to="/dashboard" />;
  }

  return children;
}
