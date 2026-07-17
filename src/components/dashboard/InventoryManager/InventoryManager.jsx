/**
 * Layer:
 * Business Component / Dashboard Module
 *
 * Purpose:
 * Administers the inventory levels for products within a specific store. Enables store admins
 * to view current stock counts and submit adjustments to the backend database.
 *
 * Used By:
 * - StoreDashboard.jsx
 *
 * Uses:
 * - api.js (Axios client)
 * - useToast() (status alerts)
 *
 * Props Expected:
 * - storeId (string) - UUID of the merchant store
 * - products (Array) - Product list (with nested inventory objects to get quantity)
 * - onRefresh (Function) - Callback to refresh store dashboard parent state
 *
 * Backend APIs:
 * - PATCH /stores/:storeId/products/:productId/inventory (update product stock level)
 */

import { useState } from "react";
import api from "../../../services/api";
import { API_ENDPOINTS } from "../../../constants/api";
import { useToast } from "../../../hooks/useToast";

const InventoryManager = ({ storeId, products, onRefresh }) => {
  const { showToast } = useToast();
  const [quantities, setQuantities] = useState({});
  const [savingId, setSavingId] = useState(null);

  const handleInputChange = (productId, val) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: val,
    }));
  };

  const handleSaveStock = async (productId) => {
    const editVal = quantities[productId];
    if (editVal === undefined || editVal === "") {
      showToast("Please enter a valid stock quantity", "warning");
      return;
    }

    const quantity = parseInt(editVal, 10);
    if (isNaN(quantity) || quantity < 0) {
      showToast("Quantity must be a non-negative integer (>= 0)", "error");
      return;
    }

    setSavingId(productId);
    try {
      await api.patch(
        API_ENDPOINTS.INVENTORY.DETAIL_UPDATE(storeId, productId),
        {
          quantity,
        },
      );
      showToast("Inventory stock level updated successfully", "success");
      // Clear temp editing quantity state
      setQuantities((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      onRefresh();
    } catch (err) {
      showToast(err.message || "Failed to update stock quantity", "error");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h2 className="text-lg font-bold text-brand-text tracking-tight">
          Inventory Management
        </h2>
        <p className="text-xs text-brand-muted mt-1">
          Adjust and update current stock levels for products
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-2xl border border-brand-border p-6">
          <h3 className="text-sm font-semibold text-brand-muted">
            No products to manage stock
          </h3>
          <p className="mt-1 text-xs text-brand-muted">
            Add products to your catalog to configure their inventory stock.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-brand-border overflow-hidden shadow-lg">
          <table className="min-w-full divide-y divide-brand-border text-left text-xs">
            <thead className="bg-white/40 text-brand-muted font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Product Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Current Stock</th>
                <th className="px-6 py-3.5">Adjust Stock Level</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-brand-muted font-medium">
              {products.map((p) => {
                const stock = p.inventory?.quantity ?? 0;
                const draftValue = quantities[p.id];
                const isModified =
                  draftValue !== undefined &&
                  parseInt(draftValue, 10) !== stock;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-white/10 transition-smooth"
                  >
                    <td className="px-6 py-4 font-semibold text-brand-text">
                      {p.name}
                    </td>
                    <td className="px-6 py-4">
                      {p.category?.name ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20">
                          {p.category.name}
                        </span>
                      ) : (
                        <span className="text-[9px] text-brand-muted uppercase">
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          stock > 0
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/30"
                            : "bg-rose-950/80 text-rose-400 border border-rose-800/30"
                        }`}
                      >
                        {stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        value={draftValue !== undefined ? draftValue : stock}
                        onChange={(e) =>
                          handleInputChange(p.id, e.target.value)
                        }
                        className="w-24 px-3 py-1.5 rounded-lg bg-white border border-brand-border text-xs text-brand-text placeholder-brand-muted/70 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        disabled={savingId === p.id || !isModified}
                        onClick={() => handleSaveStock(p.id, stock)}
                        className={`px-3 py-1.5 rounded-lg text-xxs font-bold uppercase tracking-wider transition-smooth cursor-pointer ${
                          isModified
                            ? "bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg"
                            : "bg-white text-brand-muted cursor-not-allowed border border-brand-border"
                        }`}
                      >
                        {savingId === p.id ? "Saving..." : "Save Stock"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
