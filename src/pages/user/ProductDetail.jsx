import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Heart, ImageOff, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductReviews } from "@/components/shared/ProductReviews";
import { StarRating } from "@/components/shared/StarRating";
import { ProductCard } from "@/components/shared/ProductCard";
import { QuantityInput } from "@/components/shared/QuantityInput";
import { cn, formatPrice, getDiscountedPrice, getImageUrl } from "@/lib/utils";
import { useGetAllProductsQuery, useGetSingleProductQuery } from "@/store/api/productApi/productApi";
import { useGetMyFavoritesQuery, useToggleFavoriteMutation } from "@/store/api/favoriteApi/favoriteApi";
import { useAddItemMutation } from "@/store/api/cartApi/cartApi";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { isAuthenticated } = useAuth();
  const requireAuth = useRequireAuth();

  const {
    data: productResponse,
    isLoading,
    isError,
  } = useGetSingleProductQuery(id, { skip: !id });
  const { data: productsResponse } = useGetAllProductsQuery();

  const { data: favoritesResponse } = useGetMyFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleFavorite, { isLoading: isTogglingFavorite }] = useToggleFavoriteMutation();
  const [addItem, { isLoading: isAddingToCart }] = useAddItemMutation();

  const product = productResponse?.data;
  const products = productsResponse?.data || [];
  const favorites = (favoritesResponse?.data?.products || []).filter(Boolean);

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">Mahsulot yuklanmoqda...</p>
    );
  }

  if (isError || !product) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">Mahsulot topilmadi</p>
    );
  }

  const isFavorite = favorites.some(
    (item) => (item.product?._id || item._id) === product._id,
  );

  const handleToggleFavorite = () => {
    requireAuth(async () => {
      try {
        await toggleFavorite({ product: product._id }).unwrap();
      } catch {
        toast.error("Sevimlilarni yangilab bo'lmadi");
      }
    });
  };

  const handleAddToCart = () => {
    if (!product.isActive || quantity > product.stock) { toast.error("Mahsulotning bu miqdori mavjud emas"); return; }
    requireAuth(async () => {
      try {
        await addItem({ product: product._id, quantity }).unwrap();
        toast.success("Mahsulot savatchaga qo'shildi");
      } catch {
        toast.error("Mahsulotni savatchaga qo'shib bo'lmadi");
      }
    });
  };

  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const images = product.images?.length ? product.images : [];
  const related = products.filter((p) => p._id !== product._id).slice(0, 4);
  const attributes = Array.isArray(product.attributes) ? product.attributes : [];
  const categoryName =
    typeof product.category === "object" ? product.category?.name : product.category;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-muted">
            {images[activeImage] ? (
              <img
                src={getImageUrl(images[activeImage])}
                alt={product.title}
                className="size-full object-cover"
              />
            ) : (
              <ImageOff className="size-16 text-muted-foreground/30" />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((image, i) => (
                <button
                  key={image + i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "flex size-16 items-center justify-center overflow-hidden rounded-lg border bg-muted",
                    activeImage === i && "border-primary ring-1 ring-primary",
                  )}
                >
                  <img src={getImageUrl(image)} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
            <h1 className="mt-2 text-2xl font-semibold">{product.title}</h1>
            <div className="mt-2">
              <StarRating rating={product.rating || 0} count={product.numReviews} />
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(finalPrice)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge variant="destructive">-{product.discount}%</Badge>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {product.stock > 0 ? (
              <span className="text-success font-medium">✓ Omborda mavjud ({product.stock} dona)</span>
            ) : (
              <span className="text-destructive font-medium">Omborda yo'q</span>
            )}
          </p>

          <Separator />

          <div className="flex items-center gap-3">
            <QuantityInput value={quantity} onChange={setQuantity} max={product.stock} />
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAddingToCart || !product.isActive || product.stock <= 0}
            >
              <ShoppingCart className="size-4" />
              Savatchaga qo'shish
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
            >
              <Heart className={cn("size-4", isFavorite && "fill-destructive text-destructive")} />
            </Button>
          </div>

          <div className="mt-2 flex flex-col gap-3 rounded-lg border p-4 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-primary" />
              Toshkent bo'ylab 1-2 kunda yetkazib berish
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Original mahsulot, rasmiy kafolat bilan
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: description / attributes / reviews */}
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Tavsif</TabsTrigger>
          <TabsTrigger value="attributes">Xususiyatlar</TabsTrigger>
          <TabsTrigger value="reviews">Sharhlar ({product.numReviews || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="pt-4 text-sm leading-relaxed text-muted-foreground">
          {product.description || "Tavsif mavjud emas"}
        </TabsContent>

        <TabsContent value="attributes" className="pt-4">
          <div className="grid max-w-md grid-cols-1 gap-2 text-sm">
            {[
              ["Brend", product.brand],
              ["Kategoriya", categoryName],
              ...attributes.map((attr) => [attr.name || attr.key || attr.label, attr.value]),
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="flex flex-col gap-4 pt-4">
          <ProductReviews productId={id} />
        </TabsContent>
      </Tabs>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">O'xshash mahsulotlar</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
