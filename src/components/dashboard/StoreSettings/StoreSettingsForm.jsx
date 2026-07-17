import { useForm } from "react-hook-form";
import { useState } from "react";

const StoreSettingsForm = ({ defaultValues, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      avatarUrl: defaultValues?.avatarUrl || "",
    },
  });

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset(data); // reset dirty state with new values
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
          Store Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          {...register("name", {
            required: "Store name is required",
            minLength: { value: 3, message: "Store name must be at least 3 characters" },
            maxLength: { value: 100, message: "Store name must be at most 100 characters" },
          })}
          className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-smooth ${
            errors.name ? "border-rose-500/60 focus:ring-rose-500/50" : "border-brand-border focus:border-brand-primary"
          }`}
          placeholder="My Store"
        />
        {errors.name && <span className="text-xs text-rose-400 mt-1 block">{errors.name.message}</span>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
          Business Description
        </label>
        <textarea
          {...register("description", {
            maxLength: { value: 500, message: "Description must be at most 500 characters" },
          })}
          rows={4}
          className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-smooth resize-none ${
            errors.description ? "border-rose-500/60 focus:ring-rose-500/50" : "border-brand-border focus:border-brand-primary"
          }`}
          placeholder="Briefly describe your store and what you sell..."
        />
        {errors.description && (
          <span className="text-xs text-rose-400 mt-1 block">{errors.description.message}</span>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
          Store Avatar URL
        </label>
        <input
          type="url"
          {...register("avatarUrl", {
            maxLength: { value: 2048, message: "Avatar URL must be at most 2048 characters" },
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Must be a valid HTTP/HTTPS URL",
            },
          })}
          className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-smooth ${
            errors.avatarUrl ? "border-rose-500/60 focus:ring-rose-500/50" : "border-brand-border focus:border-brand-primary"
          }`}
          placeholder="https://example.com/logo.png"
        />
        {errors.avatarUrl && <span className="text-xs text-rose-400 mt-1 block">{errors.avatarUrl.message}</span>}
      </div>

      {isDirty && (
        <div className="bg-brand-primary/10 border border-brand-primary rounded-xl p-3 flex items-center justify-between animate-in fade-in">
          <p className="text-xs text-brand-primary font-medium">You have unsaved changes</p>
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-brand-border">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-white disabled:text-brand-muted disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-brand-primary/20 active:scale-95 transition-smooth flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default StoreSettingsForm;
