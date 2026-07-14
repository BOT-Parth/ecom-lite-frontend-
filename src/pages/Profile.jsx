import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants/api';

const Profile = () => {
  const { user, userStores, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // Helper to auto-generate slug from name
  const handleNameChange = (e) => {
    const value = e.target.value;
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace with -
      .replace(/-+/g, '-'); // collapse multiple -
    setValue('slug', generatedSlug, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.STORE_REQUESTS.CREATE, {
        name: data.name,
        slug: data.slug,
      });
      showToast('Store creation request submitted successfully. Awaiting admin approval.', 'success');
      reset();
      setIsFormOpen(false);
      refreshProfile();
    } catch (err) {
      showToast(err.message || 'Failed to submit store request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header Profile Section */}
      <div className="glass-panel p-8 rounded-3xl border border-zinc-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-purple-500/20">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{user?.username}</h1>
              <p className="text-xs text-zinc-400 mt-1">{user?.email}</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-smooth cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Request New Store
            </button>
          </div>
        </div>
      </div>

      {/* Store Request Form Section */}
      {isFormOpen && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 bg-purple-950/5 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Store Request Form</h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-zinc-500 hover:text-zinc-300 transition-smooth text-lg"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Store Name
              </label>
              <input
                type="text"
                {...register('name', {
                  required: 'Store Name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                  maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
                })}
                onChange={handleNameChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-zinc-900 border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-smooth ${
                  errors.name ? 'border-rose-500/60 focus:ring-rose-500/50' : 'border-zinc-800 focus:border-purple-500'
                }`}
                placeholder="e.g. My Laptop Paradise"
              />
              {errors.name && (
                <span className="text-xs text-rose-400 mt-1 block">{errors.name.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Store Slug
              </label>
              <input
                type="text"
                {...register('slug', {
                  required: 'Store Slug is required',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: 'Slug must consist of lowercase alphanumeric characters and hyphens only',
                  },
                  minLength: { value: 3, message: 'Slug must be at least 3 characters' },
                  maxLength: { value: 50, message: 'Slug cannot exceed 50 characters' },
                })}
                className={`w-full px-4 py-2.5 rounded-xl bg-zinc-900 border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-smooth ${
                  errors.slug ? 'border-rose-500/60 focus:ring-rose-500/50' : 'border-zinc-800 focus:border-purple-500'
                }`}
                placeholder="e.g. my-laptop-paradise"
              />
              {errors.slug && (
                <span className="text-xs text-rose-400 mt-1 block">{errors.slug.message}</span>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 border-t border-zinc-900 pt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
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
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Request</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User Stores Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Your Store Memberships</h2>
          <p className="text-xs text-zinc-400 mt-1">Stores that you own or are authorized to manage</p>
        </div>

        {userStores.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-zinc-850 p-8">
            <svg className="mx-auto h-12 w-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <h3 className="mt-4 text-sm font-semibold text-zinc-200">No stores linked</h3>
            <p className="mt-2 text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              You do not have any registered store memberships yet. Submit a store request above to get started as a merchant!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userStores.map((store) => (
              <div
                key={store.id}
                className="glass-panel p-6 rounded-2xl border border-zinc-850 hover:border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2 rounded-xl bg-purple-950/40 text-purple-400 border border-purple-900/30">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/30">
                      Active
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100">{store.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1">/{store.slug}</p>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-900">
                  <Link
                    to={`/stores/${store.slug}`}
                    className="text-xs font-semibold text-zinc-400 hover:text-white transition-smooth"
                  >
                    View Storefront
                  </Link>
                  <Link
                    to={`/stores/${store.slug}/dashboard`}
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-smooth shadow-lg shadow-purple-600/10"
                  >
                    Store Dashboard &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
