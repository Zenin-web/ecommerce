import { useState } from "react";
import { Plus, Pencil, Trash2, ImageOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetAllBannersAdminQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "@/store/api/bannerApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { extractUploadPath, getApiErrorMessage } from "@/lib/auth";
import { getImageUrl } from "@/lib/utils";

export default function AdminBanners() {
  const [open, setOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");

  const { data, isLoading, isError } = useGetAllBannersAdminQuery();

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const banners = data?.data ?? [];
  const isSaving = isCreating || isUpdating;

  const resetForm = () => {
    setTitle("");
    setLink("");
    setImage("");
    setEditingBanner(null);
  };

  const closeDialog = () => {
    setOpen(false);
    resetForm();
  };

  const openCreateDialog = () => {
    resetForm();
    setOpen(true);
  };

  const openEditDialog = (banner) => {
    setEditingBanner(banner);
    setTitle(banner.title || "");
    setLink(banner.link || "");
    setImage(banner.image || "");
    setOpen(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file).unwrap();
      const path = extractUploadPath(result);

      if (!path) {
        toast.error("Rasm yuklandi, lekin yo'li olinmadi");
        return;
      }

      setImage(path);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Rasm yuklashda xatolik yuz berdi"));
    } finally {
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Banner uchun rasm yuklang");
      return;
    }

    const body = {
      title: title.trim(),
      link: link.trim(),
      image,
    };

    try {
      if (editingBanner) {
        await updateBanner({ id: editingBanner._id, body }).unwrap();
        toast.success("Banner yangilandi");
      } else {
        await createBanner(body).unwrap();
        toast.success("Banner qo'shildi");
      }
      closeDialog();
    } catch (error) {
      console.error("Banner saqlashda xato:", error);
      toast.error(getApiErrorMessage(error, "Bannerni saqlashda xatolik yuz berdi"));
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bu bannerni o'chirishni xohlaysizmi?");
    if (!confirmed) return;

    try {
      await deleteBanner(id).unwrap();
      toast.success("Banner o'chirildi");
    } catch (error) {
      console.error("Banner o'chirishda xato:", error);
      toast.error(getApiErrorMessage(error, "Bannerni o'chirishda xatolik yuz berdi"));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{banners.length} ta banner</p>

        <Dialog
          open={open}
          onOpenChange={(value) => (value ? setOpen(true) : closeDialog())}
        >
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="size-4" />
              Yangi banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Bannerni tahrirlash" : "Yangi banner qo'shish"}
              </DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="banner-title">Sarlavha</Label>
                <Input
                  id="banner-title"
                  placeholder="Masalan: Yozgi chegirmalar"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="banner-link">Havola (link)</Label>
                <Input
                  id="banner-link"
                  placeholder="/catalog?category=elektronika"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Rasm</Label>
                {image ? (
                  <div className="relative aspect-video overflow-hidden rounded-lg border">
                    <img
                      src={getImageUrl(image)}
                      alt="Banner"
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
                    >
                      O'zgartirish
                    </button>
                  </div>
                ) : (
                  <label className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border border-dashed text-muted-foreground hover:border-primary hover:text-primary">
                    {isUploading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <span className="text-sm">Rasm yuklash</span>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog} disabled={isSaving}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isSaving || isUploading}>
                  {isSaving ? "Saqlanmoqda..." : editingBanner ? "Saqlash" : "Qo'shish"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Bannerlar yuklanmoqda...</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">Bannerlarni yuklashda xatolik yuz berdi.</p>
      )}

      {!isLoading && !isError && banners.length === 0 && (
        <p className="text-sm text-muted-foreground">Hozircha banner mavjud emas.</p>
      )}

      {!isLoading && !isError && banners.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Card key={banner._id} className="overflow-hidden p-0">
              <div className="flex aspect-video items-center justify-center bg-muted">
                {banner.image ? (
                  <img
                    src={getImageUrl(banner.image)}
                    alt={banner.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageOff className="size-8 text-muted-foreground/30" />
                )}
              </div>
              <div className="flex items-center justify-between p-3">
                <p className="line-clamp-1 text-sm font-medium">{banner.title || "(sarlavhasiz)"}</p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => openEditDialog(banner)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    disabled={isDeleting}
                    onClick={() => handleDelete(banner._id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
