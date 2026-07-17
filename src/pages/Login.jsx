/**
 * Layer:
 * Page
 *
 * Purpose:
 * Renders the login credentials entry form.
 * Handles session creation, password visibility toggles, and redirects authenticated
 * users to their role-specific landing paths (e.g. SUPER_ADMIN to Store Requests,
 * STORE_ADMIN to Store Dashboard or Profile fallbacks).
 *
 * Used By:
 * - App.jsx (routes mapping)
 *
 * Uses:
 * - useAuth() (authentication state context)
 * - useToast() (success/error notification alerts)
 *
 * Backend APIs:
 * - POST /auth/login (submits email/password for token authentication)
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const Login = () => {
  const { login, user, token, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // If already authenticated, redirect to role-specific dashboard.
  // Must come after all hooks.
  if (!authLoading && token && user) {
    if (user.authorization?.platformRole === "SUPER_ADMIN") {
      return <Navigate to="/admin/requests" replace />;
    }
    const storeSlug = user.authorization?.storeMemberships?.[0]?.storeSlug;
    if (storeSlug) {
      return <Navigate to={`/stores/${storeSlug}/dashboard`} replace />;
    }
    return <Navigate to="/profile" replace />;
  }

  // If directed from a protected route, honour that path.
  // But only for STORE paths — do not send SUPER_ADMIN to /profile.
  const from = location.state?.from?.pathname;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userData = await login(data.email, data.password);
      showToast("Logged in successfully", "success");

      // Route based on backend authorization context — never hardcoded.
      if (userData?.authorization?.platformRole === "SUPER_ADMIN") {
        navigate("/admin/requests", { replace: true });
      } else if (from && from !== "/login" && from !== "/register") {
        navigate(from, { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      showToast(err.message || "Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 px-4 min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-xl border border-brand-border animate-in fade-in duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-brand-text">Welcome Back</h2>
          <p className="mt-2 text-xs text-brand-muted">
            Sign in to manage your merchant store or administer the platform
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-smooth ${
                errors.email
                  ? "border-rose-500/60 focus:ring-rose-500/50"
                  : "border-brand-border focus:border-brand-primary"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <span className="text-xs text-rose-400 mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full pl-4 pr-12 py-3 rounded-xl bg-white border text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-smooth ${
                  errors.password
                    ? "border-rose-500/60 focus:ring-rose-500/50"
                    : "border-brand-border focus:border-brand-primary"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-rose-400 mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-brand-primary/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-brand-primary/20 active:scale-95 transition-smooth flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-brand-border pt-6">
          <p className="text-xs text-brand-muted">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-brand-primary hover:text-brand-primary/80 transition-smooth"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
