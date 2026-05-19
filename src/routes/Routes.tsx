// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

// Pages
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import CreateComplaint from "../pages/CreateComplaint";
import Analytics from "../pages/Analytics";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          {/* User Login */}
          <Route path="/login" element={<Login isAdmin={false} />} />

          {/* Admin Login */}
          <Route path="/admin-login" element={<Login isAdmin={true} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login isAdmin={false} />} />

          {/* User Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="USER">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-complaint"
            element={
              <ProtectedRoute requiredRole="USER">
                <CreateComplaint />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
