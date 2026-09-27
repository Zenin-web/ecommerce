import { useParams } from "react-router-dom";
import { useGetCategoryByIdQuery } from "@/store/api/categoryApi/categoryApi";
import { useGetProductsByCategoryQuery } from "@/store/api/productApi/productApi";
import { ProductCard } from "@/components/shared/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";

export default function CategoryPage() {
  const { categoryId } = useParams();

  // 1. First, fetch the category to verify it exists
  const {
    data: category,
    isLoading: categoryLoading,
    isError: categoryError
  } = useGetCategoryByIdQuery(categoryId);

  // 2. Only fetch products if we have a valid categoryId
  // useGetProductsByCategoryQuery will only execute if categoryId is truthy
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError
  } = useGetProductsByCategoryQuery(categoryId, {
    skip: !categoryId,
  });

  if (categoryLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Handle "Category Not Found" explicitly
  if (categoryError || !category) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-4">
        <EmptyState
          title="Kategoriya topilmadi"
          description="Siz qidirayotgan kategoriya mavjud emas yoki o'chirilgan."
        />
      </div>
    );
  }

  if (productsLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-4">
        <EmptyState
          title="Mahsulotlarni yuklashda xatolik"
          description="Iltimos, internet aloqasini tekshiring va qayta urinib ko'ring."
        />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-4">
        <EmptyState
          title="Mahsulotlar topilmadi"
          description={`Hozircha ${category.name} kategoriyada mahsulotlar mavjud emas.`}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <p className="text-sm text-muted-foreground">
          {products.length} ta mahsulot topildi
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
