import { useState } from "react";
import { useGetMyAddressesQuery } from "@/store/api/addressApi/addressApi";
import { useCreateOrderMutation } from "@/store/api/orderApi/orderApi";
import { useGetMyCartQuery } from "@/store/api/cartApi/cartApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin, CreditCard } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { data: cart } = useGetMyCartQuery();
  const { data: addresses, isLoading: addressesLoading } = useGetMyAddressesQuery();
  const [createOrder] = useCreateOrderMutation();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleOrderSubmit = async () => {
    if (!selectedAddressId) {
      toast.error("Iltimos, yetkazib berish manzilini tanlang");
      return;
    }

    try {
      const order = await createOrder({
        addressId: selectedAddressId,
        paymentMethod,
      }).unwrap();
      toast.success("Buyurtma muvaffaqiyatli yaratildi!");
      navigate(`/account/orders/${order._id}`);
    } catch {
      toast.error("Buyurtma yaratishda xatolik yuz berdi");
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return <div className="flex h-[60vh] items-center justify-center">Savatcha bo'sh</div>;
  }

  const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal + (cart.deliveryFee || 0) - (cart.discountAmount || 0);

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold">Buyurtmani rasmiylashtirish</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px]">
        <div className="flex flex-col gap-6">
          {/* Delivery Address */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">Yetkazib berish manzili</h3>
            </div>

            {addressesLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-12 w-full rounded-lg bg-muted" />)}
              </div>
            ) : (
              <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="flex flex-col gap-3">
                {addresses?.map((addr) => (
                  <Label
                    key={addr._id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-accent"
                  >
                    <RadioGroupItem value={addr._id} />
                    <div className="flex flex-col">
                      <span className="font-medium">{addr.city}, {addr.street}</span>
                      <span className="text-sm text-muted-foreground">{addr.apartment} - {addr.house}</span>
                    </div>
                  </Label>
                ))}
                {addresses?.length === 0 && (
                  <p className="text-sm text-muted-foreground">Saqlangan manzillar yo'q.</p>
                )}
              </RadioGroup>
            )}
            <Button variant="outline" className="mt-4 w-full sm:w-auto">Yangi manzil qo'shish</Button>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">To'lov usuli</h3>
            </div>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col gap-3">
              <Label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-accent">
                <RadioGroupItem value="cash" />
                <span className="text-sm">Naqd to'lov</span>
              </Label>
              <Label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-accent">
                <RadioGroupItem value="card" />
                <span className="text-sm">Plastik karta (Click, Payme)</span>
              </Label>
            </RadioGroup>
          </Card>
        </div>

        {/* Order Summary */}
        <aside className="sticky top-24 h-fit">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Buyurtma xulosasi</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mahsulotlar</span>
                <span>{subtotal.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Yetkazish</span>
                <span>{cart.deliveryFee?.toLocaleString() || "0"} so'm</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Jami</span>
                <span className="text-primary">{total.toLocaleString()} so'm</span>
              </div>
            </div>
            <Button
              className="mt-6 w-full py-6 text-lg"
              size="lg"
              onClick={handleOrderSubmit}
            >
              Tasdiqlash
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
