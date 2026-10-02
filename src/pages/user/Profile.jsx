import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth, clearToken } from "@/hooks/useAuth";
import { EmptyState } from "@/components/shared/EmptyState";
import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMeQuery, useUpdateMeInfoMutation, useUpdateMeEmailMutation,
  useUpdateMePasswordMutation, useUpdateMeProfileImgMutation } from "@/store/api/authApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { extractUploadPath, getApiErrorMessage } from "@/lib/auth";
import { getImageUrl } from "@/lib/utils";
import { isStrongPassword, PASSWORD_HINT, validateImage } from "@/lib/validation";

function ProfileContent() {
  const { data, isLoading, isError, refetch } = useMeQuery();
  if (isLoading) return <p className="py-16 text-center">Profil yuklanmoqda...</p>;
  if (isError || !data?.data) return <div role="alert" className="py-16 text-center"><p>Profilni yuklab bo‘lmadi</p><Button onClick={refetch}>Qayta urinish</Button></div>;
  return <ProfileForm key={data.data._id} user={data.data} />;
}

function ProfileForm({ user }) {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [email, setEmail] = useState(user.email || "");
  const [passwords, setPasswords] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const fileRef = useRef(null);
  const [updateInfo, infoState] = useUpdateMeInfoMutation();
  const [updateEmail, emailState] = useUpdateMeEmailMutation();
  const [updatePassword, passwordState] = useUpdateMePasswordMutation();
  const [updateImage, imageState] = useUpdateMeProfileImgMutation();
  const [uploadFile, uploadState] = useUploadFileMutation();
  const savingImage = imageState.isLoading || uploadState.isLoading;

  async function handleAvatar(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file || savingImage) return;
    try {
      const error = validateImage(file);
      if (error) { toast.error(error); return; }
      const result = await uploadFile(file).unwrap();
      const newProfileImg = extractUploadPath(result);
      if (!newProfileImg) throw new Error("Rasm yo‘li olinmadi");
      await updateImage({ newProfileImg }).unwrap();
      toast.success("Profil rasmi yangilandi");
    } catch (error) {
      toast.error(getApiErrorMessage(error, error.message || "Profil rasmini yangilab bo‘lmadi"));
    } finally { input.value = ""; }
  }

  async function handleInfo(event) {
    event.preventDefault();
    if (infoState.isLoading) return;
    if (!name.trim()) { toast.error("Ismni kiriting"); return; }
    if (user.phone && !phone.trim()) { toast.error("Telefon raqamini kiriting"); return; }
    try {
      await updateInfo({ name: name.trim(), phone: phone.trim() }).unwrap();
      toast.success("Ma’lumotlar yangilandi");
    } catch (error) { toast.error(getApiErrorMessage(error, "Ma’lumotlarni saqlab bo‘lmadi")); }
  }

  async function handleEmail(event) {
    event.preventDefault();
    if (emailState.isLoading) return;
    if (email.trim() === user.email) { toast.error("Yangi emailni kiriting"); return; }
    try {
      await updateEmail({ newEmail: email.trim() }).unwrap();
      toast.success("Email yangilandi");
    } catch (error) { toast.error(getApiErrorMessage(error, "Emailni yangilab bo‘lmadi")); }
  }

  async function handlePassword(event) {
    event.preventDefault();
    if (passwordState.isLoading) return;
    if (passwords.old_password.length < 8) { toast.error("Joriy parol kamida 8 belgi bo‘lishi kerak"); return; }
    if (!isStrongPassword(passwords.new_password)) { toast.error(PASSWORD_HINT); return; }
    if (passwords.new_password !== passwords.confirm_password) { toast.error("Yangi parollar mos kelmayapti"); return; }
    if (passwords.new_password === passwords.old_password) { toast.error("Yangi parol joriy paroldan farq qilishi kerak"); return; }
    try {
      await updatePassword(passwords).unwrap();
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
      toast.success("Parol yangilandi");
    } catch (error) { toast.error(getApiErrorMessage(error, "Parolni yangilab bo‘lmadi")); }
  }

  return <div className="mx-auto max-w-3xl space-y-6">
    <h1 className="text-xl font-semibold">Profil</h1>
    <Card className="flex-row items-center gap-4 p-5">
      <div className="relative">
        <Avatar src={getImageUrl(user.profile_image)} fallback={(user.name || "U")[0]} className="size-20 text-xl" />
        <Button type="button" size="icon" variant="secondary" aria-label="Profil rasmini o‘zgartirish" className="absolute -right-1 -bottom-1 size-8 rounded-full" onClick={() => fileRef.current?.click()} disabled={savingImage}>
          {savingImage ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} disabled={savingImage} />
      </div>
      <div><h2 className="font-semibold">{user.name}</h2><p className="text-sm text-muted-foreground">{user.email}</p><p className="text-sm text-muted-foreground">{user.phone}</p></div>
    </Card>
    <Tabs defaultValue="info">
      <TabsList><TabsTrigger value="info">Ma’lumotlar</TabsTrigger><TabsTrigger value="email">Email</TabsTrigger><TabsTrigger value="password">Parol</TabsTrigger></TabsList>
      <TabsContent value="info"><Card className="p-5"><form onSubmit={handleInfo} className="space-y-4">
        <div><Label htmlFor="profile-name">Ism</Label><Input id="profile-name" value={name} onChange={e => setName(e.target.value)} required disabled={infoState.isLoading} /></div>
        <div><Label htmlFor="profile-phone">Telefon</Label><Input id="profile-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} disabled={infoState.isLoading} /></div>
        <Button disabled={infoState.isLoading}>{infoState.isLoading ? "Saqlanmoqda..." : "Saqlash"}</Button>
      </form></Card></TabsContent>
      <TabsContent value="email"><Card className="p-5"><form onSubmit={handleEmail} className="space-y-4">
        <Label htmlFor="profile-email">Yangi email</Label><Input id="profile-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={emailState.isLoading} />
        <Button disabled={emailState.isLoading}>{emailState.isLoading ? "Saqlanmoqda..." : "Emailni yangilash"}</Button>
      </form></Card></TabsContent>
      <TabsContent value="password"><Card className="p-5"><form onSubmit={handlePassword} className="space-y-4">
        {[['old_password', 'Joriy parol'], ['new_password', 'Yangi parol'], ['confirm_password', 'Yangi parolni tasdiqlang']].map(([key, label]) => <div key={key}>
          <Label htmlFor={key}>{label}</Label><Input id={key} type="password" autoComplete={key === 'old_password' ? 'current-password' : 'new-password'} minLength={8} required value={passwords[key]} onChange={e => setPasswords(prev => ({ ...prev, [key]: e.target.value }))} disabled={passwordState.isLoading} />
        </div>)}
        <p className="text-xs text-muted-foreground">{PASSWORD_HINT}</p>
        <Button disabled={passwordState.isLoading}>{passwordState.isLoading ? "Saqlanmoqda..." : "Parolni yangilash"}</Button>
      </form></Card></TabsContent>
    </Tabs>
  </div>;
}

export default function Profile() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  if (!isAuthenticated) return <EmptyState icon={User} title="Profilni ko‘rish uchun tizimga kiring" actionLabel="Kirish" actionLink="/login" />;
  return <><ProfileContent /><div className="mx-auto mt-6 flex max-w-3xl gap-3"><Button asChild variant="outline"><Link to="/addresses">Manzillarim</Link></Button><Button variant="outline" onClick={() => { clearToken(); navigate("/"); }}>Chiqish</Button></div></>;
}
