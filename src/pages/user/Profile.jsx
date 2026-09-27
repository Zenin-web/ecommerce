import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Lock, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  useMeQuery,
  useUpdateMeInfoMutation,
  useUpdateMePasswordMutation,
} from "@/store/api/authApi/authApi";
import { useAuth, clearToken } from "@/hooks/useAuth";

export default function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: meResponse, isLoading, isError } = useMeQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateMeInfo] = useUpdateMeInfoMutation();
  const [updateMePassword, { isLoading: isSavingPassword }] = useUpdateMePasswordMutation();

  const user = meResponse?.data || meResponse;

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Yangi parollar mos kelmadi");
      return;
    }

    try {
      await updateMePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      toast.success("Parol yangilandi");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error?.data?.message || "Parolni yangilab bo'lmadi");
    }
  };

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon={User}
        title="Profilni ko'rish uchun tizimga kiring"
        description="Shaxsiy ma'lumotlaringizni ko'rish uchun avval tizimga kiring"
        actionLabel="Kirish"
        actionLink="/login"
      />
    );
  }

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">Profil yuklanmoqda...</p>
    );
  }

  if (isError || !user) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Ma'lumotlarni yuklashda xatolik yuz berdi
      </p>
    );
  }

  const initials = (user.name || user.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Avatar src={user.profileImg} fallback={initials} className="size-16 text-lg" />
        <div>
          <h1 className="text-xl font-semibold">{user.name || "Foydalanuvchi"}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="w-full">
          <TabsTrigger value="info">
            <User className="size-4" />
            Ma'lumotlar
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="size-4" />
            Parol
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="pt-4">
          <ProfileInfoForm key={user._id || user.email} user={user} updateMeInfo={updateMeInfo} />
        </TabsContent>

        <TabsContent value="password" className="pt-4">
          <Card className="p-5">
            <form onSubmit={handlePasswordSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Joriy parol</Label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Yangi parol</Label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Yangi parolni tasdiqlang</Label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                    }
                  />
                </div>
              </div>
              <Button type="submit" className="mt-4" disabled={isSavingPassword}>
                {isSavingPassword ? "Yangilanmoqda..." : "Parolni yangilash"}
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-6" />

      <Button
        variant="outline"
        className="w-full text-destructive hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="size-4" />
        Chiqish
      </Button>
    </div>
  );
}

// Alohida komponent: `user` prop orqali boshlang'ich qiymatlarni oladi,
// shuning uchun useEffect + setState kerak emas (Profile komponenti uni
// `key={user._id}` bilan render qiladi, user o'zgarsa qayta yaratiladi).
function ProfileInfoForm({ user, updateMeInfo }) {
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    email: user.email || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateMeInfo({ name: form.name, phone: form.phone }).unwrap();
      toast.success("Ma'lumotlar yangilandi");
    } catch (error) {
      toast.error(error?.data?.message || "Ma'lumotlarni saqlab bo'lmadi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-5">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>To'liq ism</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Telefon</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>Email</Label>
            <Input value={form.email} type="email" disabled />
          </div>
        </div>
        <Button type="submit" className="mt-4" disabled={isSaving}>
          {isSaving ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </form>
    </Card>
  );
}
