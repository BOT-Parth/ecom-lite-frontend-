import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Layer:
 * Page / Route Guard
 *
 * Purpose:
 * Evaluates the user session authentication state at application startup or root (/) navigation.
 * Redirects anonymous users to /login, SUPER_ADMIN to /admin/requests, and
 * STORE_ADMIN to their store dashboard (or profile page as fallback).
 *
 * Used By:
 * - App.jsx (root route element mapping)
 *
 * Uses:
 * - useAuth() (authentication state context)
 */
const RootRedirect = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-surface text-brand-muted">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium tracking-wide">Loading...</span>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.authorization?.platformRole === "SUPER_ADMIN") {
    return <Navigate to="/admin/requests" replace />;
  }

  const storeSlug = user.authorization?.storeMemberships?.[0]?.storeSlug;
  if (storeSlug) {
    return <Navigate to={`/stores/${storeSlug}/dashboard`} replace />;
  }

  return <Navigate to="/profile" replace />;
};

export default RootRedirect;
