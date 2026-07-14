import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to simplify backend responses and unified error reporting
api.interceptors.response.use(
  (response) => {
    // Return the response data directly
    return response.data;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Backend returned an error response (4xx, 5xx)
      const data = error.response.data;
      errorMessage = data?.message || errorMessage;

      // Attach status code and validation context to the error object if present
      error.status = error.response.status;
      error.details = data?.errors || null;
    } else if (error.request) {
      // No response was received from the server
      errorMessage = 'Could not connect to the server. Please check your connection.';
    }

    error.message = errorMessage;
    return Promise.reject(error);
  }
);

export default api;
