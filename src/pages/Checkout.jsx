import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { API_ENDPOINTS } from "../constants/api";
import storeResolver from "../services/storeResolver";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";

const Checkout = () => {
  const { storeSlug } = useParams();
  const [store, setStore] = useState(null);
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();

  const [loadingStore, setLoadingStore] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
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
    if (cartItems.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    setSubmitting(true);
    
    // Simulated Payment Phase
    await new Promise((resolve) => setTimeout(resolve, 800));
    showToast("Payment Successful (Simulated)", "success");

    try {
      const payload = {
        ...formData,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await api.post(API_ENDPOINTS.ORDERS.CREATE(store.id), payload);
      
      setSuccessOrder(res.data?.order || res.data?.data?.order);
      clearCart();
    } catch (err) {
      // Inventory errors will be caught here and displayed verbatim
      showToast(err.message || "Failed to place order", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStore) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-brand-muted">Loading checkout...</p>
      </div>
    );
  }

  if (error || !store) {
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

  if (successOrder) {
    return (
      <div className="flex justify-center items-center py-20 px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-full max-w-lg glass-panel p-8 rounded-3xl border border-brand-border text-center shadow-2xl">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-800/30 mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-brand-text tracking-tight mb-2">Order Confirmed!</h2>
          <p className="text-brand-muted text-sm mb-8">Thank you for your purchase.</p>
          
          <div className="text-left bg-brand-surface p-6 rounded-2xl border border-brand-border space-y-3 mb-8">
            <div className="flex justify-between items-center pb-3 border-b border-brand-border/50">
              <span className="text-xs text-brand-muted uppercase tracking-wider font-bold">Order Number</span>
              <span className="text-sm font-bold text-brand-text font-mono">{successOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-brand-border/50">
              <span className="text-xs text-brand-muted uppercase tracking-wider font-bold">Status</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{successOrder.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-muted uppercase tracking-wider font-bold">Total Amount</span>
              <span className="text-lg font-black text-brand-text">${parseFloat(successOrder.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          <Link
            to={`/stores/${storeSlug}`}
            className="inline-flex w-full justify-center items-center px-4 py-3 text-sm font-semibold rounded-xl text-white bg-brand-primary hover:bg-brand-primary/90 transition-smooth shadow-lg hover:shadow-brand-primary/20"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <Link to={`/stores/${storeSlug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-text transition-smooth cursor-pointer mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to storefront
        </Link>
        <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">Checkout</h1>
        <p className="text-xs text-brand-muted mt-1">Complete your order for {store.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-brand-border">
          <h2 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">
            Customer Information
          </h2>
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={100}
                className="w-full bg-brand-surface border border-brand-border text-brand-text text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-smooth"
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
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
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required
                  minLength={10}
                  className="w-full bg-brand-surface border border-brand-border text-brand-text text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-smooth"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                Delivery Address
              </label>
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                required
                minLength={1}
                maxLength={500}
                rows={3}
                className="w-full bg-brand-surface border border-brand-border text-brand-text text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-smooth resize-none"
                placeholder="123 Main St, City, Country"
              />
            </div>
          </form>
        </div>

        {/* Order Summary (Items Only) */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-border sticky top-8">
            <h2 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-6 pb-4 border-b border-brand-border">
              Selected Products
            </h2>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-brand-muted">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 py-3 border-b border-brand-border/50 last:border-0">
                    {item.product.imageUrls && item.product.imageUrls.length > 0 ? (
                      <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover border border-brand-border" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center">
                        <span className="text-[8px] uppercase text-brand-muted font-bold tracking-wider">No Img</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-brand-text line-clamp-1">{item.product.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="text-brand-muted hover:text-brand-text px-2 py-0.5 bg-brand-surface rounded border border-brand-border transition-smooth">-</button>
                        <span className="text-xs font-bold text-brand-text w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="text-brand-muted hover:text-brand-text px-2 py-0.5 bg-brand-surface rounded border border-brand-border transition-smooth">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-brand-muted hover:text-rose-400 p-2 transition-smooth">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              form="checkout-form"
              type="submit"
              disabled={submitting || cartItems.length === 0}
              className="w-full py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl shadow-lg hover:shadow-brand-primary/20 transition-smooth disabled:bg-brand-surface disabled:text-brand-muted disabled:border disabled:border-brand-border disabled:shadow-none cursor-pointer flex justify-center items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-brand-muted border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
            <p className="text-[10px] text-brand-muted text-center mt-4 uppercase tracking-wider font-semibold">
              Prices & Totals calculated securely at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
