import { Navigate, Route, Routes } from "react-router-dom";
import { UserLayout } from "@/components/layout/UserLayout";
import Home from "@/pages/user/Home";
import Catalog from "@/pages/user/Catalog";
import ProductDetail from "@/pages/user/ProductDetail";
import Favorites from "@/pages/user/Favorites";
import Cart from "@/pages/user/Cart";
import Checkout from "@/pages/user/Checkout";
import Orders from "@/pages/user/Orders";
import OrderDetail from "@/pages/user/OrderDetail";
import Profile from "@/pages/user/Profile";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

function App() {
  return (
    <Routes>
      {/* Auth sahifalari UserLayout'dan tashqarida (header/footer'siz) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
