import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ProductForm = ({
  onSubmit,
  categories = [],
  initialData = null,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      name: "",
      description: "",
      price: "",
      imageUrls: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("description", initialData.description || "");
      setValue("price", initialData.price);
      setValue(
        "imageUrls",
        initialData.imageUrls ? initialData.imageUrls.join(", ") : "",
      );
      setValue("categoryId", initialData.categoryId || "");
    }
  }, [initialData, setValue]);

  const handleFormSubmit = (data) => {
    // Process imageUrls comma separated string into an array of trimmed URLs
    const urls = data.imageUrls
      ? data.imageUrls
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url !== "")
      : [];

    // Parse price to float
    const parsedPrice = parseFloat(data.price);

    const payload = {
      name: data.name,
      description: data.description || null,
      price: parsedPrice,
      imageUrls: urls,
      categoryId: data.categoryId === "" ? null : data.categoryId,
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 max-h-[80vh] overflow-y-auto px-1"
    >
      <div>
        <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
          Product Name
        </label>
        <input
          type="text"
          {...register("name", {
            required: "Product Name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters",
            },
            maxLength: {
              value: 100,
              message: "Name cannot exceed 100 characters",
            },
          })}
          className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-smooth ${
            errors.name
              ? "border-rose-500/60 focus:ring-rose-500/50"
              : "border-brand-border focus:border-brand-primary"
          }`}
          placeholder="e.g. MacBook Pro M3"
        />
        {errors.name && (
          <span className="text-xs text-rose-400 mt-1 block">
            {errors.name.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          rows="3"
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-brand-border text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-smooth"
          placeholder="Describe the product details..."
        ></textarea>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
            Price ($ USD)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              validate: (value) =>
                parseFloat(value) > 0 || "Price must be a positive number",
            })}
            className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-smooth ${
              errors.price
                ? "border-rose-500/60 focus:ring-rose-500/50"
                : "border-brand-border focus:border-brand-primary"
            }`}
            placeholder="19.99"
          />
          {errors.price && (
            <span className="text-xs text-rose-400 mt-1 block">
              {errors.price.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
            Category
          </label>
          <select
            {...register("categoryId")}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-brand-border text-sm text-brand-text focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-smooth"
          >
            <option value="">Uncategorized (None)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
          Image URLs (Comma separated)
        </label>
        <input
          type="text"
          {...register("imageUrls")}
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-brand-border text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-smooth"
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
        <span className="text-[10px] text-brand-muted mt-1 block">
          Enter one or multiple URLs separated by commas.
        </span>
      </div>

      {!initialData && (
        <div className="p-3.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xxs leading-relaxed">
          <strong>Note:</strong> Newly created products start with a stock
          quantity of <strong>0</strong> automatically. You can adjust the stock
          under the <strong>Inventory</strong> tab once the product is added.
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold bg-white hover:bg-brand-secondary text-brand-muted rounded-xl border border-brand-border transition-smooth cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-brand-primary/50 disabled:cursor-not-allowed text-xs font-semibold text-white rounded-xl shadow-lg hover:shadow-brand-primary/20 active:scale-95 transition-smooth cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Product</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
