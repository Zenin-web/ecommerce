import { Navigate, Route, Routes } from "react-router-dom";
import { UserLayout } from "@/components/layout/UserLayout";
import Home from "@/pages/user/Home";
import Catalog from "@/pages/user/Catalog";
import Cart from "@/pages/user/Cart";
import Checkout from "@/pages/user/Checkout";
import {
  AccountLayout,
  ProfilePage,
  OrdersPage,
  OrderDetailPage,
  AddressesPage,
  SecurityPage,
} from "@/pages/user/account";

function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:categorySlug" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/favorites" element={<div>Sevimlilar sahifasi (Hali tayyor emas)</div>} />

        <Route path="/account" element={<AccountLayout><ProfilePage /></AccountLayout>} />
        <Route path="/account/orders" element={<AccountLayout><OrdersPage /></AccountLayout>} />
        <Route path="/account/orders/:id" element={<AccountLayout><OrderDetailPage /></AccountLayout>} />
        <Route path="/account/addresses" element={<AccountLayout><AddressesPage /></AccountLayout>} />
        <Route path="/account/security" element={<AccountLayout><SecurityPage /></AccountLayout>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;