import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useMeQuery,
  useUpdateMeEmailMutation,
  useUpdateMeInfoMutation,
  useUpdateMePasswordMutation,
  useUpdateMeProfileImgMutation,
} from "@/store/api/authApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { extractProfileImage, extractUploadPath, extractUser, getApiErrorMessage } from "@/lib/auth";
import { getImageUrl } from "@/lib/utils";

export default function Profile() {
  const { data: meResponse, isLoading } = useMeQuery();
  const user = extractUser(meResponse);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fileInputRef = useRef(null);

  const [updateMeInfo, { isLoading: isUpdatingInfo }] = useUpdateMeInfoMutation();
  const [updateMeEmail, { isLoading: isUpdatingEmail }] = useUpdateMeEmailMutation();
  const [updateMePassword, { isLoading: isUpdatingPassword }] = useUpdateMePasswordMutation();
  const [updateMeProfileImg, { isLoading: isUpdatingImg }] = useUpdateMeProfileImgMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const isSavingAvatar = isUploading || isUpdatingImg;

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setNewEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Ismni kiriting");
      return;
    }

    try {
      await updateMeInfo({ name: name.trim(), phone: phone.trim() }).unwrap();
      toast.success("Profil ma'lumotlari yangilandi");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Ma'lumotlarni yangilab bo'lmadi"));
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();

    if (!newEmail.trim()) {
      toast.error("Yangi emailni kiriting");
      return;
    }

    try {
      await updateMeEmail({ newEmail: newEmail.trim() }).unwrap();
      toast.success("Email muvaffaqiyatli yangilandi");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Email yangilab bo'lmadi"));
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Barcha parol maydonlarini to'ldiring");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Yangi parollar mos kelmayapti");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    try {
      await updateMePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();
      toast.success("Parol muvaffaqiyatli yangilandi");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Parolni yangilab bo'lmadi"));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm fayllari qabul qilinadi");
      return;
    }

    try {
      const uploadResult = await uploadFile(file).unwrap();
      const imagePath = extractUploadPath(uploadResult);

      if (!imagePath) {
        toast.error("Rasm yuklandi, lekin yo'l olinmadi");
        return;
      }

      await updateMeProfileImg({ newProfileImg: imagePath }).unwrap();
      toast.success("Profil rasmi yangilandi");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Profil rasmini yangilab bo'lmadi"));
    } finally {
      e.target.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const profileImg = extractProfileImage(user);
  const avatarSrc = getImageUrl(profileImg);
  const fallback = user?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-xl font-semibold">Profil</h1>

      <Card className="mb-6 p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative">
            <Avatar src={avatarSrc} fallback={fallback} className="size-20 text-lg" />
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute -right-1 -bottom-1 size-8 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSavingAvatar}
            >
              {isSavingAvatar ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-semibold">{user?.name || "Foydalanuvchi"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {user?.phone && <p className="mt-1 text-sm text-muted-foreground">{user.phone}</p>}
            {user?.role && (
              <Badge variant="secondary" className="mt-2 capitalize">
                {user.role}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Ma'lumotlar</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="password">Parol</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="p-5">
            <h3 className="mb-4 font-semibold">Shaxsiy ma'lumotlar</h3>
            <form className="flex flex-col gap-4" onSubmit={handleUpdateInfo}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Ism</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingiz"
                  disabled={isUpdatingInfo}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  disabled={isUpdatingInfo}
                />
              </div>
              <Button type="submit" className="w-fit" disabled={isUpdatingInfo}>
                {isUpdatingInfo ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="p-5">
            <h3 className="mb-4 font-semibold">Emailni o'zgartirish</h3>
            <form className="flex flex-col gap-4" onSubmit={handleUpdateEmail}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newEmail">Yangi email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="yangi@email.uz"
                  disabled={isUpdatingEmail}
                />
              </div>
              <Button type="submit" className="w-fit" disabled={isUpdatingEmail}>
                {isUpdatingEmail ? "Saqlanmoqda..." : "Emailni yangilash"}
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card className="p-5">
            <h3 className="mb-4 font-semibold">Parolni o'zgartirish</h3>
            <form className="flex flex-col gap-4" onSubmit={handleUpdatePassword}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="oldPassword">Joriy parol</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isUpdatingPassword}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newPassword">Yangi parol</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isUpdatingPassword}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">Yangi parolni tasdiqlang</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isUpdatingPassword}
                />
              </div>
              <Button type="submit" className="w-fit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? "Saqlanmoqda..." : "Parolni yangilash"}
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
