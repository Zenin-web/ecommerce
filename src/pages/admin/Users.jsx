import { useState } from "react";
import { Search, Ban } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/store/api/authApi";
import { extractProfileImage, getApiErrorMessage } from "@/lib/auth";
import { getImageUrl } from "@/lib/utils";

export default function AdminUsers() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetAllUsersQuery({
    search: search || undefined,
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = data?.data ?? [];

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `${name} foydalanuvchisini o'chirishni xohlaysizmi?`
    );
    if (!confirmed) return;

    try {
      await deleteUser(id).unwrap();
      toast.success("Foydalanuvchi o'chirildi");
    } catch (error) {
      console.error("Foydalanuvchini o'chirishda xato:", error);
      toast.error(getApiErrorMessage(error, "Foydalanuvchini o'chirishda xatolik yuz berdi"));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full max-w-xs">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Foydalanuvchi qidirish..."
          className="pl-9"
        />
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Foydalanuvchilar yuklanmoqda...</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">Foydalanuvchilarni yuklashda xatolik yuz berdi.</p>
      )}

      {!isLoading && !isError && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Foydalanuvchi</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Telefon</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Ro'yxatdan o'tgan</th>
                <th className="px-4 py-3 font-medium text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    {search ? "Qidiruv bo'yicha foydalanuvchi topilmadi." : "Hozircha foydalanuvchilar mavjud emas."}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={getImageUrl(extractProfileImage(user))}
                          fallback={user.name?.[0]?.toUpperCase()}
                        />
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.phone || "-"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? "Admin" : "Foydalanuvchi"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("uz-UZ") : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        disabled={isDeleting || user.role === "admin"}
                        title={user.role === "admin" ? "Adminni o'chirib bo'lmaydi" : "O'chirish"}
                        onClick={() => handleDelete(user._id, user.name)}
                      >
                        <Ban className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
