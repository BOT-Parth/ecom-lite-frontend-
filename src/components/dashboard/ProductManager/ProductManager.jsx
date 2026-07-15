import { useState } from "react";
import ProductForm from "../ProductForm/ProductForm";
import api from "../../../services/api";
import { API_ENDPOINTS } from "../../../constants/api";
import { useToast } from "../../../hooks/useToast";

const ProductManager = ({ storeId, products, categories, onRefresh }) => {
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  const handleCreateOrUpdate = async (payload) => {
    setLoading(true);
    try {
      if (editingProduct) {
        // Edit product
        await api.patch(
          API_ENDPOINTS.PRODUCTS.DETAIL(storeId, editingProduct.id),
          payload,
        );
        showToast("Product updated successfully", "success");
      } else {
        // Create product
        await api.post(API_ENDPOINTS.PRODUCTS.LIST_CREATE(storeId), payload);
        showToast(
          "Product created successfully. Default inventory stock is 0.",
          "success",
        );
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      onRefresh();
    } catch (err) {
      showToast(err.message || "Failed to save product", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(API_ENDPOINTS.PRODUCTS.DETAIL(storeId, id));
      showToast("Product deleted successfully", "success");
      setShowConfirmDelete(null);
      onRefresh();
    } catch (err) {
      showToast(err.message || "Failed to delete product", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Products Catalog
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage listings, prices, descriptions, and categories
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg hover:shadow-purple-500/20 transition-smooth cursor-pointer"
        >
          Add Product
        </button>
      </div>

      {/* Product Editor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-white mb-4 border-b border-zinc-900 pb-2">
              {editingProduct ? "Edit Product" : "Create New Product"}
            </h3>
            <ProductForm
              initialData={editingProduct}
              categories={categories}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingProduct(null);
              }}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Product List Table */}
      {products.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-2xl border border-zinc-850 p-6">
          <h3 className="text-sm font-semibold text-zinc-300">
            No products created yet
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Create new products to list them on your storefront.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-zinc-850 overflow-hidden shadow-lg">
          <table className="min-w-full divide-y divide-zinc-900 text-left text-xs">
            <thead className="bg-zinc-900/40 text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Inventory</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300 font-medium">
              {products.map((p) => {
                const stock = p.inventory?.quantity ?? 0;
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-zinc-900/10 transition-smooth"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-white">
                        {p.name}
                      </div>
                      {p.description && (
                        <div className="text-[10px] text-zinc-500 truncate max-w-xs mt-0.5">
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.category?.name ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/20 px-2 py-0.5 rounded border border-purple-900/30">
                          {p.category.name}
                        </span>
                      ) : (
                        <span className="text-[9px] text-zinc-650 uppercase">
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-white">
                      ${parseFloat(p.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          stock > 0
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/30"
                            : "bg-rose-950/80 text-rose-400 border border-rose-800/30"
                        }`}
                      >
                        {stock > 0 ? `${stock} in stock` : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsFormOpen(true);
                          }}
                          className="text-purple-400 hover:text-purple-300 font-bold transition-smooth cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowConfirmDelete(p.id)}
                          className="text-rose-400 hover:text-rose-300 font-bold transition-smooth cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-zinc-850 shadow-2xl text-center">
            <h4 className="text-base font-bold text-white mb-2">
              Delete Product?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Are you sure you want to delete this product? This action is
              permanent and will remove the item and its inventory history.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(null)}
                className="px-4 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl border border-zinc-800 transition-smooth cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === showConfirmDelete}
                onClick={() => handleDelete(showConfirmDelete)}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 disabled:cursor-not-allowed text-white rounded-xl shadow-lg transition-smooth cursor-pointer"
              >
                {deletingId === showConfirmDelete
                  ? "Deleting..."
                  : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
