/**
 * Layer:
 * Page
 *
 * Purpose:
 * Renders fallback 404 Page Not Found error messaging and direct return-home link redirection.
 *
 * Used By:
 * - App.jsx (catch-all route path)
 */

import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface px-4 text-center">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-brand-border shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <h1 className="text-8xl font-black text-brand-primary">
          404
        </h1>
        <h2 className="text-2xl font-bold text-brand-text mt-4">Page Not Found</h2>
        <p className="text-brand-muted mt-2 text-sm leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand-primary hover:bg-brand-primary/90 transition-smooth shadow-lg hover:shadow-brand-primary/20 active:scale-95"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
