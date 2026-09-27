import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";

/**
 * Login talab qiladigan amallar (favorite, cart, order) uchun.
 * Foydalanuvchi tizimga kirmagan bo'lsa: toast ko'rsatadi va
 * /login sahifasiga o'tkazadi. Aks holda berilgan funksiyani ishga tushiradi.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return function requireAuth(action) {
    if (!isAuthenticated) {
      toast.error("Davom etish uchun tizimga kiring");
      navigate("/login");
      return;
    }

    action();
  };
}
