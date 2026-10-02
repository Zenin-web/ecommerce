import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { UserLayout } from "@/components/layout/UserLayout";
import Home from "@/pages/user/Home";
import Catalog from "@/pages/user/Catalog";
import ProductDetail from "@/pages/user/ProductDetail";
import Favorites from "@/pages/user/Favorites";
import Cart from "@/pages/user/Cart";
import Checkout from "@/pages/user/Checkout";
import Orders from "@/pages/user/Orders";
import OrderDetail from "@/pages/user/OrderDetail";
import Addresses from "@/pages/user/Addresses";
import Profile from "@/pages/user/Profile";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

function ProductRoute() {
  const { id } = useParams();
  return <ProductDetail key={id} />;
}

function App() {
  return (
    <Routes>
      {/* Auth sahifalari UserLayout'dan tashqarida (header/footer'siz) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductRoute />} />
        <Route path="/catalog/:categorySlug" element={<Catalog />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addresses" element={<Addresses />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
