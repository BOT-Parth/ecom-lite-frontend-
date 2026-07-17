/**
 * Layer:
 * Page
 *
 * Purpose:
 * Renders the customer-facing details view of a single product within a public store storefront.
 * Displays image gallery, name, price, stock status, and category tags.
 *
 * Used By:
 * - App.jsx (routes mapping)
 *
 * Uses:
 * - storeResolver.js (slug resolving)
 * - api.js (Axios client)
 * - API_ENDPOINTS (constants)
 *
 * Backend APIs:
 * - GET /stores/slug/:slug (via resolver)
 * - GET /stores/:storeId/products/:productId
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { API_ENDPOINTS } from "../constants/api";
import storeResolver from "../services/storeResolver";

const ProductDetails = () => {
  const { storeSlug, productId } = useParams();
  const [store, setStore] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Resolve store slug to get storeId
        const resolvedStore = await storeResolver.resolveStoreBySlug(storeSlug);
        if (!resolvedStore) {
          setError("Store not found");
          setLoading(false);
          return;
        }
        setStore(resolvedStore);

        // 2. Fetch product by ID (which includes nested category and inventory)
        const res = await api.get(
          API_ENDPOINTS.PRODUCTS.DETAIL(resolvedStore.id, productId),
        );
        setProduct(res.data?.product || null);
      } catch (err) {
        setError(err.message || "Failed to retrieve product details");
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [storeSlug, productId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-brand-muted">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-brand-border text-center">
          <h2 className="text-xl font-bold text-brand-text tracking-tight">
            Product Not Found
          </h2>
          <p className="text-brand-muted mt-2 text-xs leading-relaxed">
            {error || "The requested product could not be located."}
          </p>
          <div className="mt-6">
            <Link
              to={store ? `/stores/${store.slug}` : "/"}
              className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-xl text-white bg-brand-primary hover:bg-brand-primary/90 transition-smooth"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stockCount = product.inventory?.quantity ?? 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button */}
      <div>
        <Link
          to={`/stores/${storeSlug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-text transition-smooth cursor-pointer"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to storefront
        </Link>
      </div>

      {/* Product Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-border relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Product Image Section */}
          <div className="md:col-span-6 aspect-square w-full rounded-2xl bg-white border border-brand-border flex items-center justify-center overflow-hidden relative">
            {product.imageUrls && product.imageUrls.length > 0 ? (
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop";
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-brand-muted">
                <svg
                  className="w-12 h-12 opacity-30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs uppercase font-bold tracking-wider opacity-50">
                  No Image
                </span>
              </div>
            )}
          </div>

          {/* Product Description Section */}
          <div className="md:col-span-6 space-y-6">
            <div>
              {product.category?.name && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-3 py-1 rounded border border-brand-primary/20 mb-3 inline-block">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 py-3 border-y border-brand-border">
              <span className="text-2xl font-black text-brand-text">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <span
                className={`inline-flex px-2.5 py-1 rounded text-xxs font-bold uppercase tracking-wider ${
                  stockCount > 0
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/30"
                    : "bg-rose-950/80 text-rose-400 border border-rose-800/30"
                }`}
              >
                {stockCount > 0 ? `In Stock (${stockCount})` : "Out of Stock"}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                Description
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed whitespace-pre-wrap">
                {product.description ||
                  "No description provided for this product."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
