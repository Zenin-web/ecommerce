import { useState } from "react";
import { MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/auth";
import { useGetMyAddressesQuery, useCreateAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation } from "@/store/api/addressApi";

const empty = { fullName: "", phone: "", region: "", district: "", street: "", isDefault: false };
const fields = { fullName: "To‘liq ism", phone: "Telefon", region: "Viloyat", district: "Tuman", street: "Ko‘cha va uy" };
export default function Addresses() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError } = useGetMyAddressesQuery(undefined, { skip: !isAuthenticated });
  const [create, createState] = useCreateAddressMutation();
  const [update, updateState] = useUpdateAddressMutation();
  const [remove, removeState] = useDeleteAddressMutation();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const busy = createState.isLoading || updateState.isLoading || removeState.isLoading;
  if (!isAuthenticated) return <EmptyState icon={MapPin} title="Manzillarni ko‘rish uchun tizimga kiring" actionLabel="Kirish" actionLink="/login" />;
  async function save(event) {
    event.preventDefault();
    if (busy) return;
    const body = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]));
    if (Object.keys(fields).some(key => !body[key])) { toast.error("Barcha maydonlarni to‘ldiring"); return; }
    try {
      if (editing) await update({ id: editing, ...body }).unwrap();
      else await create(body).unwrap();
      setEditing(null); setForm(empty); toast.success("Manzil saqlandi");
    } catch (error) { toast.error(getApiErrorMessage(error, "Manzilni saqlab bo‘lmadi")); }
  }
  return <div className="mx-auto max-w-3xl space-y-5"><h1 className="text-xl font-semibold">Manzillarim</h1>
    {isLoading ? <p>Yuklanmoqda...</p> : isError ? <p role="alert">Manzillarni yuklab bo‘lmadi</p> : (data?.data || []).map(address => <Card key={address._id} className="p-4">
      <p className="font-semibold">{address.fullName}{address.isDefault && " — Asosiy"}</p><p>{address.phone}</p><p>{[address.region, address.district, address.street].join(', ')}</p>
      <div className="mt-3 flex gap-2"><Button variant="outline" disabled={busy} onClick={() => { setEditing(address._id); setForm(Object.fromEntries(Object.keys(empty).map(key => [key, address[key] ?? empty[key]]))); }}>Tahrirlash</Button>
      <Button variant="destructive" disabled={busy} onClick={async () => {
        if (!window.confirm("Manzilni o‘chirishni xohlaysizmi?")) return;
        try { await remove(address._id).unwrap(); if (editing === address._id) { setEditing(null); setForm(empty); } toast.success("Manzil o‘chirildi"); }
        catch (error) { toast.error(getApiErrorMessage(error, "Manzilni o‘chirib bo‘lmadi")); }
      }}>O‘chirish</Button></div>
    </Card>)}
    <Card className="p-5"><h2 className="mb-4 font-semibold">{editing ? 'Manzilni tahrirlash' : 'Yangi manzil'}</h2><form onSubmit={save} className="space-y-3">
      {Object.entries(fields).map(([key, label]) => <div key={key}><Label htmlFor={`address-${key}`}>{label}</Label><Input id={`address-${key}`} type={key === 'phone' ? 'tel' : 'text'} required value={form[key]} onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} disabled={busy} /></div>)}
      <label className="flex gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={e => setForm(prev => ({ ...prev, isDefault: e.target.checked }))} disabled={busy} />Asosiy manzil</label>
      <div className="flex gap-2"><Button disabled={busy}>Saqlash</Button>{editing && <Button type="button" variant="outline" disabled={busy} onClick={() => { setEditing(null); setForm(empty); }}>Bekor qilish</Button>}</div>
    </form></Card>
  </div>;
}
