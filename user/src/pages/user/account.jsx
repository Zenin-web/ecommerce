import { useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { User, Package, MapPin, Lock, ChevronRight, LogOut, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMeQuery, useUpdateMeInfoMutation, useUpdateMePasswordMutation } from "@/store/api/authApi/authApi";
import { useGetMyOrdersQuery, useGetSingleOrderQuery } from "@/store/api/orderApi/orderApi";
import { useGetMyAddressesQuery, useCreateAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation } from "@/store/api/addressApi/addressApi";
import { toast } from "react-hot-toast";

export function AccountSidebar() {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-secondary"
    }`;

  return (
    <div className="flex flex-col gap-1">
      <NavLink to="/account" className={navLinkClass}>
        <User className="size-4" /> Profil
      </NavLink>
      <NavLink to="/account/orders" className={navLinkClass}>
        <Package className="size-4" /> Buyurtmalarim
      </NavLink>
      <NavLink to="/account/addresses" className={navLinkClass}>
        <MapPin className="size-4" /> Manzillarim
      </NavLink>
      <NavLink to="/account/security" className={navLinkClass}>
        <Lock className="size-4" /> Xavfsizlik
      </NavLink>
      <Separator className="my-4" />
      <Button variant="ghost" className="justify-start px-4 text-destructive hover:bg-destructive/10" onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}>
        <LogOut className="size-4 mr-3" /> Chiqish
      </Button>
    </div>
  );
}

export function AccountLayout({ children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="lg:block">
          <Card className="p-4">
            <AccountSidebar />
          </Card>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { data: userResponse } = useMeQuery();
  const [updateInfo] = useUpdateMeInfoMutation();
  const user = userResponse?.data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await updateInfo({
        name: formData.get("name"),
        phone: formData.get("phone"),
      }).unwrap();
      toast.success("Profil yangilandi");
    } catch (error) {
      toast.error("Yangilashda xatolik");
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Shaxsiy ma'lumotlar</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">To'liq ism</Label>
          <Input id="name" name="name" defaultValue={user?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" defaultValue={user?.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (o'zgartirib bo'lmaydi)</Label>
          <Input id="email" defaultValue={user?.email} disabled className="bg-secondary" />
        </div>
        <Button type="submit" className="w-full sm:w-auto">Saqlash</Button>
      </form>
    </Card>
  );
}

export function OrdersPage() {
  const { data: ordersResponse, isLoading } = useGetMyOrdersQuery();
  const orders = ordersResponse?.data || [];

  if (isLoading) return <div className="text-center py-10">Yuklanmoqda...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Buyurtmalarim</h2>
      <div className="grid gap-4">
        {orders.length > 0 ? orders.map((order) => (
          <Card key={order._id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">Buyurtma #{order._id.slice(-6).toUpperCase()}</p>
              <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</p>
              <p className="text-sm font-semibold text-primary">{order.totalAmount.toLocaleString()} so'm</p>
            </div>
            <Link to={`/account/orders/${order._id}`} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Tafsilotlar <ChevronRight className="size-4" />
            </Link>
          </Card>
        )) : (
          <p className="text-center py-10 text-muted-foreground">Hali buyurtmalar mavjud emas</p>
        )}
      </div>
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams();
  const { data: orderResponse, isLoading } = useGetSingleOrderQuery(id);
  const order = orderResponse?.data;

  if (isLoading) return <div className="text-center py-10">Yuklanmoqda...</div>;
  if (!order) return <div className="text-center py-10">Buyurtma topilmadi</div>;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Buyurtma tafsilotlari</h2>
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Sana</p>
            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Holati</p>
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {order.status || "Kutilmoqda"}
            </span>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded bg-secondary" />
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Miqdor: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">{ (item.price * item.quantity).toLocaleString() } so'm</p>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Jami:</span>
            <span className="text-primary">{order.totalAmount.toLocaleString()} so'm</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AddressesPage() {
  const { data: addrResponse } = useGetMyAddressesQuery();
  const [createAddr] = useCreateAddressMutation();
  const [deleteAddr] = useDeleteAddressMutation();
  const addresses = addrResponse?.data || [];

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await createAddr({
        city: formData.get("city"),
        street: formData.get("street"),
        house: formData.get("house"),
        apartment: formData.get("apartment"),
      }).unwrap();
      toast.success("Manzil qo'shildi");
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Manzillarim</h2>
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Yangi manzil qo'shish</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="city" placeholder="Shahar" required />
          <Input name="street" placeholder="Ko'cha" required />
          <Input name="house" placeholder="Uy" required />
          <Input name="apartment" placeholder="Kvartira" />
          <Button type="submit" className="sm:col-span-2">Qo'shish</Button>
        </form>
      </Card>
      <div className="grid gap-4">
        {addresses.map((addr) => (
          <Card key={addr._id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{addr.city}, {addr.street}</p>
              <p className="text-sm text-muted-foreground">{addr.house}, {addr.apartment}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteAddr(addr._id)}>
              <Trash2 className="size-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SecurityPage() {
  const [updatePass] = useUpdateMePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await updatePass({
        oldPassword: formData.get("oldPass"),
        newPassword: formData.get("newPass"),
        confirmPassword: formData.get("confirmPass"),
      }).unwrap();
      toast.success("Parol yangilandi");
    } catch (error) {
      toast.error("Parol yangilashda xatolik");
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Xavfsizlik</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label>Amaldagi parol</Label>
          <Input name="oldPass" type="password" required />
        </div>
        <div className="space-y-2">
          <Label>Yangi parol</Label>
          <Input name="newPass" type="password" required />
        </div>
        <div className="space-y-2">
          <Label>Parol tasdiqlash</Label>
          <Input name="confirmPass" type="password" required />
        </div>
        <Button type="submit">Parolni yangilash</Button>
      </form>
    </Card>
  );
}
