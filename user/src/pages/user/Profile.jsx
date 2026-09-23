import { User, Package, MapPin, Lock, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Profile() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Avatar fallback="AK" className="size-16 text-lg" />
        <div>
          <h1 className="text-xl font-semibold">Aziz Karimov</h1>
          <p className="text-sm text-muted-foreground">aziz@mail.uz</p>
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
          <Card className="p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>To'liq ism</Label>
                <Input defaultValue="Aziz Karimov" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Telefon</Label>
                <Input defaultValue="+998 90 123 45 67" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Email</Label>
                <Input defaultValue="aziz@mail.uz" type="email" />
              </div>
            </div>
            <Button className="mt-4">Saqlash</Button>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="pt-4">
          <Card className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Joriy parol</Label>
                <Input type="password" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Yangi parol</Label>
                <Input type="password" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Yangi parolni tasdiqlang</Label>
                <Input type="password" />
              </div>
            </div>
            <Button className="mt-4">Parolni yangilash</Button>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-6" />

      <Button variant="outline" className="w-full text-destructive hover:text-destructive">
        <LogOut className="size-4" />
        Chiqish
      </Button>
    </div>
  );
}
