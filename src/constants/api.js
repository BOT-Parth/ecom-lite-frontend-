export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  STORES: {
    PUBLIC_LIST: "/stores",
    MY_LIST: "/stores/my",
    DETAIL: (storeId) => `/stores/${storeId}`,
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
};
