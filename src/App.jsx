import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute, GuestRoute } from "@/components/auth/ProtectedRoute";

import AdminLogin from "@/pages/auth/AdminLogin";

import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import ProductForm from "@/pages/admin/ProductForm";
import AdminCategories from "@/pages/admin/Categories";
import AdminOrders from "@/pages/admin/Orders";
import OrderDetail from "@/pages/admin/OrderDetail";
import AdminBanners from "@/pages/admin/Banners";
import AdminUsers from "@/pages/admin/Users";
import Profile from "@/pages/admin/Profile";

function App() {
return (
<Routes>
<Route
path="/login"
element={
<GuestRoute>
<AdminLogin />
</GuestRoute>
}
/>

  <Route
    path="/"
    element={
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="products/new" element={<ProductForm />} />
    <Route path="products/:id" element={<ProductForm />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="orders/:id" element={<OrderDetail />} />
    <Route path="banners" element={<AdminBanners />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="profile" element={<Profile />} />
  </Route>

  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>

);
}

export default App;