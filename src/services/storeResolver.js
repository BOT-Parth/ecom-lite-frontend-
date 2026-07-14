import api from './api';
import { API_ENDPOINTS } from '../constants/api';

class StoreResolver {
  /**
   * Fetches all public stores and finds the one matching the given slug.
   * @param {string} slug - The slug of the store to find.
   * @returns {Promise<Object>} The store object, or null if not found.
   */
  async resolveStoreBySlug(slug) {
    try {
      const response = await api.get(API_ENDPOINTS.STORES.PUBLIC_LIST);
      const stores = response.data?.stores || [];
      const store = stores.find((s) => s.slug === slug);
      return store || null;
    } catch (err) {
      console.error('Failed to resolve store by slug:', err);
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
