import { useState } from "react";
import { Link } from "react-router-dom";
import { ImageOff, Trash2, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuantityInput } from "@/components/shared/QuantityInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { mockProducts } from "@/data/mockData";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";

export default function Cart() {
  const [items, setItems] = useState(
    mockProducts.slice(0, 3).map((p) => ({ product: p, quantity: 1 })),
  );

  const updateQuantity = (id, qty) => {
    setItems((prev) => prev.map((i) => (i.product._id === id ? { ...i, quantity: qty } : i)));
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.product._id !== id));
  };

  const subtotal = items.reduce(
    (sum, i) => sum + getDiscountedPrice(i.product.price, i.product.discount) * i.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Savatchangiz bo'sh"
        description="Xarid qilishni boshlash uchun katalogga o'ting"
        actionLabel="Katalogga o'tish"
        actionLink="/catalog"
      />
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Savatcha ({items.length})</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          {items.map(({ product, quantity }) => (
            <Card key={product._id} className="flex-row items-center gap-4 p-3">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                <ImageOff className="size-6 text-muted-foreground/30" />
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <Link to={`/product/${product._id}`} className="text-sm font-medium hover:text-primary">
                  {product.title}
                </Link>
                <p className="text-sm font-semibold">
                  {formatPrice(getDiscountedPrice(product.price, product.discount))}
                </p>
              </div>

              <QuantityInput value={quantity} onChange={(v) => updateQuantity(product._id, v)} />

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(product._id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </Card>
          ))}
        </div>

        <Card className="h-fit p-4">
          <h3 className="mb-3 font-semibold">Buyurtma xulosasi</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mahsulotlar narxi</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Yetkazib berish</span>
              <span className="text-success">Bepul</span>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between font-semibold">
            <span>Jami</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <Button asChild size="lg" className="mt-4 w-full">
            <Link to="/checkout">Buyurtma berish</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
