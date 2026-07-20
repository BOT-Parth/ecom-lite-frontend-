import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";
import { API_ENDPOINTS } from "../../../constants/api";
import OrderDetails from "./OrderDetails";
import OrderStatusBadge from "../../shared/OrderStatusBadge";

const OrdersManager = ({ storeId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get(API_ENDPOINTS.ORDERS.LIST(storeId));
      // Orders are returned newest first per backend capabilities
      setOrders(res.data?.orders || res.data?.data?.orders || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.ORDERS.LIST(storeId));
        if (!cancelled) {
          setOrders(res.data?.orders || res.data?.data?.orders || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load orders");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [storeId]);

  const fetchOrderDetail = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(API_ENDPOINTS.ORDERS.DETAIL(storeId, id));
      setOrderDetail(res.data?.order || res.data?.data?.order);
      setSelectedOrderId(id);
    } catch (err) {
      setError(err.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    fetchOrderDetail(id);
  };

  const handleBackToList = () => {
    setSelectedOrderId(null);
    setOrderDetail(null);
    setLoading(true);
    setError(null);
    fetchOrders(); // Refresh the list to reflect any status changes
  };

  if (loading && !orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-brand-muted">Loading orders...</p>
      </div>
    );
  }

  if (error && !selectedOrderId) {
    return (
      <div className="text-center py-12 glass-panel rounded-2xl border border-rose-800/30 bg-rose-950/10">
        <p className="text-sm text-rose-400 font-semibold mb-4">{error}</p>
        <button
          onClick={() => { setLoading(true); setError(null); fetchOrders(); }}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-900/50 hover:bg-rose-900 text-white transition-smooth"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (selectedOrderId && orderDetail) {
    return (
      <OrderDetails
        storeId={storeId}
        order={orderDetail}
        onBack={handleBackToList}
        onStatusUpdated={() => fetchOrderDetail(selectedOrderId)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-brand-text uppercase tracking-wider">
          Store Orders
        </h2>
        <span className="text-xs font-semibold text-brand-muted px-3 py-1 bg-brand-surface rounded-full border border-brand-border">
          {orders.length} Total
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-brand-border p-8 shadow-inner">
          <div className="mx-auto w-16 h-16 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-brand-muted opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-brand-text">No Orders Yet</h3>
          <p className="mt-2 text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
            When customers place orders on your public storefront, they will appear here.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-brand-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-brand-surface/50">
                  <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Order Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/50">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleRowClick(order.id)}
                    className="hover:bg-brand-surface/80 transition-smooth cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-brand-text group-hover:text-brand-primary transition-smooth">
                        #{order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-brand-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-brand-text">
                        ${parseFloat(order.totalAmount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-semibold text-brand-primary hover:text-brand-primary/80 opacity-0 group-hover:opacity-100 transition-smooth">
                        View Details &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
