/**
 * Layer:
 * Constants
 *
 * Purpose:
 * Centralized list of API endpoints paths matching the backend router structure.
 *
 * Used By:
 * - AuthContext.jsx
 * - SuperAdminRequests.jsx
 * - Profile.jsx
 * - BrowseStores.jsx
 * - StoreDashboard.jsx
 * - PublicStore.jsx
 * - ProductDetails.jsx
 * - storeResolver.js
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  STORES: {
    PUBLIC_LIST: "/stores",
    MY_LIST: "/stores/my",
    PLATFORM_LIST: "/stores/platform",
    SETTINGS: (storeId) => `/stores/${storeId}/settings`,
  },
  STORE_REQUESTS: {
    CREATE: "/store-requests",
    LIST: "/store-requests",
    APPROVE: (requestId) => `/store-requests/${requestId}/approve`,
    REJECT: (requestId) => `/store-requests/${requestId}/reject`,
  },
  CATEGORIES: {
    LIST_CREATE: (storeId) => `/stores/${storeId}/categories`,
    DETAIL: (storeId, categoryId) =>
      `/stores/${storeId}/categories/${categoryId}`,
  },
  PRODUCTS: {
    LIST_CREATE: (storeId) => `/stores/${storeId}/products`,
    DETAIL: (storeId, productId) => `/stores/${storeId}/products/${productId}`,
  },
  INVENTORY: {
    DETAIL_UPDATE: (storeId, productId) =>
      `/stores/${storeId}/products/${productId}/inventory`,
  },
  ORDERS: {
    CREATE: (storeId) => `/stores/${storeId}/orders`,
    TRACK: (storeId) => `/stores/${storeId}/orders/track`,
    LIST: (storeId) => `/stores/${storeId}/orders`,
    DETAIL: (storeId, id) => `/stores/${storeId}/orders/${id}`,
    UPDATE_STATUS: (storeId, id) => `/stores/${storeId}/orders/${id}/status`,
  },
};
