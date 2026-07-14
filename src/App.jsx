
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import PublicStore from './pages/PublicStore';
import ProductDetails from './pages/ProductDetails';
import StoreDashboard from './pages/StoreDashboard';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <MainLayout>
            <Routes>
              {/* Public Directories & Shops */}
              <Route path="/" element={<Home />} />
              <Route path="/stores/:storeSlug" element={<PublicStore />} />
              <Route path="/stores/:storeSlug/products/:productId" element={<ProductDetails />} />

              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Dashboard */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected Store Dashboard */}
              <Route
                path="/stores/:storeSlug/dashboard"
                element={
                  <ProtectedRoute>
                    <StoreDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Platform Admin Panel */}
              <Route
                path="/admin/requests"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
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
