import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetAllCategoriesQuery } from "@/store/api/categoryApi";
import {
  useCreateProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/store/api/productApi";
import { useUploadFileMutation } from "@/store/api/uploadApi";
import { extractUploadPath, getApiErrorMessage } from "@/lib/auth";
import { getImageUrl } from "@/lib/utils";

const getInitialFormData = (product) => {
  if (!product) {
    return {
      title: "",
      slug: "",
      description: "",
      brand: "",
      price: "",
      discount: "",
      stock: "",
      category: "",
      images: [],
    };
  }

  let categoryId = "";

  if (typeof product.category === "string") {
    categoryId = product.category;
  } else if (product.category?._id) {
    categoryId = product.category._id;
  }

  return {
    title: product.title || "",
    slug: product.slug || "",
    description: product.description || "",
    brand: product.brand || "",
    price: product.price?.toString() || "",
    discount: product.discount?.toString() || "",
    stock: product.stock?.toString() || "",
    category: categoryId,
    images: product.images || [],
  };
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id) && id !== "new";

  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetSingleProductQuery(id, {
    skip: !isEdit,
  });

  const product = productData?.data;

  const [formData, setFormData] = useState(() =>
    getInitialFormData(product)
  );

  const {
    data: categoryData,
    isLoading: isCategoriesLoading,
  } = useGetAllCategoriesQuery();

  const categories = categoryData?.data ?? [];

  const [createProduct, { isLoading: isCreating }] =
    useCreateProductMutation();

  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductMutation();

  const [uploadFile, { isLoading: isUploading }] =
    useUploadFileMutation();

  const isSaving = isCreating || isUpdating;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (value) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    try {
      const uploadedImages = [];

      for (const file of files) {
        const result = await uploadFile(file).unwrap();
        const imageUrl = extractUploadPath(result);

        if (imageUrl) {
          uploadedImages.push(imageUrl);
        }
      }

      if (uploadedImages.length > 0) {
        setFormData({
          ...formData,
          images: formData.images.concat(uploadedImages),
        });
      } else {
        alert("Rasm yuklandi, lekin yo'li olinmadi. Qaytadan urinib ko'ring.");
      }
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      alert(getApiErrorMessage(error, "Rasm yuklashda xatolik yuz berdi"));
    }

    event.target.value = "";
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter(
        (_, imageIndex) => imageIndex !== index
      ),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      alert("Mahsulot nomini kiriting");
      return;
    }

    if (!formData.slug.trim()) {
      alert("Slug kiriting");
      return;
    }

    if (!formData.category) {
      alert("Kategoriyani tanlang");
      return;
    }

    if (!formData.price) {
      alert("Mahsulot narxini kiriting");
      return;
    }

    const productBody = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      discount: Number(formData.discount || 0),
      category: formData.category,
      brand: formData.brand.trim(),
      images: formData.images,
      stock: Number(formData.stock || 0),
      isActive: true,
    };

    console.log("PRODUCT BODY:", productBody);

    try {
      if (isEdit) {
        await updateProduct({
          id,
          body: productBody,
        }).unwrap();
      } else {
        await createProduct(productBody).unwrap();
      }

      navigate("/products");
    } catch (error) {
      console.error("PRODUCT ERROR:", error);
      console.error("STATUS:", error?.status);
      console.error("ERROR DATA:", error?.data);

      alert(getApiErrorMessage(error, "Mahsulotni saqlashda xatolik yuz berdi"));
    }
  };

  if (isEdit && isProductLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Mahsulot yuklanmoqda...
          </p>
        </Card>
      </div>
    );
  }

  if (isEdit && isProductError) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card className="p-6">
          <p className="text-sm text-destructive">
            Mahsulotni yuklashda xatolik yuz berdi.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/products">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>

        <h1 className="text-xl font-semibold">
          {isEdit
            ? "Mahsulotni tahrirlash"
            : "Yangi mahsulot"}
        </h1>
      </div>

      <Card className="p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Mahsulot nomi
            </label>

            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masalan: iPhone 15 Pro"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Slug
            </label>

            <Input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="iphone-15-pro"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mahsulot haqida ma'lumot"
              rows={5}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Brand
              </label>

              <Input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Apple"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category
              </label>

              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
                disabled={isCategoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isCategoriesLoading
                        ? "Kategoriyalar yuklanmoqda..."
                        : "Kategoriyani tanlang"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat._id}
                      value={cat._id}
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Narx
              </label>

              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="12000000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Chegirma (%)
              </label>

              <Input
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Stock
              </label>

              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="25"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">
              Rasmlar
            </label>

            <label
              htmlFor="product-images"
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center hover:bg-muted/50"
            >
              <UploadCloud className="mb-2 size-8 text-muted-foreground" />

              <span className="text-sm font-medium">
                {isUploading
                  ? "Rasm yuklanmoqda..."
                  : "Rasm tanlash uchun bosing"}
              </span>

              <span className="mt-1 text-xs text-muted-foreground">
                JPG, PNG yoki WEBP
              </span>
            </label>

            <input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading}
            />

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {formData.images.map((image, index) => {
                  const imageSrc = getImageUrl(image);

                  return (
                    <div
                      key={`${image}-${index}`}
                      className="relative overflow-hidden rounded-lg border"
                    >
                      <img
                        src={imageSrc}
                        alt={`Product ${index + 1}`}
                        className="h-32 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <Link to="/admin/products">
                Bekor qilish
              </Link>
            </Button>

            <Button
              type="submit"
              disabled={isSaving || isUploading}
            >
              {isSaving
                ? "Saqlanmoqda..."
                : isEdit
                  ? "Saqlash"
                  : "Mahsulot yaratish"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}