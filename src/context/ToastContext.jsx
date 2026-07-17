/**
 * Layer:
 * Context
 *
 * Purpose:
 * Provides global toast notification alerts overlay services.
 *
 * Used By:
 * - App.jsx (ToastProvider wrapping)
 * - useToast.js (hook)
 *
 * Renders:
 * - Floating toasts overlay at top right of the viewport
 */

import { useState, useCallback } from 'react';
import { ToastContext } from '../hooks/useToast';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Appends a new toast alert to the list and sets auto-cleanup timer.
   *
   * Called:
   * - Globally by any component needing to notify the user.
   *
   * Parameters:
   * - message (string)
   * - type ('success' | 'error' | 'warning' | 'info')
   * - duration (number) in milliseconds (default 4000)
   */
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  /**
   * Dismisses a toast manually.
   *
   * Called:
   * - Clicking on a toast item close button or card area.
   */
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container overlay */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 cursor-pointer animate-in fade-in slide-in-from-top-4 ${
              toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/30 text-rose-200'
                : toast.type === 'warning'
                ? 'bg-amber-950/80 border-amber-500/30 text-amber-200'
                : 'bg-white/80 border-brand-border text-brand-text'
            }`}
          >
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            <button className="text-xs opacity-50 hover:opacity-100 transition-opacity font-bold">
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
