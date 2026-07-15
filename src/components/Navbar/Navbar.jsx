import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const Navbar = () => {
  const { user, userStores, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition-opacity"
            >
              E-Com Lite
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/"
                className={`text-sm font-medium transition-smooth ${
                  isActive("/")
                    ? "text-purple-400"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Browse Stores
              </Link>
              {user && (
                <>
                  <Link
                    to="/profile"
                    className={`text-sm font-medium transition-smooth ${
                      isActive("/profile")
                        ? "text-purple-400"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    to="/admin/requests"
                    className={`text-sm font-medium transition-smooth ${
                      isActive("/admin/requests")
                        ? "text-purple-400"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Platform Admin
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Session Info / Controls */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Store Dropdown */}
                {userStores.length > 0 && (
                  <div className="relative group">
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/50 transition-smooth flex items-center gap-1 cursor-pointer">
                      Manage Store
                      <svg
                        className="w-3 h-3 opacity-60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-150 origin-top-right py-1">
                      <div className="px-3 py-1.5 text-xxs font-semibold uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
                        Your Stores
                      </div>
                      {userStores.map((store) => (
                        <Link
                          key={store.id}
                          to={`/stores/${store.slug}/dashboard`}
                          className="block px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-purple-950/30 hover:text-purple-300 transition-smooth"
                        >
                          {store.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Profile Link */}
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-zinc-200">
                    {user.username}
                  </span>
                  <span className="text-[10px] text-zinc-400 leading-none">
                    {user.email}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl border border-zinc-700/50 transition-smooth cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-smooth"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg hover:shadow-purple-500/20 transition-smooth"
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
