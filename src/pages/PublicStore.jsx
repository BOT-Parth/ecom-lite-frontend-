/**
 * Layer:
 * Page
 *
 * Purpose:
 * Renders the public store storefront customer-facing catalog.
 * Displays store details, catalog categories sidebar, filtered product listing grid,
 * and handles fallbacks if the store does not exist.
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
 * - GET /stores/:storeId/categories
 * - GET /stores/:storeId/products
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { API_ENDPOINTS } from "../constants/api";
import storeResolver from "../services/storeResolver";

const PublicStore = () => {
  const { storeSlug } = useParams();
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loadingStore, setLoadingStore] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);

  // 1. Resolve store slug to store details
  useEffect(() => {
    const resolveStore = async () => {
      setLoadingStore(true);
      setError(null);
      try {
        const resolvedStore = await storeResolver.resolveStoreBySlug(storeSlug);
        if (!resolvedStore) {
          setError("Store not found or is currently closed");
        } else {
          setStore(resolvedStore);
        }
      } catch (err) {
        setError(err.message || "Failed to resolve store details");
      } finally {
        setLoadingStore(false);
      }
    };
    resolveStore();
  }, [storeSlug]);

  // 2. Fetch categories and products once store is resolved
  useEffect(() => {
    if (!store) return;

    const fetchCategories = async () => {
      try {
        const res = await api.get(
          API_ENDPOINTS.CATEGORIES.LIST_CREATE(store.id),
        );
        const sortedCats = (res.data?.categories || []).sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        setCategories(sortedCats);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, [store]);

  // 3. Fetch products (triggered on store resolution or category selection change)
  useEffect(() => {
    if (!store) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const url = selectedCategoryId
          ? `${API_ENDPOINTS.PRODUCTS.LIST_CREATE(store.id)}?categoryId=${selectedCategoryId}`
          : API_ENDPOINTS.PRODUCTS.LIST_CREATE(store.id);

        const res = await api.get(url);
        setProducts(res.data?.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [store, selectedCategoryId]);

  if (loadingStore) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-brand-muted">Loading storefront details...</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-brand-border text-center">
          <h2 className="text-xl font-bold text-brand-text tracking-tight">
            Store Not Found
          </h2>
          <p className="text-brand-muted mt-2 text-xs leading-relaxed">
            {error ||
              "The requested storefront could not be located in our active directory."}
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-xl text-white bg-brand-primary hover:bg-brand-primary/90 transition-smooth"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Store Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-brand-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {store.avatarUrl ? (
              <img
                src={store.avatarUrl}
                alt={store.name}
                className="w-16 h-16 rounded-2xl object-cover border border-brand-border shadow-md"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-brand-secondary flex items-center justify-center font-bold text-2xl text-brand-text border border-brand-primary shadow-md">
                {store.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
                {store.name}
              </h1>
              <p className="text-xs text-brand-muted mt-1 font-mono">
                Store Domain: /{store.slug}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800/30 uppercase tracking-wider">
            Active Storefront
          </span>
        </div>
        {store.description && (
          <p className="text-sm text-brand-muted mt-6 max-w-2xl leading-relaxed border-t border-brand-border pt-4">
            {store.description}
          </p>
        )}
      </div>

      {/* Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-brand-muted uppercase tracking-wider">
            Categories
          </h2>
          <div className="flex flex-wrap lg:flex-col gap-1.5">
            <button
              onClick={() => setSelectedCategoryId("")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-smooth border cursor-pointer ${
                selectedCategoryId === ""
                  ? "bg-brand-primary border-brand-primary text-white shadow-md"
                  : "bg-white/40 border-brand-border text-brand-muted hover:text-brand-text hover:bg-brand-secondary/40"
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-smooth border cursor-pointer ${
                  selectedCategoryId === cat.id
                    ? "bg-brand-primary border-brand-primary text-white shadow-md"
                    : "bg-white/40 border-brand-border text-brand-muted hover:text-brand-text hover:bg-brand-secondary/40"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h2 className="text-sm font-bold text-brand-muted uppercase tracking-wider">
              Products
            </h2>
            <span className="text-xs text-brand-muted font-medium">
              {products.length} {products.length === 1 ? "item" : "items"} found
            </span>
          </div>

          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-brand-muted">
                Updating product catalog...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl border border-brand-border p-8">
              <h3 className="text-sm font-semibold text-brand-muted">
                No products available
              </h3>
              <p className="mt-2 text-xs text-brand-muted max-w-sm mx-auto">
                No products are listed in this category at this time. Check back
                later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/stores/${storeSlug}/products/${product.id}`}
                  className="group rounded-2xl glass-card border border-brand-border overflow-hidden flex flex-col justify-between"
                >
                  <div className="aspect-video w-full bg-white flex items-center justify-center overflow-hidden border-b border-brand-border relative">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-brand-muted">
                        <svg
                          className="w-8 h-8 opacity-40"
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
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {product.category?.name && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20 mb-2 inline-block">
                          {product.category.name}
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-brand-text group-hover:text-brand-primary/80 transition-smooth line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-brand-muted mt-1 line-clamp-2 leading-relaxed">
                        {product.description || "No description provided."}
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between">
                      <span className="text-sm font-black text-brand-text">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      <span className="text-xxs font-bold text-brand-primary group-hover:underline">
                        View Product &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicStore;
