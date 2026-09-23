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
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/store/api/categoryApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { extractUploadPath, getApiErrorMessage } from "@/lib/auth";
import { getImageUrl } from "@/lib/utils";

export default function AdminCategories() {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");

  const { data, isLoading, isError } = useGetAllCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const categories = data?.data ?? [];

  const isSaving = isCreating || isUpdating;

  const resetForm = () => {
    setName("");
    setSlug("");
    setImage("");
    setEditingCategory(null);
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

  const closeDialog = () => {
    setOpen(false);
    resetForm();
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      return;
    }

    try {
      await createCategory({
        name: name.trim(),
        slug: slug.trim(),
        image: image || undefined,
      }).unwrap();

      toast.success("Kategoriya qo'shildi");
      closeDialog();
    } catch (error) {
      console.error("Kategoriya yaratishda xato:", error);
      toast.error(getApiErrorMessage(error, "Kategoriya yaratishda xatolik yuz berdi"));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim() || !editingCategory) {
      return;
    }

    try {
      await updateCategory({
        id: editingCategory._id,
        body: {
          name: name.trim(),
          slug: slug.trim(),
          image: image || undefined,
        },
      }).unwrap();

      toast.success("Kategoriya yangilandi");
      closeDialog();
    } catch (error) {
      console.error("Kategoriya yangilashda xato:", error);
      toast.error(getApiErrorMessage(error, "Kategoriya yangilashda xatolik yuz berdi"));
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Bu kategoriyani o'chirishni xohlaysizmi?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCategory(id).unwrap();
      toast.success("Kategoriya o'chirildi");
    } catch (error) {
      console.error("Kategoriya o'chirishda xato:", error);
      toast.error(getApiErrorMessage(error, "Kategoriya o'chirishda xatolik yuz berdi. Unga bog'liq mahsulotlar bo'lishi mumkin."));
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setImage(category.image || "");
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {categories.length} ta kategoriya
        </p>

        <Dialog
          open={open}
          onOpenChange={(value) => {
            if (!value) {
              closeDialog();
            } else {
              setOpen(true);
            }
          }}
        >
          {!editingCategory && (
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="size-4" />
                Yangi kategoriya
              </Button>
            </DialogTrigger>
          )}

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory
                  ? "Kategoriyani tahrirlash"
                  : "Yangi kategoriya qo'shish"}
              </DialogTitle>
            </DialogHeader>

            <form
              className="flex flex-col gap-4"
              onSubmit={editingCategory ? handleUpdate : handleCreate}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-name">Nomi</Label>

                <Input
                  id="category-name"
                  placeholder="Masalan: Elektronika"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-slug">Slug</Label>

                <Input
                  id="category-slug"
                  placeholder="masalan: elektronika"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-image">Rasm (ixtiyoriy)</Label>

                <div className="flex items-center gap-3">
                  {image ? (
                    <img
                      src={getImageUrl(image)}
                      alt="Kategoriya rasmi"
                      className="size-12 rounded-md border object-cover"
                    />
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-md border border-dashed text-muted-foreground/40">
                      <ImageOff className="size-4" />
                    </div>
                  )}

                  <Input
                    id="category-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSaving || isUploading}
                  />

                  {isUploading && <Loader2 className="size-4 animate-spin" />}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  disabled={isSaving}
                >
                  Bekor qilish
                </Button>

                <Button type="submit" disabled={isSaving}>
                  {isSaving
                    ? "Saqlanmoqda..."
                    : editingCategory
                    ? "Saqlash"
                    : "Qo'shish"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Kategoriyalar yuklanmoqda...
        </p>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Kategoriyalarni yuklashda xatolik yuz berdi.
        </p>
      )}

      {!isLoading && !isError && categories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Hozircha kategoriya mavjud emas.
        </p>
      )}

      {!isLoading && !isError && categories.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat._id} className="flex-row items-center gap-3 p-4">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {cat.image ? (
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageOff className="size-5 text-muted-foreground/40" />
                )}
              </div>

              <div className="flex-1">
                <p className="font-medium">{cat.name}</p>

                <p className="text-xs text-muted-foreground">
                  /{cat.slug}
                </p>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => openEditDialog(cat)}
                  disabled={isDeleting}
                >
                  <Pencil className="size-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(cat._id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}