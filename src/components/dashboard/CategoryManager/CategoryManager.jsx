import { useState } from "react";
import CategoryForm from "../CategoryForm/CategoryForm";
import api from "../../../services/api";
import { API_ENDPOINTS } from "../../../constants/api";
import { useToast } from "../../../hooks/useToast";

const CategoryManager = ({ storeId, categories, onRefresh }) => {
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  const handleCreateOrUpdate = async (formData) => {
    setLoading(true);
    try {
      if (editingCategory) {
        // Edit category
        await api.patch(
          API_ENDPOINTS.CATEGORIES.DETAIL(storeId, editingCategory.id),
          {
            name: formData.name,
          },
        );
        showToast("Category updated successfully", "success");
      } else {
        // Create category
        await api.post(API_ENDPOINTS.CATEGORIES.LIST_CREATE(storeId), formData);
        showToast("Category created successfully", "success");
      }
      setIsFormOpen(false);
      setEditingCategory(null);
      onRefresh();
    } catch (err) {
      showToast(err.message || "Failed to save category", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(API_ENDPOINTS.CATEGORIES.DETAIL(storeId, id));
      showToast(
        "Category deleted successfully. Referencing products are now uncategorized.",
        "success",
      );
      setShowConfirmDelete(null);
      onRefresh();
    } catch (err) {
      showToast(err.message || "Failed to delete category", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Category Catalog
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Organize products inside custom store categories
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg hover:shadow-purple-500/20 transition-smooth cursor-pointer"
        >
          Add Category
        </button>
      </div>

      {/* Category Editor Drawer/Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-white mb-4 border-b border-zinc-900 pb-2">
              {editingCategory ? "Edit Category" : "Create New Category"}
            </h3>
            <CategoryForm
              initialData={editingCategory}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingCategory(null);
              }}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Categories List Table */}
      {categories.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-2xl border border-zinc-850 p-6">
          <h3 className="text-sm font-semibold text-zinc-300">
            No categories created yet
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Categories help organize catalog products in storefront directories.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-zinc-850 overflow-hidden shadow-lg">
          <table className="min-w-full divide-y divide-zinc-900 text-left text-xs">
            <thead className="bg-zinc-900/40 text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Category Name</th>
                <th className="px-6 py-3.5">URL Slug</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300 font-medium">
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-zinc-900/10 transition-smooth"
                >
                  <td className="px-6 py-4 font-semibold text-white">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-mono">
                    /{cat.slug}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsFormOpen(true);
                        }}
                        className="text-purple-400 hover:text-purple-300 font-bold transition-smooth cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(cat.id)}
                        className="text-rose-400 hover:text-rose-300 font-bold transition-smooth cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-zinc-850 shadow-2xl text-center">
            <h4 className="text-base font-bold text-white mb-2">
              Delete Category?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Are you sure? Products linked to this category will **NOT** be
              deleted, but their category fields will be set to **NULL**
              (uncategorized).
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
                  : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
