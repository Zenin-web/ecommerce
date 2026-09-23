import { useState } from "react";
import { CreditCard, Banknote, MapPin, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import { mockProducts } from "@/data/mockData";

const addresses = [
  { id: "a1", label: "Uy", detail: "Chilonzor tumani, 12-uy" },
  { id: "a2", label: "Ish", detail: "Yunusobod tumani, IT Park" },
];

const paymentMethods = [
  { id: "cash", label: "Naqd pul", icon: Banknote },
  { id: "card", label: "Bank kartasi", icon: CreditCard },
];

export default function Checkout() {
  const [selectedAddress, setSelectedAddress] = useState("a1");
  const [selectedPayment, setSelectedPayment] = useState("cash");

  const items = mockProducts.slice(0, 3);
  const subtotal = items.reduce((sum, p) => sum + p.price, 0);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Buyurtmani rasmiylashtirish</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {/* Address */}
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold">
                <MapPin className="size-4" />
                Yetkazib berish manzili
              </h3>
              <Button variant="ghost" size="sm">
                <Plus className="size-4" />
                Yangi manzil
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors",
                    selectedAddress === addr.id ? "border-primary bg-primary/5" : "hover:bg-secondary",
                  )}
                >
                  <div>
                    <p className="font-medium">{addr.label}</p>
                    <p className="text-muted-foreground">{addr.detail}</p>
                  </div>
                  <div
                    className={cn(
                      "size-4 rounded-full border-2",
                      selectedAddress === addr.id ? "border-primary bg-primary" : "border-muted-foreground",
                    )}
                  />
                </button>
              ))}
            </div>
          </Card>

          {/* Payment */}
          <Card className="p-4">
            <h3 className="mb-3 font-semibold">To'lov usuli</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedPayment(id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
                    selectedPayment === id ? "border-primary bg-primary/5" : "hover:bg-secondary",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-4">
            <h3 className="mb-3 font-semibold">Aloqa ma'lumotlari</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>To'liq ism</Label>
                <Input placeholder="Aziz Karimov" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Telefon</Label>
                <Input placeholder="+998 90 123 45 67" />
              </div>
            </div>
          </Card>
        </div>

        {/* Summary */}
        <Card className="h-fit p-4">
          <h3 className="mb-3 font-semibold">Buyurtma xulosasi</h3>
          <div className="flex flex-col gap-2">
            {items.map((p) => (
              <div key={p._id} className="flex justify-between text-sm">
                <span className="line-clamp-1 text-muted-foreground">{p.title}</span>
                <span>{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between font-semibold">
            <span>Jami</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Button size="lg" className="mt-4 w-full">
            Buyurtmani tasdiqlash
          </Button>
        </Card>
      </div>
    </div>
  );
}
