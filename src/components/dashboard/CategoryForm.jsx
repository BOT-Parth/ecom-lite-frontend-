import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const CategoryForm = ({ onSubmit, initialData = null, onCancel, loading = false }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || { name: '', slug: '' },
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('slug', initialData.slug);
    }
  }, [initialData, setValue]);

  // Helper to auto-generate slug
  const handleNameChange = (e) => {
    if (initialData) return; // Do not auto-generate when editing
    const value = e.target.value;
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setValue('slug', generatedSlug, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Category Name
        </label>
        <input
          type="text"
          {...register('name', {
            required: 'Category Name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' },
            maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
          })}
          onChange={handleNameChange}
          className={`w-full px-4 py-2.5 rounded-xl bg-zinc-900 border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-smooth ${
            errors.name ? 'border-rose-500/60 focus:ring-rose-500/50' : 'border-zinc-800 focus:border-purple-500'
          }`}
          placeholder="e.g. Laptops"
        />
        {errors.name && (
          <span className="text-xs text-rose-400 mt-1 block">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Category Slug
        </label>
        <input
          type="text"
          disabled={!!initialData}
          {...register('slug', {
            required: 'Category Slug is required',
            pattern: {
              value: /^[a-z0-9-]+$/,
              message: 'Slug must consist of lowercase alphanumeric characters and hyphens only',
            },
            minLength: { value: 3, message: 'Slug must be at least 3 characters' },
            maxLength: { value: 50, message: 'Slug cannot exceed 50 characters' },
          })}
          className={`w-full px-4 py-2.5 rounded-xl bg-zinc-900 border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-smooth ${
            errors.slug ? 'border-rose-500/60 focus:ring-rose-500/50' : 'border-zinc-800 focus:border-purple-500'
          } disabled:opacity-50`}
          placeholder="e.g. laptops"
        />
        {errors.slug && (
          <span className="text-xs text-rose-400 mt-1 block">{errors.slug.message}</span>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl border border-zinc-800 transition-smooth cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-xs font-semibold text-white rounded-xl shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-smooth cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Category</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
