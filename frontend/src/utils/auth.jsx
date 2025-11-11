import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Helper to check if a user is logged in
const checkAuth = () => {
  // We'll use httpOnly cookie set by backend, just need to check if 
  // our last login was successful
  return localStorage.getItem('isLoggedIn') === 'true';
};

// Component to protect routes
export function RequireAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  if (!isAuthenticated) {
    // Redirect to /login but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}