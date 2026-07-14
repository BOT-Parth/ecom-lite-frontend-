import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants/api';
import storeResolver from '../services/storeResolver';
import ProductManager from '../components/dashboard/ProductManager';
import CategoryManager from '../components/dashboard/CategoryManager';
import InventoryManager from '../components/dashboard/InventoryManager';

const StoreDashboard = () => {
  const { storeSlug } = useParams();
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  const fetchStoreData = useCallback(async () => {
    try {
      const resolvedStore = await storeResolver.resolveStoreBySlug(storeSlug);
      if (!resolvedStore) {
        setError('Store not found');
        setLoading(false);
        return;
      }
      setStore(resolvedStore);
      const [categoriesRes, productsRes] = await Promise.all([
        api.get(API_ENDPOINTS.CATEGORIES.LIST_CREATE(resolvedStore.id)),
        api.get(API_ENDPOINTS.PRODUCTS.LIST_CREATE(resolvedStore.id)),
      ]);
      setCategories(categoriesRes.data?.categories || []);
      setProducts(productsRes.data?.products || []);
      setForbidden(false);
    } catch (err) {
      if (err.status === 403) {
        setForbidden(true);
      } else {
        setError(err.message || 'Failed to retrieve dashboard information');
      }
    } finally {
      setLoading(false);
    }
  }, [storeSlug]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // 1. Resolve store slug to get storeId
        const resolvedStore = await storeResolver.resolveStoreBySlug(storeSlug);
        if (!resolvedStore) {
          if (!cancelled) {
            setError('Store not found');
            setLoading(false);
          }
          return;
        }
        // 2. Fetch categories and products (requires store authorization check)
        const [categoriesRes, productsRes] = await Promise.all([
          api.get(API_ENDPOINTS.CATEGORIES.LIST_CREATE(resolvedStore.id)),
          api.get(API_ENDPOINTS.PRODUCTS.LIST_CREATE(resolvedStore.id)),
        ]);
        if (!cancelled) {
          setStore(resolvedStore);
          setCategories(categoriesRes.data?.categories || []);
          setProducts(productsRes.data?.products || []);
          setForbidden(false);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 403) {
            setForbidden(true);
          } else {
            setError(err.message || 'Failed to retrieve dashboard information');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [storeSlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-zinc-400">Loading store dashboard details...</p>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-zinc-800 shadow-2xl text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-950/50 text-rose-400 border border-rose-800/30 mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Access Restricted</h2>
          <p className="text-zinc-400 mt-2 text-xs leading-relaxed">
            You do not have permission to manage this store. You must possess the `MANAGE_PRODUCTS` membership role (e.g. Owner or Staff) inside this store to access its catalog tools.
          </p>
          <div className="mt-6">
            <Link
              to="/profile"
              className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-xl text-white bg-zinc-850 hover:bg-zinc-850 transition-smooth"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-zinc-850 text-center">
          <h2 className="text-xl font-bold text-white tracking-tight">Dashboard Load Failed</h2>
          <p className="text-zinc-400 mt-2 text-xs leading-relaxed">
            {error || 'Failed to initialize store panel.'}
          </p>
          <div className="mt-6">
            <Link
              to="/profile"
              className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-xl text-white bg-purple-600 hover:bg-purple-500 transition-smooth"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-zinc-800/40 relative overflow-hidden bg-gradient-to-r from-zinc-900/50 via-zinc-950 to-zinc-950">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Merchant Panel: {store.name}</h1>
            <p className="text-xs text-zinc-400 mt-1">/{store.slug} &bull; Manage products, categories and inventory stock</p>
          </div>
          <div>
            <Link
              to={`/stores/${store.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl border border-zinc-800 transition-smooth cursor-pointer"
            >
              View Public Shop
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Selector Navigation */}
      <div className="flex border-b border-zinc-900 gap-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-smooth cursor-pointer ${
            activeTab === 'products'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Catalog Products
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-smooth cursor-pointer ${
            activeTab === 'categories'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Catalog Categories
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 transition-smooth cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Inventory Stock
        </button>
      </div>

      {/* Dynamic Tab Content rendering */}
      <div className="py-4">
        {activeTab === 'products' && (
          <ProductManager
            storeId={store.id}
            products={products}
            categories={categories}
            onRefresh={fetchStoreData}
          />
        )}
        {activeTab === 'categories' && (
          <CategoryManager
            storeId={store.id}
            categories={categories}
            onRefresh={fetchStoreData}
          />
        )}
        {activeTab === 'inventory' && (
          <InventoryManager
            storeId={store.id}
            products={products}
            onRefresh={fetchStoreData}
          />
        )}
      </div>
    </div>
  );
};

export default StoreDashboard;
