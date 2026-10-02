import { useRef, useState } from "react";
import { User, Lock, LogOut, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useMeQuery,
  useUpdateMeInfoMutation,
  useUpdateMeEmailMutation,
  useUpdateMePasswordMutation,
  useUpdateMeProfileImgMutation,
} from "@/store/api/authApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8989";
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};
export default function Profile() {
  const fileInputRef = useRef(null);
  const { data, isLoading: isUserLoading } = useMeQuery();
  const [updateMeInfo, { isLoading: isInfoUpdating }] =
    useUpdateMeInfoMutation();
  const [updateMeEmail, { isLoading: isEmailUpdating }] =
    useUpdateMeEmailMutation();
  const [updateMePassword, { isLoading: isPasswordUpdating }] =
    useUpdateMePasswordMutation();
  const [updateMeProfileImg, { isLoading: isProfileImgUpdating }] =
    useUpdateMeProfileImgMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const user = data?.data || data;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const getErrorMessage = (err) => {
    return (
      err?.data?.message ||
      err?.data?.msg ||
      err?.data?.error ||
      err?.error ||
      err?.message ||
      "Xatolik yuz berdi"
    );
  };
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await updateMeInfo({ name, phone }).unwrap();
      if (email !== user?.email) {
        await updateMeEmail({ newEmail: email }).unwrap();
      }
      setMessage("Ma'lumotlar muvaffaqiyatli yangilandi.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Barcha parol maydonlarini to'ldiring.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Yangi parollar bir xil emas.");
      return;
    }
    try {
      await updateMePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Parol muvaffaqiyatli yangilandi.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("Rasm tanlanmadi.");
      return;
    }
    console.log("Tanlangan rasm:", file);
    console.log("Rasm nomi:", file.name);
    console.log("Rasm turi:", file.type);
    console.log("Rasm hajmi:", file.size);
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log("Upload boshlanmoqda...");
      const response = await uploadFile(formData).unwrap();
      console.log("Upload javobi:", response);
      const filePath =
        response?.file?.file_path ||
        response?.data?.file?.file_path ||
        response?.file_path ||
        response?.data?.file_path;
      console.log("Topilgan filePath:", filePath);
      if (!filePath) {
        throw new Error(
          "Serverdan rasm manzili qaytmadi. Network → upload/file → Response ni tekshiring.",
        );
      }
      console.log("Profil rasmi yangilanmoqda...");
      await updateMeProfileImg({ newProfileImg: filePath }).unwrap();
      console.log("Profil rasmi muvaffaqiyatli yangilandi.");
      setMessage("Profil rasmi muvaffaqiyatli yangilandi.");
    } catch (err) {
      console.error("Rasm yuklash xatosi:", err);
      setError(getErrorMessage(err));
    } finally {
      e.target.value = "";
    }
  };
  const handleCameraClick = () => {
    console.log("Kamera tugmasi bosildi.");
    fileInputRef.current?.click();
  };
  const isSavingInfo = isInfoUpdating || isEmailUpdating;
  const isSavingImage = isUploading || isProfileImgUpdating;
  if (isUserLoading) {
    return (
      <div className="mx-auto max-w-2xl py-10 text-center">
        {" "}
        Profil yuklanmoqda...{" "}
      </div>
    );
  }
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl py-10 text-center">
        {" "}
        Foydalanuvchi ma'lumotlari topilmadi.{" "}
      </div>
    );
  }
  const currentName = name || user.name || "";
  const currentPhone = phone || user.phone || "";
  const currentEmail = email || user.email || "";
  const profileImage = user.profile_image
    ? getImageUrl(user.profile_image)
    : "";
  return (
    <div className="mx-auto max-w-2xl">
      {" "}
      <div className="mb-6 flex items-center gap-4">
        {" "}
        <div className="relative">
          {" "}
          <Avatar
            src={profileImage}
            fallback={currentName?.charAt(0)?.toUpperCase() || "U"}
            className="size-16 text-lg"
          />{" "}
          <button
            type="button"
            onClick={handleCameraClick}
            disabled={isSavingImage}
            className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border bg-background shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {" "}
            <Camera className="size-4" />{" "}
          </button>{" "}
          <input
            ref={fileInputRef}
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />{" "}
        </div>{" "}
        <div>
          {" "}
          <h1 className="text-xl font-semibold">
            {" "}
            {currentName || "Foydalanuvchi"}{" "}
          </h1>{" "}
          <p className="text-sm text-muted-foreground">
            {" "}
            {currentEmail || "Email mavjud emas"}{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {message && (
        <div className="mb-4 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-600">
          {" "}
          {message}{" "}
        </div>
      )}{" "}
      {error && (
        <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">
          {" "}
          {error}{" "}
        </div>
      )}{" "}
      <Tabs defaultValue="info">
        {" "}
        <TabsList className="w-full">
          {" "}
          <TabsTrigger value="info">
            {" "}
            <User className="size-4" /> Ma'lumotlar{" "}
          </TabsTrigger>{" "}
          <TabsTrigger value="password">
            {" "}
            <Lock className="size-4" /> Parol{" "}
          </TabsTrigger>{" "}
        </TabsList>{" "}
        <TabsContent value="info" className="pt-4">
          {" "}
          <Card className="p-5">
            {" "}
            <form onSubmit={handleInfoSubmit}>
              {" "}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {" "}
                <div className="flex flex-col gap-1.5">
                  {" "}
                  <Label htmlFor="name"> To'liq ism </Label>{" "}
                  <Input
                    id="name"
                    value={currentName}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ismingiz"
                  />{" "}
                </div>{" "}
                <div className="flex flex-col gap-1.5">
                  {" "}
                  <Label htmlFor="phone"> Telefon </Label>{" "}
                  <Input
                    id="phone"
                    value={currentPhone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998..."
                  />{" "}
                </div>{" "}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  {" "}
                  <Label htmlFor="email"> Email </Label>{" "}
                  <Input
                    id="email"
                    value={currentEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="example@gmail.com"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <Button type="submit" className="mt-4" disabled={isSavingInfo}>
                {" "}
                {isSavingInfo ? "Saqlanmoqda..." : "Saqlash"}{" "}
              </Button>{" "}
            </form>{" "}
          </Card>{" "}
        </TabsContent>{" "}
        <TabsContent value="password" className="pt-4">
          {" "}
          <Card className="p-5">
            {" "}
            <form onSubmit={handlePasswordSubmit}>
              {" "}
              <div className="flex flex-col gap-4">
                {" "}
                <div className="flex flex-col gap-1.5">
                  {" "}
                  <Label htmlFor="old-password"> Joriy parol </Label>{" "}
                  <Input
                    id="old-password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Joriy parolingiz"
                  />{" "}
                </div>{" "}
                <div className="flex flex-col gap-1.5">
                  {" "}
                  <Label htmlFor="new-password"> Yangi parol </Label>{" "}
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yangi parol"
                  />{" "}
                </div>{" "}
                <div className="flex flex-col gap-1.5">
                  {" "}
                  <Label htmlFor="confirm-password">
                    {" "}
                    Yangi parolni tasdiqlang{" "}
                  </Label>{" "}
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yangi parolni qayta kiriting"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <Button
                type="submit"
                className="mt-4"
                disabled={isPasswordUpdating}
              >
                {" "}
                {isPasswordUpdating
                  ? "Yangilanmoqda..."
                  : "Parolni yangilash"}{" "}
              </Button>{" "}
            </form>{" "}
          </Card>{" "}
        </TabsContent>{" "}
      </Tabs>{" "}
      <Separator className="my-6" />{" "}
      <Button
        type="button"
        variant="outline"
        className="w-full text-destructive hover:text-destructive"
      >
        {" "}
        <LogOut className="size-4" /> Chiqish{" "}
      </Button>{" "}
    </div>
  );
}
