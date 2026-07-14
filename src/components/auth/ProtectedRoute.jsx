
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Reusable authentication guard.
 * Redirects unauthenticated users to the login page while preserving the attempted URL path.
 * Waits for AuthContext initialization to complete to prevent layout flickering.
 */
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading screen/spinner while authenticating session
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium tracking-wide">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    // Redirect to login page and save location to navigate back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
