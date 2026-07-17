/**
 * Layer:
 * Page
 *
 * Purpose:
 * Renders the application public directory marketplace landing page.
 * Displays all approved and open stores registered on the platform.
 * Note: Under currently enforced F2 business rules, this page is not used as the main landing page
 * (anonymous users are redirected directly to /login), but the file is preserved for future
 * landing page expansions.
 *
 * Used By:
 * - App.jsx (Not directly imported but kept as future PublicMarketplace/Landing page placeholder)
 *
 * Uses:
 * - api.js (Axios client)
 * - API_ENDPOINTS (constants)
 *
 * Backend APIs:
 * - GET /stores (fetches public approved/open stores list)
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { API_ENDPOINTS } from "../constants/api";

const PublicMarketplace = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.STORES.PUBLIC_LIST);
        setStores(res.data?.stores || []);
      } catch (err) {
        setError(err.message || "Failed to retrieve public stores directory");
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
        <p className="text-sm text-brand-muted">Loading public stores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="relative text-center py-16 px-4 overflow-hidden rounded-3xl bg-brand-surface border border-brand-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08),transparent_50%)]"></div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-text">
          E-Com Lite{" "}
          <span className="text-brand-primary">
            Marketplace
          </span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
          Discover curated niche storefronts, manage catalogs seamlessly, and
          explore our multi-tenant merchant ecosystem.
        </p>
      </div>

      {/* Directory listing */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <div>
            <h2 className="text-xl font-bold text-brand-text tracking-tight">
              Public Directory
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              Browse all open and approved merchant stores
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            {stores.length} {stores.length === 1 ? "Store" : "Stores"} Active
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
              There are currently no open stores in the directory. Request a new
              store from your dashboard!
            </p>
            <div className="mt-6">
              <Link
                to="/profile"
                className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-xl text-white bg-brand-primary hover:bg-brand-primary/90 shadow-md transition-smooth cursor-pointer"
              >
                Create Store Request
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Link
                key={store.id}
                to={`/stores/${store.slug}`}
                className="group flex flex-col justify-between p-6 rounded-2xl glass-card border border-brand-border hover:border-brand-primary transition-smooth"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary/90 group-hover:text-white transition-smooth">
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
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/30">
                      Open
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-primary/80 transition-smooth">
                    {store.name}
                  </h3>
                  <p className="text-xs text-brand-muted mt-1">/{store.slug}</p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs font-semibold text-brand-muted group-hover:text-brand-text transition-smooth">
                  <span>Visit storefront</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicMarketplace;
