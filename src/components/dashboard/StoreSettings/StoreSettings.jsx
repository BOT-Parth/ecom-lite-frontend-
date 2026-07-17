import { useState, useEffect } from "react";
import api from "../../../services/api";
import { API_ENDPOINTS } from "../../../constants/api";
import { useToast } from "../../../hooks/useToast";
import { useAuth } from "../../../hooks/useAuth";
import StoreSettingsForm from "./StoreSettingsForm";

const StoreSettings = ({ storeId, onRefresh }) => {
  const { refreshProfile } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get(API_ENDPOINTS.STORES.SETTINGS(storeId));
        if (active) {
          setSettings(res.data.settings);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (active) setError("Failed to load store settings");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchSettings();
    return () => { active = false; };
  }, [storeId, retry]);

  const handleSave = async (data) => {
    try {
      const res = await api.patch(API_ENDPOINTS.STORES.SETTINGS(storeId), data);
      showToast("Store settings updated successfully", "success");
      setSettings(res.data.settings);
      await refreshProfile();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error?.message || err.message || "Failed to update store settings", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-brand-muted">Loading store settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-950/20 border border-rose-900/50 rounded-2xl p-6 text-center">
        <p className="text-sm text-rose-400">{error}</p>
        <button
          onClick={() => setRetry(r => r + 1)}
          className="mt-4 px-4 py-2 text-xs font-semibold bg-white hover:bg-brand-secondary text-brand-text rounded-xl transition-smooth cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/30 border border-brand-border rounded-2xl p-6 animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-brand-text tracking-tight">Store Settings</h2>
        <p className="text-xs text-brand-muted mt-1">Manage your store's business information and identity.</p>
      </div>
      <StoreSettingsForm defaultValues={settings} onSubmit={handleSave} />
    </div>
  );
};

export default StoreSettings;
