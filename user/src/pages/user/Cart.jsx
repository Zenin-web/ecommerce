import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetMyCartQuery, useUpdateItemMutation, useRemoveItemMutation, useClearCartMutation } from "@/store/api/cartApi/cartApi";
import { toast } from "react-hot-toast";

export default function Cart() {
  const {
    data: cartResponse,
    isLoading: loading,
    isError
  } = useGetMyCartQuery();

  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveItemMutation();
  const [clearCart] = useClearCartMutation();

  const cart = cartResponse?.data || [];

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateItem({ productId, quantity: newQuantity }).unwrap();
      toast.success("Miqdor yangilandi");
    } catch (error) {
      toast.error("Yangilashda xatolik yuz berdi");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeItem(productId).unwrap();
      toast.success("Savatchadan olib tashlandi");
    } catch (error) {
      toast.error("Olib tashlashda xatolik yuz berdi");
    }
  };

  const handleClearCart = async () => {
    if (confirm("Savatchani butunlay tozalashni xohlaysizmi?")) {
      try {
        await clearCart().unwrap();
        toast.success("Savatcha tozalandi");
      } catch (error) {
        toast.error("Tozalashda xatolik yuz berdi");
      }
    }
  };

  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-medium text-destructive">Savatchani yuklashda xatolik yuz berdi</p>
        <Button onClick={() => window.location.reload()}>Qayta urinish</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Savatcha yuklanmoqda...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="rounded-full bg-secondary p-6">
          <ShoppingCart className="size-16 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Savatchangiz hozircha bo‘sh</h2>
          <p className="text-muted-foreground">Sizga yoqadigan mahsulotlarni toping va xaridni boshlang</p>
        </div>
        <Button asChild size="lg">
          <Link to="/catalog">Xarid qilishni boshlash</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Savatcha</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Product List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{cart.length} ta mahsulot</p>
            <Button variant="ghost" size="sm" onClick={handleClearCart} className="text-destructive hover:text-destructive">
              Barchasini o'chirish
            </Button>
          </div>

          {cart.map((item) => (
            <Card key={item._id} className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
              <Link to={`/product/${item.productId}`} className="relative shrink-0 overflow-hidden rounded-lg bg-secondary">
                <img
                  src={item.image || "/placeholder-product.jpg"}
                  alt={item.title}
                  className="size-24 object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-1">
                <Link to={`/product/${item.productId}`} className="font-medium hover:text-primary">
                  {item.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.variant || "Standart"}
                </p>
                <p className="font-bold text-primary">{item.price.toLocaleString()} so'm</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border bg-background p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    disabled={isUpdating}
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveItem(item._id)}
                  disabled={isRemoving}
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6">
            <h3 className="mb-4 text-lg font-semibold">Buyurtma xulosasi</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mahsulotlar:</span>
                <span>{calculateTotal().toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Yetkazib berish:</span>
                <span>Bepul</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Jami:</span>
                <span className="text-primary">{calculateTotal().toLocaleString()} so'm</span>
              </div>
            </div>
            <Button asChild className="mt-6 w-full size-lg" size="lg">
              <Link to="/checkout">
                Rasmiylashtirish
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
