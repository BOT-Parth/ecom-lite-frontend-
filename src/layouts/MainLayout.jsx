/**
 * Layer:
 * Layout
 *
 * Purpose:
 * Renders the global layout template wrapper including the Navbar header,
 * main responsive container overlay, and standard copyright footer.
 *
 * Used By:
 * - App.jsx (wraps routes)
 *
 * Uses:
 * - Navbar.jsx (header component)
 */

import Navbar from "../components/Navbar/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-surface text-brand-text">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        {children}
      </main>
      <footer className="w-full border-t border-brand-border bg-brand-surface py-6 text-center text-xs text-brand-muted">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} E-Com Lite. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
