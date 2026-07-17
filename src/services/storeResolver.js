/**
 * Layer:
 * Service
 *
 * Purpose:
 * Resolves a human-readable store slug (e.g. "my-laptop-paradise") to its store details and UUID.
 * Includes authentication-scoped fallback search tiers:
 * 1. Checks "/stores/my" list (for merchants managing their own store, even if closed or pending).
 * 2. Checks "/stores/platform" list (for SUPER_ADMIN auditing).
 * 3. Falls back to "/stores" public list.
 *
 * Used By:
 * - PublicStore.jsx
 * - ProductDetails.jsx
 * - StoreDashboard.jsx
 *
 * Uses:
 * - api.js (Axios client)
 * - API_ENDPOINTS (constants)
 */

import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

class StoreResolver {
  /**
   * Fetches all public stores and finds the one matching the given slug.
   * @param {string} slug - The slug of the store to find.
   * @returns {Promise<Object>} The store object, or null if not found.
   */
  async resolveStoreBySlug(slug) {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // 1. Try my stores first (for merchants managing their own stores)
        try {
          const myStoresRes = await api.get(API_ENDPOINTS.STORES.MY_LIST);
          const myStores = myStoresRes.data?.stores || [];
          const store = myStores.find((s) => s.slug === slug);
          if (store) return store;
        } catch {
          // Ignore and proceed
        }

        // 2. Try platform stores (for SUPER_ADMIN)
        try {
          const platformStoresRes = await api.get("/stores/platform");
          const platformStores = platformStoresRes.data?.stores || [];
          const store = platformStores.find((s) => s.slug === slug);
          if (store) return store;
        } catch {
          // Ignore and proceed
        }
      }

      // 3. Fall back to public stores list
      const response = await api.get(API_ENDPOINTS.STORES.PUBLIC_LIST);
      const stores = response.data?.stores || [];
      const store = stores.find((s) => s.slug === slug);
      return store || null;
    } catch (err) {
      console.error("Failed to resolve store by slug:", err);
      throw err;
    }
  }

  /**
   * Resolves a slug and returns the store ID directly.
   * @param {string} slug - The slug of the store.
   * @returns {Promise<string|null>} The store UUID, or null if not found.
   */
  async getStoreIdBySlug(slug) {
    const store = await this.resolveStoreBySlug(slug);
    return store ? store.id : null;
  }
}

export default new StoreResolver();
