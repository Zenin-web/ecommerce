import { useMemo } from "react";
import {
  useGetMyCartQuery,
  useUpdateItemMutation,
  useRemoveItemMutation,
} from "@/store/api/cartApi/cartApi";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Cart() {
  const {
    data: cart,
    isLoading,
    isError,
    refetch,
  } = useGetMyCartQuery();

  const [updateItem] = useUpdateItemMutation();
  const [removeItem] = useRemoveItemMutation();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateItem({ productId, quantity: newQuantity }).unwrap();
      toast.success("Miqdor yangilandi");
    } catch {
      toast.error("Yangilashda xatolik yuz berdi");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId).unwrap();
      toast.success("Mahsulot olib tashlandi");
    } catch {
      toast.error("Olib tashlashda xatolik");
    }
  };

  const totals = useMemo(() => {
    if (!cart?.items) return { subtotal: 0, total: 0, count: 0 };

    const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    // Assuming backend returns delivery and discount in the cart object
    const delivery = cart.deliveryFee || 0;
    const discount = cart.discountAmount || 0;

    return {
      subtotal,
      total: subtotal + delivery - discount,
      count: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    };
  }, [cart]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[70vh] items-center justify-center p-4">
        <EmptyState
          title="Xatolik yuz berdi"
          description="Savatchani yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
          action={<Button onClick={() => refetch()}>Qayta urinish</Button>}
        />
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center p-4">
        <EmptyState
          title="Savatchangiz bo'sh"
          description="Hali hech bir mahsulot qo'shmadingiz."
          action={<Link to="/catalog"><Button>Xarid qilishni boshlash</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold">Savatcha</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px]">
        {/* Items List */}
        <div className="flex flex-col gap-4">
          {cart.items.map((item) => (
            <Card key={item.productId} className="flex items-center gap-4 p-4 sm:p-6">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
                <img
                  src={item.product.images?.[0] || "/placeholder-product.jpg"}
                  alt={item.product.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <Link to={`/product/${item.productId}`} className="font-medium hover:text-primary transition-colors">
                  {item.product.title}
                </Link>
                <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                <p className="text-lg font-bold">{item.product.price.toLocaleString()} so'm</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-lg border p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemove(item.productId)}
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="sticky top-24 h-fit">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Buyurtma xulosasi</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mahsulotlar ({totals.count})</span>
                <span>{totals.subtotal.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Yetkazish</span>
                <span>{cart.deliveryFee?.toLocaleString() || "0"} so'm</span>
              </div>
              <div className="flex justify-between text-sm text-destructive">
                <span className="text-muted-foreground">Chegirma</span>
                <span>-{cart.discountAmount?.toLocaleString() || 0} so'm</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Jami</span>
                <span className="text-primary">{totals.total.toLocaleString()} so'm</span>
              </div>
            </div>
            <Link to="/checkout" className="mt-6 block w-full">
              <Button className="w-full py-6 text-lg" size="lg">
                Rasmiylashtirish
              </Button>
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
