import { Heart } from "lucide-react";

import { ProductCard } from "@/components/shared/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";

import { useGetMyFavoritesQuery } from "@/store/api/favoriteApi/favoriteApi";
import { useAuth } from "@/hooks/useAuth";

export default function Favorites() {
  const { isAuthenticated } = useAuth();

  const {
    data: favoritesResponse,
    isLoading,
    isError,
  } = useGetMyFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon={Heart}
        title="Sevimlilarni ko'rish uchun tizimga kiring"
        description="Sevimli mahsulotlaringiz shaxsiy hisobingizga bog'liq"
        actionLabel="Kirish"
        actionLink="/login"
      />
    );
  }

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Sevimlilar yuklanmoqda...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Ma'lumotlarni yuklashda xatolik yuz berdi
      </p>
    );
  }

  const favorites = Array.isArray(favoritesResponse?.data?.products)
    ? favoritesResponse.data.products
    : [];

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Sevimlilar bo'sh"
        description="Yoqtirgan mahsulotlaringizni shu yerga qo'shing"
        actionLabel="Katalogga o'tish"
        actionLink="/catalog"
      />
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">
        Sevimlilar ({favorites.length})
      </h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {favorites.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}