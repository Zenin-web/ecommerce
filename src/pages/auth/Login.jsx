import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLoginMutation } from "@/store/api/authApi/authApi";
import { setToken } from "@/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(form).unwrap();
      const token = response?.token || response?.data?.token || response?.accessToken;

      if (!token) {
        throw new Error("Token topilmadi");
      }

      setToken(token);
      toast.success("Muvaffaqiyatli kirdingiz");
      navigate(location.state?.from || "/");
    } catch (error) {
      toast.error(error?.data?.message || "Email yoki parol noto'g'ri");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-sm py-8">
        <CardHeader className="items-center text-center">
          <Link to="/" className="mb-2 flex items-center gap-1.5 text-primary">
            <ShoppingBag className="size-6" />
            <span className="text-lg font-bold">Bozorcha</span>
          </Link>
          <CardTitle className="text-xl">Hisobingizga kiring</CardTitle>
          <CardDescription>Xaridlarni davom ettirish uchun tizimga kiring</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Parol</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="mt-1 w-full" disabled={isLoading}>
              {isLoading ? "Kirilmoqda..." : "Kirish"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Hisobingiz yo'qmi?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
