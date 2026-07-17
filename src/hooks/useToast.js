/**
 * Layer:
 * Custom Hook
 *
 * Purpose:
 * Exposes the ToastContext trigger method to publish messages to the global overlay.
 *
 * Uses:
 * - ToastContext (context object)
 *
 * Returns:
 * - Object: { showToast }
 */

import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

/**
 * Accesses ToastContext trigger utility methods.
 *
 * Returns:
 * ToastContextValue
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
