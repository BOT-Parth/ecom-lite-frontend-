/**
 * Layer:
 * Root Component
 *
 * Purpose:
 * Renders the primary application wrapper, configuring context providers (Toast, Auth),
 * browser routing structure, layout frame, and path-restricted route guards.
 *
 * Used By:
 * - main.jsx
 *
 * Uses:
 * - ToastProvider, AuthProvider (contexts)
 * - ProtectedRoute (route guard)
 * - MainLayout (layout frame)
 * - Various Pages (BrowseStores, RootRedirect, Login, Register, Profile, SuperAdminRequests, PublicStore, ProductDetails, StoreDashboard, NotFound)
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

// Pages
import BrowseStores from "./pages/BrowseStores";
import RootRedirect from "./pages/RootRedirect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SuperAdminRequests from "./pages/SuperAdminRequests";
import PublicStore from "./pages/PublicStore";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import StoreDashboard from "./pages/StoreDashboard";
import NotFound from "./pages/NotFound";
import PublicStoreLayout from "./layouts/PublicStoreLayout";

import "./App.css";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <MainLayout>
            <Routes>
              {/* Root — redirects based on authentication and role */}
              <Route path="/" element={<RootRedirect />} />

              {/* Authentication — redirect to dashboard if already logged in */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Public Storefronts */}
              <Route path="/stores/:storeSlug" element={<PublicStoreLayout />}>
                <Route index element={<PublicStore />} />
                <Route
                  path="products/:productId"
                  element={<ProductDetails />}
                />
                <Route path="checkout" element={<Checkout />} />
                <Route path="track-order" element={<TrackOrder />} />
              </Route>

              {/* Protected: Store Owner / Merchant */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores/:storeSlug/dashboard"
                element={
                  <ProtectedRoute>
                    <StoreDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected: Platform Admin */}
              <Route
                path="/admin/stores"
                element={
                  <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                    <BrowseStores />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/requests"
                element={
                  <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                    <SuperAdminRequests />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
