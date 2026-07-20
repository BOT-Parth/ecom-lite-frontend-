import { useState } from "react";
import api from "../../../services/api";
import { API_ENDPOINTS } from "../../../constants/api";
import { ORDER_STATUS } from "../../../constants/orders";
import OrderStatusBadge from "../../shared/OrderStatusBadge";
import { useToast } from "../../../hooks/useToast";

const OrderDetails = ({ storeId, order, onBack, onStatusUpdated }) => {
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await api.patch(API_ENDPOINTS.ORDERS.UPDATE_STATUS(storeId, order.id), {
        status: newStatus,
      });
      showToast(`Order status updated to ${newStatus}`, "success");
      onStatusUpdated();
    } catch (err) {
      showToast(err.message || "Failed to update order status", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-text transition-smooth cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">Update Status:</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating || order.status === ORDER_STATUS.COMPLETED || order.status === ORDER_STATUS.CANCELLED}
            className="bg-brand-surface border border-brand-border text-brand-text text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-primary disabled:opacity-50"
          >
            {Object.values(ORDER_STATUS).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-border">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-border/50 pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-brand-text tracking-tight mb-1">Order #{order.orderNumber}</h2>
            <p className="text-xs text-brand-muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="mb-2"><OrderStatusBadge status={order.status} /></div>
            <p className="text-xl font-black text-brand-text">${parseFloat(order.totalAmount).toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4">Customer Details</h3>
            <div className="bg-brand-surface p-4 rounded-xl border border-brand-border space-y-3">
              <div>
                <p className="text-xs text-brand-muted font-semibold">Name</p>
                <p className="text-sm text-brand-text font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-brand-muted font-semibold">Email</p>
                <p className="text-sm text-brand-text font-medium">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-xs text-brand-muted font-semibold">Phone</p>
                <p className="text-sm text-brand-text font-medium">{order.customerPhone}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4">Delivery Address</h3>
            <div className="bg-brand-surface p-4 rounded-xl border border-brand-border h-full">
              <p className="text-sm text-brand-text font-mono whitespace-pre-wrap">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4">Order Items ({order.items?.length || 0})</h3>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-brand-surface p-4 rounded-xl border border-brand-border">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-brand-primary">{item.quantity}x</span>
                  <span className="text-sm font-semibold text-brand-text">{item.productName}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-text">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                  <p className="text-xs font-mono text-brand-muted">${parseFloat(item.unitPrice).toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
