import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, MapPin, CreditCard, CheckCircle2, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCreateOrderMutation } from "@/store/api/orderApi/orderApi";
import { useGetMyCartQuery } from "@/store/api/cartApi/cartApi";
import { useGetMyAddressesQuery } from "@/store/api/addressApi/addressApi";
import { toast } from "react-hot-toast";

export default function Checkout() {
  const { data: cartResponse } = useGetMyCartQuery();
  const { data: addressResponse } = useGetMyAddressesQuery();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const navigate = useNavigate();

  const cart = cartResponse?.data || [];
  const addresses = addressResponse?.data || [];

  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?._id || "");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      toast.error("Iltimos, yetkazib berish manzilini tanlang");
      return;
    }

    try {
      const orderData = {
        addressId: selectedAddress,
        paymentMethod: paymentMethod,
        items: cart.map(item => ({ productId: item._id, quantity: item.quantity })),
        totalAmount,
      };

      const response = await createOrder(orderData).unwrap();
      toast.success("Buyurtma muvaffaqiyatli yaratildi!");
      // Redirect to success page or order details
      navigate(`/account/orders/${response._id}`);
    } catch (error) {
      toast.error("Buyurtmani rasmiylashtirishda xatolik yuz berdi");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-medium">Savatchangiz bo‘sh</p>
        <Button asChild>
          <Link to="/cart">Savatchaga qaytish</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/cart">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Buyurtmani rasmiylashtirish</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Delivery Address */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">Yetkazib berish manzili</h3>
            </div>
            <div className="grid gap-4">
              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <label key={addr._id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${selectedAddress === addr._id ? "border-primary bg-primary/5" : "hover:bg-secondary"}`}>
                    <input
                      type="radio"
                      name="address"
                      className="size-4 accent-primary"
                      checked={selectedAddress === addr._id}
                      onChange={() => setSelectedAddress(addr._id)}
                    />
                    <div>
                      <p className="font-medium">{addr.city}, {addr.street}</p>
                      <p className="text-sm text-muted-foreground">{addr.apartment}, {addr.house}</p>
                    </div>
                  </label>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">Saqlangan manzillar topilmadi</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/account/addresses">Manzil qo'shish</Link>
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="size-5 text-primary" />
              <h3 className="text-lg font-semibold">To'lov usuli</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {["cash", "card"].map((method) => (
                <label key={method} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${paymentMethod === method ? "border-primary bg-primary/5" : "hover:bg-secondary"}`}>
                  <input
                    type="radio"
                    name="payment"
                    className="size-4 accent-primary"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span className="capitalize">{method === "cash" ? "Naqd to'lov" : "Karta orqali"}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6">
            <h3 className="mb-4 text-lg font-semibold">Yakuniy summa</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mahsulotlar:</span>
                <span>{totalAmount.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Yetkazib berish:</span>
                <span>Bepul</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Jami:</span>
                <span className="text-primary">{totalAmount.toLocaleString()} so'm</span>
              </div>
            </div>
            <Button
              className="mt-6 w-full size-lg"
              size="lg"
              onClick={handleConfirmOrder}
              disabled={isCreating}
            >
              {isCreating ? "Tasdiqlanmoqda..." : "Buyurtmani tasdiqlash"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
