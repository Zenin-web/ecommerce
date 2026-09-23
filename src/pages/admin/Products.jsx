import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
Plus,
Search,
Pencil,
Trash2,
ImageOff,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
useGetAllAdminProductsQuery,
useDeleteProductMutation,
} from "@/store/api/productApi/productApi";

import { useGetAllCategoriesQuery } from "@/store/api/categoryApi/categoryApi";
import { getApiErrorMessage } from "@/lib/auth";
import { formatPrice, getImageUrl } from "@/lib/utils";

export default function AdminProducts() {
const [search, setSearch] = useState("");

const {
data: productsResponse,
isLoading,
isError,
} = useGetAllAdminProductsQuery();

const { data: categoriesResponse } = useGetAllCategoriesQuery();

const [deleteProduct, { isLoading: isDeleting }] =
useDeleteProductMutation();

const products = useMemo(() => {
if (Array.isArray(productsResponse)) {
return productsResponse;
}

return (
  productsResponse?.data?.products ||
  productsResponse?.data ||
  productsResponse?.products ||
  []
);

}, [productsResponse]);

const categories = useMemo(() => {
if (Array.isArray(categoriesResponse)) {
return categoriesResponse;
}

return (
  categoriesResponse?.data?.categories ||
  categoriesResponse?.data ||
  categoriesResponse?.categories ||
  []
);

}, [categoriesResponse]);

const filteredProducts = useMemo(() => {
const value = search.trim().toLowerCase();

if (!value) return products;

return products.filter((product) => {
  const title = product.title?.toLowerCase() || "";
  const brand = product.brand?.toLowerCase() || "";
  const slug = product.slug?.toLowerCase() || "";

  return (
    title.includes(value) ||
    brand.includes(value) ||
    slug.includes(value)
  );
});

}, [products, search]);

const getCategoryName = (categoryId) => {
const category = categories.find(
(item) => item._id === categoryId || item.id === categoryId
);

return category?.name || "-";

};

const handleDelete = async (id, title) => {
const confirmed = window.confirm( 
`${title} mahsulotini o'chirishni xohlaysizmi?`
);

if (!confirmed) return;

try {
await deleteProduct(id).unwrap();
} catch (error) {
console.error("Mahsulotni o'chirishda xato:", error);

alert(getApiErrorMessage(error, "Mahsulotni o'chirishda xatolik yuz berdi."));

}
};

if (isLoading) {
return (
<div className="flex items-center justify-center py-20 text-muted-foreground">
Mahsulotlar yuklanmoqda...
</div>
);
}

if (isError) {
return (
<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
<p className="font-medium text-destructive">
Mahsulotlarni yuklashda xatolik yuz berdi.
</p>

    <p className="mt-1 text-sm text-muted-foreground">
      Backend ishlayotganini tekshirib ko'ring.
    </p>
  </div>
);

}

return (
<div className="flex flex-col gap-4">
<div className="flex flex-wrap items-center justify-between gap-3">
<div className="relative w-full max-w-xs">
<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Mahsulot qidirish..."
        className="pl-9"
      />
    </div>

    <Button asChild>
      <Link to="/products/new">
        <Plus className="size-4" />
        Yangi mahsulot
      </Link>
    </Button>
  </div>

  <Card className="overflow-x-auto p-0">
    <table className="w-full text-sm">
      <thead className="border-b bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
        <tr>
          <th className="px-4 py-3 font-medium">Mahsulot</th>
          <th className="px-4 py-3 font-medium">Kategoriya</th>
          <th className="px-4 py-3 font-medium">Narx</th>
          <th className="px-4 py-3 font-medium">Ombor</th>
          <th className="px-4 py-3 font-medium">Holat</th>
          <th className="px-4 py-3 font-medium text-right">
            Amallar
          </th>
        </tr>
      </thead>

      <tbody>
        {filteredProducts.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="px-4 py-12 text-center text-muted-foreground"
            >
              {search
                ? "Qidiruv bo'yicha mahsulot topilmadi."
                : "Hozircha mahsulotlar mavjud emas."}
            </td>
          </tr>
        ) : (
          filteredProducts.map((product) => (
            <tr
              key={product._id}
              className="border-b last:border-0 hover:bg-secondary/30"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {product.images?.[0] ? (
                      <img
                        src={getImageUrl(product.images[0])}
                        alt={product.title}
                        className="size-full object-cover"
                      />
                    ) : (
                      <ImageOff className="size-4 text-muted-foreground/40" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <span className="line-clamp-1 font-medium">
                      {product.title}
                    </span>

                    {product.brand && (
                      <span className="text-xs text-muted-foreground">
                        {product.brand}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {getCategoryName(
                  typeof product.category === "object"
                    ? product.category?._id
                    : product.category
                )}
              </td>

              <td className="px-4 py-3 font-medium">
                {formatPrice(product.price)}
              </td>

              <td className="px-4 py-3">
                {product.stock ?? 0}
              </td>

              <td className="px-4 py-3">
                <Badge
                  variant={
                    product.isActive && product.stock > 0
                      ? "success"
                      : "destructive"
                  }
                >
                  {product.isActive && product.stock > 0
                    ? "Faol"
                    : "Tugagan"}
                </Badge>
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    asChild
                  >
                    <Link to={`/products/${product._id}`}>
                      <Pencil className="size-3.5" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    disabled={isDeleting}
                    onClick={() =>
                      handleDelete(product._id, product.title)
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </Card>
</div>

);
}