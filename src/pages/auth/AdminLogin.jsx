import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLoginMutation } from "@/store/api/authApi";
import { extractToken, getApiErrorMessage, setToken } from "@/lib/auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Email va parolni kiriting");
      return;
    }

    try {
      const result = await login({ email: email.trim(), password }).unwrap();
      const token = extractToken(result);

      if (!token) {
        toast.error("Token olinmadi. Backend javobini tekshiring.");
        return;
      }

      setToken(token);
      toast.success("Muvaffaqiyatli kirdingiz!");
      navigate("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Email yoki parol noto'g'ri"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-sm py-8">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex items-center gap-1.5 text-primary">
            <ShoppingBag className="size-6" />
            <span className="text-lg font-bold">Bozorcha</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <ShieldCheck className="size-4" />
            Admin panel
          </div>
          <CardTitle className="text-xl">Boshqaruv paneliga kirish</CardTitle>
          <CardDescription>Faqat administratorlar uchun</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@shop.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="mt-1 w-full" disabled={isLoading}>
              {isLoading ? "Kutilmoqda..." : "Kirish"}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Admin hisobi backend orqali <code>/auth/signup-admin</code> bilan yaratiladi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
