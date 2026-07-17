/**
 * Layer:
 * Page
 *
 * Purpose:
 * Renders the authenticated user's profile card, active store memberships directory,
 * and allows requesting store creations if none exist (enforcing the One User = One Store rule).
 *
 * Used By:
 * - App.jsx (routes mapping)
 *
 * Uses:
 * - useAuth() (authentication context state)
 * - useToast() (status toast alerts)
 * - api.js (Axios client)
 * - API_ENDPOINTS (constants)
 *
 * Backend APIs:
 * - POST /store-requests (submits new store approval application)
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import api from "../services/api";
import { API_ENDPOINTS } from "../constants/api";

const Profile = () => {
  const { user, storeMemberships, refreshProfile } = useAuth();
  const userStores = storeMemberships || [];
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // Helper to auto-generate slug from name
  const handleNameChange = (e) => {
    const value = e.target.value;
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace with -
      .replace(/-+/g, "-"); // collapse multiple -
    setValue("slug", generatedSlug, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.STORE_REQUESTS.CREATE, {
        name: data.name,
        slug: data.slug,
      });
      showToast(
        "Store creation request submitted successfully. Awaiting admin approval.",
        "success",
      );
      reset();
      setIsFormOpen(false);
      refreshProfile();
    } catch (err) {
      showToast(err.message || "Failed to submit store request", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header Profile Section */}
      <div className="glass-panel p-8 rounded-3xl border border-brand-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-primary flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-brand-primary/20">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-brand-text tracking-tight">
                {user?.username}
              </h1>
              <p className="text-xs text-brand-muted mt-1">{user?.email}</p>
            </div>
          </div>
          {userStores.length === 0 && user?.authorization?.platformRole !== "SUPER_ADMIN" && (
            <div>
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold rounded-xl shadow-lg hover:shadow-brand-primary/20 active:scale-95 transition-smooth cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Request New Store
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Store Request Form Section */}
      {isFormOpen && userStores.length === 0 && user?.authorization?.platformRole !== "SUPER_ADMIN" && (
        <div className="glass-panel p-6 rounded-2xl border border-brand-primary bg-brand-primary/10 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between mb-4 border-b border-brand-border pb-3">
            <h2 className="text-sm font-bold text-brand-text uppercase tracking-wider">
              Store Request Form
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-brand-muted hover:text-brand-muted transition-smooth text-lg"
            >
              &times;
            </button>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Store Name
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Store Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name cannot exceed 50 characters",
                  },
                })}
                onChange={handleNameChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-smooth ${
                  errors.name
                    ? "border-rose-500/60 focus:ring-rose-500/50"
                    : "border-brand-border focus:border-brand-primary"
                }`}
                placeholder="e.g. My Laptop Paradise"
              />
              {errors.name && (
                <span className="text-xs text-rose-400 mt-1 block">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Store Slug
              </label>
              <input
                type="text"
                {...register("slug", {
                  required: "Store Slug is required",
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message:
                      "Slug must consist of lowercase alphanumeric characters and hyphens only",
                  },
                  minLength: {
                    value: 3,
                    message: "Slug must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Slug cannot exceed 50 characters",
                  },
                })}
                className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-smooth ${
                  errors.slug
                    ? "border-rose-500/60 focus:ring-rose-500/50"
                    : "border-brand-border focus:border-brand-primary"
                }`}
                placeholder="e.g. my-laptop-paradise"
              />
              {errors.slug && (
                <span className="text-xs text-rose-400 mt-1 block">
                  {errors.slug.message}
                </span>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 border-t border-brand-border pt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-white hover:bg-brand-secondary text-brand-muted rounded-xl border border-brand-border transition-smooth cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-brand-primary/50 disabled:cursor-not-allowed text-xs font-semibold text-white rounded-xl shadow-lg hover:shadow-brand-primary/20 active:scale-95 transition-smooth cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Request</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {user?.authorization?.platformRole === "SUPER_ADMIN" ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-brand-text tracking-tight">
              Platform Administration
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              Access platform-wide administrative functions and store approvals
            </p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-brand-border hover:border-brand-border flex flex-col justify-between max-w-md">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  Super Admin
                </span>
              </div>
              <h3 className="text-lg font-bold text-brand-text">
                Platform Store Approvals
              </h3>
              <p className="text-xs text-brand-muted mt-1">
                Review and approve or reject pending merchant store requests.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-end pt-4 border-t border-brand-border">
              <Link
                to="/admin/requests"
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white transition-smooth shadow-lg shadow-brand-primary/10"
              >
                Open Admin Panel &rarr;
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-brand-text tracking-tight">
              Your Store Memberships
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              Stores that you own or are authorized to manage
            </p>
          </div>

          {userStores.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl border border-brand-border p-8">
              <svg
                className="mx-auto h-12 w-12 text-brand-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <h3 className="mt-4 text-sm font-semibold text-brand-text">
                No stores linked
              </h3>
              <p className="mt-2 text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
                You do not have any registered store memberships yet. Submit a
                store request above to get started as a merchant!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userStores.map((membership) => (
                <div
                  key={membership.storeId}
                  className="glass-panel p-6 rounded-2xl border border-brand-border hover:border-brand-border flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/30">
                        {membership.roleName === "STORE_OWNER" ? "Owner" : "Staff"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-text">
                      {membership.storeName}
                    </h3>
                    <p className="text-xs text-brand-muted mt-1">/{membership.storeSlug}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-brand-border">
                    <Link
                      to={`/stores/${membership.storeSlug}`}
                      className="text-xs font-semibold text-brand-muted hover:text-brand-text transition-smooth"
                    >
                      View Storefront
                    </Link>
                    <Link
                      to={`/stores/${membership.storeSlug}/dashboard`}
                      className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary/90 text-white transition-smooth shadow-lg shadow-brand-primary/10"
                    >
                      Store Dashboard &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
