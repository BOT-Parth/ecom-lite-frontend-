import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { API_ENDPOINTS } from "../constants/api";
import storeResolver from "../services/storeResolver";
import OrderStatusBadge from "../components/shared/OrderStatusBadge";

const TrackOrder = () => {
  const { storeSlug } = useParams();
  const [store, setStore] = useState(null);
  
  const [loadingStore, setLoadingStore] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    const resolveStore = async () => {
      try {
        const resolvedStore = await storeResolver.resolveStoreBySlug(storeSlug);
        if (!resolvedStore) {
          setError("Store not found");
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setOrders(null);

    try {
      const res = await api.post(API_ENDPOINTS.ORDERS.TRACK(store.id), formData);
      setOrders(res.data?.orders || res.data?.data?.orders || []);
    } catch (err) {
      setError(err.message || "Failed to track orders");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStore) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-brand-muted">Loading tracker...</p>
      </div>
    );
  }

  if (!store && error) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-brand-border text-center">
          <h2 className="text-xl font-bold text-brand-text tracking-tight">Error</h2>
          <p className="text-brand-muted mt-2 text-xs leading-relaxed">{error}</p>
          <div className="mt-6">
            <Link to="/" className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl text-white bg-brand-primary hover:bg-brand-primary/90 transition-smooth">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div>
        <Link to={`/stores/${storeSlug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-text transition-smooth cursor-pointer mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to storefront
        </Link>
        <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">Track Your Order</h1>
        <p className="text-xs text-brand-muted mt-1">Enter your details to view recent orders from {store?.name}</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-border">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-brand-surface border border-brand-border text-brand-text text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-smooth"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-brand-surface border border-brand-border text-brand-text text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-smooth"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
          
          {error && store && (
            <div className="p-3 bg-rose-950/20 border border-rose-800/30 rounded-xl text-xs text-rose-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !formData.email || !formData.phone}
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl shadow-lg hover:shadow-brand-primary/20 transition-smooth disabled:bg-brand-surface disabled:text-brand-muted disabled:border disabled:border-brand-border disabled:shadow-none cursor-pointer flex justify-center items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-muted border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              "Find Orders"
            )}
          </button>
        </form>
      </div>

      {orders !== null && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-lg font-bold text-brand-text tracking-tight border-b border-brand-border pb-3">
            Search Results ({orders.length})
          </h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-2xl border border-brand-border">
              <p className="text-sm text-brand-muted">No orders found matching these details.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="glass-panel p-6 rounded-2xl border border-brand-border space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-border/50 pb-4">
                    <div>
                      <p className="text-xs text-brand-muted uppercase tracking-wider font-bold mb-1">Order #{order.orderNumber}</p>
                      <p className="text-xs text-brand-muted">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="mb-2"><OrderStatusBadge status={order.status} /></div>
                      <p className="text-sm font-black text-brand-text">${parseFloat(order.totalAmount).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-3">Delivery Address</h4>
                    <p className="text-sm text-brand-text bg-brand-surface p-3 rounded-xl border border-brand-border font-mono">{order.maskedDeliveryAddress}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm text-brand-text bg-brand-surface p-3 rounded-xl border border-brand-border">
                          <span>{item.quantity}x {item.productName}</span>
                          <span className="font-mono text-brand-muted">${parseFloat(item.unitPrice).toFixed(2)} ea</span>
                        </div>
                      ))}
                    </div>
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

export default TrackOrder;
