import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ProductCard } from "@/components/shared/ProductCard";
import { useGetAllCategoriesQuery } from "@/store/api/categoryApi/categoryApi";
import { useGetAllProductsQuery } from "@/store/api/productApi/productApi";

function FiltersPanel({ categories }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Kategoriya</h3>
        <div className="flex flex-col gap-2">
          {categories?.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-3.5 accent-primary" />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold">Narx oralig'i</h3>
        <div className="flex items-center gap-2">
          <Input placeholder="Dan" type="number" />
          <span className="text-muted-foreground">—</span>
          <Input placeholder="Gacha" type="number" />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold">Brend</h3>
        <div className="flex flex-col gap-2">
          {["Apple", "Samsung", "Xiaomi", "Nike", "JBL"].map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-3.5 accent-primary" />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <Button className="w-full">Filtrlash</Button>
    </div>
  );
}

export default function Catalog() {
  const { categorySlug } = useParams();
  const [showFilters, setShowFilters] = useState(false);

  // 1. Fetch categories to resolve slug/id to category object
  const {
    data: categoriesData,
    isLoading: loadingCats
  } = useGetAllCategoriesQuery();

  const categories = categoriesData?.data || [];

  // Resolve category: look for slug match, then ID match
  const currentCategory = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find(cat => cat.slug === categorySlug || cat._id === categorySlug);
  }, [categories, categorySlug]);

  // 2. Fetch products ONLY after category is resolved (if categorySlug is present)
  // If categorySlug is missing, we fetch all products.
  const {
    data: productsData,
    isLoading: loadingProducts,
    isError
  } = useGetAllProductsQuery(
    currentCategory ? currentCategory._id : (categorySlug ? null : undefined),
    { skip: categorySlug && !currentCategory }
  );

  const products = productsData?.data || [];

  // 3. Backend Validation Layer:
  // Check if the backend actually filtered the results.
  // If we requested a specific category, but returned products have different category IDs,
  // the backend is ignoring the filter.
  const isFilteringBroken = useMemo(() => {
    if (!categorySlug || !currentCategory || products.length === 0) return false;
    // Check if any product belongs to a DIFFERENT category
    return products.some(p => p.category !== currentCategory._id);
  }, [products, currentCategory, categorySlug]);

  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-medium text-destructive">Ma'lumotlarni yuklashda xatolik yuz berdi</p>
        <Button onClick={() => window.location.reload()}>Qayta urinib ko'rish</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {currentCategory ? currentCategory.name : "Barcha mahsulotlar"}
          </h1>
          {!loadingProducts && (
            <p className="text-sm text-muted-foreground">{products.length} ta mahsulot topildi</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal className="size-4" />
            Filtrlar
          </Button>

          <Select defaultValue="new">
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Yangi kelganlar</SelectItem>
              <SelectItem value="cheap">Arzon narx bo'yicha</SelectItem>
              <SelectItem value="expensive">Qimmat narx bo'yicha</SelectItem>
              <SelectItem value="rating">Reyting bo'yicha</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <Card className="hidden h-fit p-4 lg:block">
          <FiltersPanel categories={categories} />
        </Card>

        {showFilters && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="relative ml-auto flex h-full w-72 flex-col overflow-y-auto bg-background p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Filtrlar</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="size-5" />
                </button>
              </div>
              <FiltersPanel categories={categories} />
            </div>
          </div>
        )}

        {loadingProducts || loadingCats ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-secondary" />
            ))}
          </div>
        ) : categorySlug && !currentCategory ? (
          <div className="flex h-[40vh] flex-col items-center justify-center gap-2 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Kategoriya topilmadi
            </p>
          </div>
        ) : isFilteringBroken ? (
          <div className="flex h-[40vh] flex-col items-center justify-center gap-2 text-center">
            <p className="text-lg font-medium text-destructive">
              Kategoriya filtrlash tizimi backendda faol emas
            </p>
            <p className="text-sm text-muted-foreground">
              Iltimos, qidiruv panelidan foydalaning.
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex h-[40vh] flex-col items-center justify-center gap-2 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Bu kategoriyada mahsulotlar yo‘q
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
