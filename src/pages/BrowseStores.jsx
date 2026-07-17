/**
 * Layer:
 * Page
 *
 * Purpose:
 * Renders the Platform Admin Browse Stores page, accessible only by SUPER_ADMIN.
 * Queries all stores registered on the platform via administrative access, showing
 * operational and approval status indicators.
 *
 * Used By:
 * - App.jsx (routes mapping)
 *
 * Uses:
 * - api.js (Axios client)
 *
 * Backend APIs:
 * - GET /stores/platform (fetches administrative stores list)
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const BrowseStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get("/stores/platform");
        setStores(res.data?.stores || []);
      } catch (err) {
        setError(err.message || "Failed to retrieve platform stores directory");
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-brand-muted">Loading platform stores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-bold text-brand-text tracking-tight">
          Platform Store Directory
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Audit store status, approval state, and tenant access controls
        </p>
      </div>

      {/* Directory listing */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <div>
            <h2 className="text-sm font-bold text-brand-text uppercase tracking-wider">
              All Registered Stores
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            {stores.length} {stores.length === 1 ? "Store" : "Stores"} Total
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/30 text-rose-200 text-sm">
            {error}
          </div>
        )}

        {!error && stores.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl p-8 border border-brand-border">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-4 text-sm font-semibold text-brand-text">
              No stores found
            </h3>
            <p className="mt-2 text-xs text-brand-muted max-w-sm mx-auto">
              There are currently no stores registered on the platform.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="group flex flex-col justify-between p-6 rounded-2xl glass-panel border border-brand-border hover:border-brand-border transition-smooth"
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
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </span>
                    <div className="flex gap-1.5">
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        store.approvalStatus === "APPROVED"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/30"
                          : store.approvalStatus === "PENDING"
                          ? "bg-amber-950/80 text-amber-400 border border-amber-800/30"
                          : store.approvalStatus === "NEEDS_CHANGES"
                          ? "bg-blue-950/80 text-blue-400 border border-blue-800/30"
                          : "bg-rose-950/80 text-rose-400 border border-rose-800/30"
                      }`}>
                        {store.approvalStatus}
                      </span>
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        store.operationalStatus === "OPEN"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/30"
                          : store.operationalStatus === "CLOSED"
                          ? "bg-white text-brand-muted border border-brand-border"
                          : "bg-rose-950/80 text-rose-400 border border-rose-800/30"
                      }`}>
                        {store.operationalStatus}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-primary/80 transition-smooth">
                    {store.name}
                  </h3>
                  <p className="text-xs text-brand-muted mt-1">/{store.slug}</p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs font-semibold pt-4 border-t border-brand-border">
                  <Link
                    to={`/stores/${store.slug}`}
                    className="text-brand-primary hover:text-brand-primary/80 transition-smooth"
                  >
                    View Storefront &rarr;
                  </Link>
                  <Link
                    to={`/stores/${store.slug}/dashboard`}
                    className="text-brand-muted hover:text-brand-text transition-smooth"
                  >
                    Manage &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseStores;
