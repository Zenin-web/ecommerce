import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ImageOff, Trash2, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuantityInput } from "@/components/shared/QuantityInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPrice, getDiscountedPrice, getImageUrl } from "@/lib/utils";
import {
  useGetMyCartQuery,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} from "@/store/api/cartApi/cartApi";
import { useAuth } from "@/hooks/useAuth";

export default function Cart() {
  const { isAuthenticated } = useAuth();

  const {
    data: cartResponse,
    isLoading,
    isError,
  } = useGetMyCartQuery(undefined, { skip: !isAuthenticated });

  const [updateItem] = useUpdateItemMutation();
  const [removeItem] = useRemoveItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Savatchani ko'rish uchun tizimga kiring"
        description="Savatchangiz shaxsiy hisobingizga bog'liq"
        actionLabel="Kirish"
        actionLink="/login"
      />
    );
  }

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">Savatcha yuklanmoqda...</p>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Ma'lumotlarni yuklashda xatolik yuz berdi
      </p>
    );
  }

  const cart = cartResponse?.data;
  // Backend cart javobida items massivi `items` yoki `products` nomida
  // bo'lishi mumkin — ikkalasini ham qo'llab-quvvatlaymiz.
  const items = (cart?.items || cart?.products || [])
    .map((entry) => ({
      product: entry.product || entry,
      quantity: entry.quantity ?? 1,
    }))
    .filter((entry) => entry.product);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateItem({ productId, quantity }).unwrap();
    } catch {
      toast.error("Miqdorni yangilab bo'lmadi");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId).unwrap();
    } catch {
      toast.error("Mahsulotni savatchadan o'chirib bo'lmadi");
    }
  };

  const handleClear = async () => {
    try {
      await clearCart().unwrap();
    } catch {
      toast.error("Savatchani tozalab bo'lmadi");
    }
  };

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

  const computedSubtotal = items.reduce(
    (sum, i) => sum + getDiscountedPrice(i.product.price, i.product.discount) * i.quantity,
    0,
  );
  // Agar backend cart javobida tayyor jami summa bo'lsa, o'shani ustuvor qilamiz.
  const subtotal = cart?.totalPrice ?? cart?.total ?? computedSubtotal;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Savatcha ({items.length})</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={handleClear}
          disabled={isClearing}
        >
          <Trash2 className="size-4" />
          Savatchani tozalash
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          {items.map(({ product, quantity }) => (
            <Card key={product._id} className="flex-row items-center gap-4 p-3">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {product.images?.[0] ? (
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageOff className="size-6 text-muted-foreground/30" />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <Link to={`/product/${product._id}`} className="text-sm font-medium hover:text-primary">
                  {product.title}
                </Link>
                <p className="text-sm font-semibold">
                  {formatPrice(getDiscountedPrice(product.price, product.discount))}
                </p>
              </div>

              <QuantityInput
                value={quantity}
                onChange={(v) => updateQuantity(product._id, v)}
              />

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleRemove(product._id)}
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
              <span>{formatPrice(computedSubtotal)}</span>
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
