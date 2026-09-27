import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

function FiltersPanel({ categories, selectedSlug, onSelectCategory }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Kategoriya</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="size-3.5 accent-primary"
              checked={!selectedSlug}
              onChange={() => onSelectCategory("")}
            />
            Barchasi
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="size-3.5 accent-primary"
                checked={selectedSlug === cat.slug}
                onChange={() => onSelectCategory(selectedSlug === cat.slug ? "" : cat.slug)}
              />
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
    </div>
  );
}

export default function Catalog() {
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("new");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSlug = searchParams.get("category") || "";

  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
  } = useGetAllCategoriesQuery();
  const categories = categoriesResponse?.data || [];

  const {
    data: productsResponse,
    isLoading: loadingProducts,
    isError: isProductsError,
  } = useGetAllProductsQuery();

  const onSelectCategory = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (!slug) {
      next.delete("category");
    } else {
      next.set("category", slug);
    }
    setSearchParams(next);
  };

  const visibleProducts = useMemo(() => {
    const products = productsResponse?.data || [];

    let list = selectedSlug
      ? products.filter((product) => {
          const categorySlug =
            typeof product.category === "object" ? product.category?.slug : undefined;
          return categorySlug === selectedSlug || product.category === selectedSlug;
        })
      : products;

    switch (sort) {
      case "cheap":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "expensive":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "new":
      default:
        list = [...list].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        break;
    }

    return list;
  }, [productsResponse, selectedSlug, sort]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Katalog</h1>
          <p className="text-sm text-muted-foreground">
            {loadingProducts ? "Yuklanmoqda..." : `${visibleProducts.length} ta mahsulot topildi`}
          </p>
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

          <Select value={sort} onValueChange={setSort}>
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
          {loadingCategories ? (
            <p className="text-sm text-muted-foreground">Kategoriyalar yuklanmoqda...</p>
          ) : (
            <FiltersPanel
              categories={categories}
              selectedSlug={selectedSlug}
              onSelectCategory={onSelectCategory}
            />
          )}
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
              <FiltersPanel
                categories={categories}
                selectedSlug={selectedSlug}
                onSelectCategory={(slug) => {
                  onSelectCategory(slug);
                  setShowFilters(false);
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {loadingProducts ? (
            <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
              Mahsulotlar yuklanmoqda...
            </p>
          ) : isProductsError ? (
            <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
              Ma'lumotlarni yuklashda xatolik yuz berdi
            </p>
          ) : visibleProducts.length === 0 ? (
            <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
              Mahsulotlar topilmadi
            </p>
          ) : (
            visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
