import { Heart } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { mockProducts } from "@/data/mockData";

export default function Favorites() {
  const favorites = mockProducts.slice(0, 4);

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
      <h1 className="mb-6 text-xl font-semibold">Sevimlilar ({favorites.length})</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {favorites.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
