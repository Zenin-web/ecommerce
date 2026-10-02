import { useGetMyAddressesQuery } from "@/store/api/addressApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CreditCard, Banknote, MapPin, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn, formatPrice, getDiscountedPrice } from "@/lib/utils";
import {
  useGetMyCartQuery,
  useIsCartQuantityPending,
} from "@/store/api/cartApi/cartApi";
import { useCreateOrderMutation } from "@/store/api/orderApi/orderApi";
import { useAuth } from "@/hooks/useAuth";

const paymentMethods = [
  {
    id: "cash",
    label: "Naqd pul",
    icon: Banknote,
  },
  {
    id: "card",
    label: "Bank kartasi",
    icon: CreditCard,
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const isUpdatingQuantity = useIsCartQuantityPending();
  const { isAuthenticated } = useAuth();

  const {
    data: cartResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetMyCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [createOrder, { isLoading: isSubmitting }] =
    useCreateOrderMutation();


  const { data: addressResponse } = useGetMyAddressesQuery(undefined, { skip: !isAuthenticated });

  const [selectedPayment, setSelectedPayment] = useState("cash");

  const [contact, setContact] = useState({
    fullName: "",
    phone: "",
    region: "",
    district: "",
    street: "",
  });

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Buyurtma berish uchun tizimga kiring"
        description="Buyurtmani rasmiylashtirish uchun avval tizimga kiring"
        actionLabel="Kirish"
        actionLink="/login"
      />
    );
  }

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Yuklanmoqda...
      </p>
    );
  }

  if (isError) return <p role="alert" className="py-16 text-center text-destructive">Savatchani yuklab bo‘lmadi</p>;

  const cart = cartResponse?.data;

  const items = (cart?.items || cart?.products || [])
    .map((entry) => ({
      product: entry.product,
      quantity: entry.quantity ?? 1,
    }))
    .filter((entry) => entry.product);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Savatchangiz bo'sh"
        description="Buyurtma berish uchun avval katalogdan mahsulot qo'shing"
        actionLabel="Katalogga o'tish"
        actionLink="/catalog"
      />
    );
  }

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      getDiscountedPrice(
        item.product.price,
        item.product.discount
      ) * item.quantity,
    0
  );

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    // Agar +998 bilan paste qilinsa ham faqat 9 raqamni saqlaymiz
    if (value.startsWith("998")) {
      value = value.slice(3);
    }

    value = value.slice(0, 9);

    setContact((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const formatPhone = (phone) => {
    if (!phone) return "";

    const parts = [];

    if (phone.length > 0) {
      parts.push(phone.slice(0, 2));
    }

    if (phone.length > 2) {
      parts.push(phone.slice(2, 5));
    }

    if (phone.length > 5) {
      parts.push(phone.slice(5, 7));
    }

    if (phone.length > 7) {
      parts.push(phone.slice(7, 9));
    }

    return parts.join(" ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isUpdatingQuantity || isFetching) return;

    if (
      !contact.fullName.trim() ||
      !contact.phone ||
      !contact.region.trim() ||
      !contact.district.trim() ||
      !contact.street.trim()
    ) {
      toast.error("Iltimos barcha maydonlarni to'ldiring");
      return;
    }

    if (contact.phone.length !== 9) {
      toast.error("Telefon raqamini to'liq kiriting");
      return;
    }

    try {
      const result = await createOrder({
        address: {
          fullName: contact.fullName.trim(),
          phone: `+998${contact.phone}`,
          region: contact.region.trim(),
          district: contact.district.trim(),
          street: contact.street.trim(),
        },

        paymentMethod: selectedPayment,
      }).unwrap();

      toast.success("Buyurtma muvaffaqiyatli qabul qilindi");

      navigate(result.data?._id ? `/orders/${result.data._id}` : "/orders");
    } catch (error) {
      console.error("CREATE ORDER ERROR:", error);

      toast.error(
        error?.data?.msg ||
          error?.data?.message ||
          "Buyurtma berishda xatolik yuz berdi"
      );
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">
        Buyurtmani rasmiylashtirish
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
      >
        <div className="flex flex-col gap-6">
          <Card className="p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <MapPin className="size-4" />
              Yetkazib berish manzili
            </h3>

            {(addressResponse?.data || []).length > 0 && <div className="mb-4"><Label htmlFor="saved-address">Saqlangan manzil</Label><select id="saved-address" defaultValue="" className="mt-2 w-full rounded-md border bg-background p-2" onChange={e => {
              const address = addressResponse.data.find(item => item._id === e.target.value);
              if (!address) return;
              const digits = address.phone.replace(/\D/g, '');
              setContact({ fullName: address.fullName, phone: (digits.startsWith('998') ? digits.slice(3) : digits).slice(0, 9), region: address.region, district: address.district, street: address.street });
            }}><option value="">Manzilni tanlang</option>{addressResponse.data.map(address => <option key={address._id} value={address._id}>{address.region}, {address.street}</option>)}</select></div>}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Viloyat</Label>

                <Input
                  placeholder="Masalan: Surxondaryo"
                  value={contact.region}
                  onChange={(e) =>
                    setContact((prev) => ({
                      ...prev,
                      region: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Tuman</Label>

                <Input
                  placeholder="Masalan: Termiz tumani"
                  value={contact.district}
                  onChange={(e) =>
                    setContact((prev) => ({
                      ...prev,
                      district: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Ko'cha va uy raqami</Label>

                <Input
                  placeholder="Masalan: Navbahor ko'chasi, 15-uy"
                  value={contact.street}
                  onChange={(e) =>
                    setContact((prev) => ({
                      ...prev,
                      street: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="mb-3 font-semibold">
              To'lov usuli
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(
                ({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedPayment(id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
                      selectedPayment === id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-secondary"
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                )
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="mb-3 font-semibold">
              Aloqa ma'lumotlari
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>To'liq ism</Label>

                <Input
                  placeholder="Aziz Karimov"
                  value={contact.fullName}
                  onChange={(e) =>
                    setContact((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Telefon</Label>

                <div className="flex">
                  <div className="flex h-10 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm font-medium text-muted-foreground">
                    +998
                  </div>

                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="90 123 45 67"
                    value={formatPhone(contact.phone)}
                    onChange={handlePhoneChange}
                    className="rounded-l-none"
                    maxLength={12}
                    required
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="h-fit p-4">
          <h3 className="mb-3 font-semibold">
            Buyurtma xulosasi
          </h3>

          <div className="flex flex-col gap-2">
            {items.map(({ product, quantity }) => (
              <div
                key={product._id}
                className="flex justify-between text-sm"
              >
                <span className="line-clamp-1 text-muted-foreground">
                  {product.title} × {quantity}
                </span>

                <span>
                  {formatPrice(
                    getDiscountedPrice(
                      product.price,
                      product.discount
                    ) * quantity
                  )}
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between font-semibold">
            <span>Jami</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-4 w-full"
            disabled={isSubmitting || isUpdatingQuantity || isFetching}
          >
            {isUpdatingQuantity || isFetching
              ? "Miqdor saqlanmoqda..."
              : isSubmitting
                ? "Yuborilmoqda..."
                : "Buyurtmani tasdiqlash"}
          </Button>
        </Card>
      </form>
    </div>
  );
}