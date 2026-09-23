import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Login() {
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
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="siz@example.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Parol</Label>
                <span className="text-xs text-primary hover:underline cursor-pointer">
                  Parolni unutdingizmi?
                </span>
              </div>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="mt-1 w-full">
              Kirish
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
