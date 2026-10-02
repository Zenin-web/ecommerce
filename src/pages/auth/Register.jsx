import { isStrongPassword, PASSWORD_HINT } from "@/lib/validation";
import { getApiErrorMessage } from "@/lib/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSignupMutation } from "@/store/api/authApi/authApi";
import { setToken } from "@/hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [signup, { isLoading }] = useSignupMutation();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(form.password)) { toast.error(PASSWORD_HINT); return; }
    try {
      const response = await signup(form).unwrap();
      const token = response?.token || response?.data?.token || response?.accessToken;

      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz");

      if (token) {
        setToken(token);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Ro'yxatdan o'tishda xatolik yuz berdi"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-10">
      <Card className="w-full max-w-sm py-8">
        <CardHeader className="items-center text-center">
          <Link to="/" className="mb-2 flex items-center gap-1.5 text-primary">
            <ShoppingBag className="size-6" />
            <span className="text-lg font-bold">Bozorcha</span>
          </Link>
          <CardTitle className="text-xl">Ro'yxatdan o'tish</CardTitle>
          <CardDescription>Yangi hisob yarating va xarid qilishni boshlang</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">To'liq ism</Label>
              <Input
                id="name"
                name="name"
                placeholder="Aziz Karimov"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Telefon raqam</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+998 90 123 45 67"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="siz@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                minLength={8}
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="mt-1 w-full" disabled={isLoading}>
              {isLoading ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Hisobingiz bormi?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Kirish
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
