/**
 * Layer:
 * Shared Component
 *
 * Purpose:
 * Renders the top navigation header bar containing company logo, role-restricted links,
 * user session status, and login/logout controls.
 *
 * Used By:
 * - MainLayout.jsx
 *
 * Uses:
 * - useAuth() (authentication state)
 * - useToast() (success/error alerts)
 *
 * Navigation Flow:
 * - Dynamic depending on user.authorization context:
 *   - Anonymous: Login, Register
 *   - STORE_ADMIN: Profile, Store Dashboard (if primaryStore exists)
 *   - SUPER_ADMIN: Browse Stores, Store Requests
 */

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const Navbar = () => {
  const { user, storeMemberships, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const isSuperAdmin = user?.authorization?.platformRole === "SUPER_ADMIN";
  // A STORE_ADMIN is any authenticated user who is not a SUPER_ADMIN.
  const isStoreAdmin = !!user && !isSuperAdmin;
  // First store membership slug (one user = one store)
  const primaryStore = storeMemberships?.[0];

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-brand-border backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-xl font-bold text-brand-primary tracking-tight hover:opacity-90 transition-opacity"
            >
              E-Com Lite
            </Link>

            {/* Role-based nav links */}
            <div className="hidden md:flex items-center gap-4">
              {isSuperAdmin && (
                <>
                  <Link
                    to="/admin/stores"
                    className={`text-sm font-medium transition-smooth ${
                      isActive("/admin/stores")
                        ? "text-brand-primary"
                        : "text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    Browse Stores
                  </Link>
                  <Link
                    to="/admin/requests"
                    className={`text-sm font-medium transition-smooth ${
                      isActive("/admin/requests")
                        ? "text-brand-primary"
                        : "text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    Store Requests
                  </Link>
                </>
              )}
              {isStoreAdmin && (
                <>
                  <Link
                    to="/profile"
                    className={`text-sm font-medium transition-smooth ${
                      isActive("/profile")
                        ? "text-brand-primary"
                        : "text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    Profile
                  </Link>
                  {primaryStore && (
                    <Link
                      to={`/stores/${primaryStore.storeSlug}/dashboard`}
                      className={`text-sm font-medium transition-smooth ${
                        location.pathname.includes("/dashboard")
                          ? "text-brand-primary"
                          : "text-brand-muted hover:text-brand-text"
                      }`}
                    >
                      Store Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* User Session Info / Controls */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Username display */}
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-brand-text">
                    {user.username}
                  </span>
                  <span className="text-[10px] text-brand-muted leading-none">
                    {isSuperAdmin ? "Super Admin" : "Merchant"}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-semibold bg-white hover:bg-brand-secondary text-brand-text rounded-xl border border-brand-border transition-smooth cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-brand-muted hover:text-brand-text transition-smooth"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl shadow-lg hover:shadow-brand-primary/20 transition-smooth"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
