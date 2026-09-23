import { Link } from "react-router-dom";
import { Heart, ShoppingCart, ImageOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { cn, formatPrice, getDiscountedPrice } from "@/lib/utils";

export function ProductCard({ product, className }) {
  const finalPrice = getDiscountedPrice(product.price, product.discount);

  return (
    <Card className={cn("group relative overflow-hidden py-0 gap-0", className)}>
      {product.discount > 0 && (
        <Badge variant="destructive" className="absolute top-2 left-2 z-10">
          -{product.discount}%
        </Badge>
      )}

      <button
        type="button"
        className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
        title="Sevimlilarga qo'shish (UI only)"
      >
        <Heart className="size-4" />
      </button>

      <Link to={`/product/${product._id}`} className="block">
        <div className="flex aspect-square items-center justify-center bg-muted">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} className="size-full object-cover" />
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

        <StarRating rating={product.rating || 0} count={product.numReviews} />

        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold">{formatPrice(finalPrice)}</span>
          {product.discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <Button size="sm" className="mt-1 w-full">
          <ShoppingCart className="size-4" />
          Savatchaga
        </Button>
      </div>
    </Card>
  );
}
