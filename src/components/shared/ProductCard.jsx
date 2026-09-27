import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Heart, ShoppingCart, ImageOff } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { StarRating } from "./StarRating";

import {
  cn,
  formatPrice,
  getDiscountedPrice,
  getImageUrl,
} from "@/lib/utils";

import {
  useGetMyFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/store/api/favoriteApi/favoriteApi";

import { useAddItemMutation } from "@/store/api/cartApi/cartApi";

import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export function ProductCard({ product, className }) {
  const finalPrice = getDiscountedPrice(
    product.price,
    product.discount
  );

  const { isAuthenticated } = useAuth();
  const requireAuth = useRequireAuth();

  const { data: favoritesResponse } = useGetMyFavoritesQuery(
    undefined,
    {
      skip: !isAuthenticated,
    }
  );

  const favorites = Array.isArray(
    favoritesResponse?.data?.products
  )
    ? favoritesResponse.data.products
    : [];

  const isFavorite = favorites.some(
    (item) => item?._id === product._id
  );

  const [toggleFavorite, { isLoading: isTogglingFavorite }] =
    useToggleFavoriteMutation();

  const [addItem, { isLoading: isAddingToCart }] =
    useAddItemMutation();

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    requireAuth(async () => {
      try {
        await toggleFavorite({
          product: product._id,
        }).unwrap();

        toast.success(
          isFavorite
            ? "Sevimlilardan olib tashlandi"
            : "Sevimlilarga qo'shildi"
        );
      } catch {
        toast.error("Sevimlilarni yangilab bo'lmadi");
      }
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    requireAuth(async () => {
      try {
        await addItem({
          product: product._id,
          quantity: 1,
        }).unwrap();

        toast.success("Mahsulot savatchaga qo'shildi");
      } catch {
        toast.error(
          "Mahsulotni savatchaga qo'shib bo'lmadi"
        );
      }
    });
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden py-0 gap-0",
        className
      )}
    >
      {product.discount > 0 && (
        <Badge
          variant="destructive"
          className="absolute top-2 left-2 z-10"
        >
          -{product.discount}%
        </Badge>
      )}

      <button
        type="button"
        onClick={handleToggleFavorite}
        disabled={isTogglingFavorite}
        className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
        title="Sevimlilarga qo'shish"
      >
        <Heart
          className={cn(
            "size-4",
            isFavorite &&
              "fill-destructive text-destructive"
          )}
        />
      </button>

      <Link
        to={`/product/${product._id}`}
        className="block"
      >
        <div className="flex aspect-square items-center justify-center bg-muted">
          {product.images?.[0] ? (
            <img
              src={getImageUrl(product.images[0])}
              alt={product.title}
              className="size-full object-cover"
            />
          ) : (
            <ImageOff className="size-10 text-muted-foreground/40" />
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-3">
        <Link to={`/product/${product._id}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium hover:text-primary">
            {product.title}
          </h3>
        </Link>

        <StarRating
          rating={product.rating || 0}
          count={product.numReviews}
        />

        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold">
            {formatPrice(finalPrice)}
          </span>

          {product.discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <Button
          size="sm"
          className="mt-1 w-full"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          <ShoppingCart className="size-4" />
          Savatchaga
        </Button>
      </div>
    </Card>
  );
}