import { Navigate, Route, Routes } from "react-router-dom";
import { UserLayout } from "@/components/layout/UserLayout";
import Home from "@/pages/user/Home";
import Catalog from "@/pages/user/Catalog";
import CategoryPage from "@/pages/user/CategoryPage";
import Cart from "@/pages/user/Cart";
import Checkout from "@/pages/user/Checkout";
import Profile from "@/pages/user/Profile";
import Orders from "@/pages/user/Orders";
import OrderDetail from "@/pages/user/OrderDetail";

function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/account/orders" element={<Orders />} />
        <Route path="/account/orders/:id" element={<OrderDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;