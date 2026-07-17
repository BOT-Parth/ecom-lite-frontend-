import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

/**
 * Layer:
 * Shared Component / Route Guard
 *
 * Purpose:
 * Enforces session authentication and platform-level authorization checks.
 *
 * Used By:
 * - App.jsx (wraps restricted routes)
 *
 * Uses:
 * - useAuth() (authentication state)
 *
 * Props Expected:
 * - children (ReactElement)
 * - allowedRoles (string[], optional) - platformRole values approved to access
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading screen/spinner while authenticating session
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-surface text-brand-muted">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium tracking-wide">
            Authenticating...
          </span>
        </div>
      </div>
    );
  }

  if (!token) {
    // Redirect to login page and save location to navigate back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.authorization?.platformRole)) {
    // If not authorized for this platform role, redirect to profile page
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
