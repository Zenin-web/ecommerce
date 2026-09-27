import { useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, ImageOff, Minus, Plus, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/shared/StarRating";
import { ProductCard } from "@/components/shared/ProductCard";
import { QuantityInput } from "@/components/shared/QuantityInput";
import { mockProducts } from "@/data/mockData";
import { cn, formatPrice, getDiscountedPrice } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const product = mockProducts.find((p) => p._id === id) || mockProducts[0];
  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const related = mockProducts.filter((p) => p._id !== product._id).slice(0, 4);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted">
            <ImageOff className="size-16 text-muted-foreground/30" />
          </div>
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "flex size-16 items-center justify-center rounded-lg border bg-muted",
                  activeImage === i && "border-primary ring-1 ring-primary",
                )}
              >
                <ImageOff className="size-5 text-muted-foreground/30" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
            <h1 className="mt-2 text-2xl font-semibold">{product.title}</h1>
            <div className="mt-2">
              <StarRating rating={product.rating} count={product.numReviews} />
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(finalPrice)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge variant="destructive">-{product.discount}%</Badge>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {product.stock > 0 ? (
              <span className="text-success font-medium">✓ Omborda mavjud ({product.stock} dona)</span>
            ) : (
              <span className="text-destructive font-medium">Omborda yo'q</span>
            )}
          </p>

          <Separator />

          <div className="flex items-center gap-3">
            <QuantityInput value={quantity} onChange={setQuantity} />
            <Button size="lg" className="flex-1">
              <ShoppingCart className="size-4" />
              Savatchaga qo'shish
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="size-4" />
            </Button>
          </div>

          <Button size="lg" variant="secondary" className="w-full">
            Hoziroq sotib olish
          </Button>

          <div className="mt-2 flex flex-col gap-3 rounded-lg border p-4 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-primary" />
              Toshkent bo'ylab 1-2 kunda yetkazib berish
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Original mahsulot, rasmiy kafolat bilan
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: description / attributes / reviews */}
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Tavsif</TabsTrigger>
          <TabsTrigger value="attributes">Xususiyatlar</TabsTrigger>
          <TabsTrigger value="reviews">Sharhlar ({product.numReviews})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="pt-4 text-sm leading-relaxed text-muted-foreground">
          {product.title} — yuqori sifatli mahsulot bo'lib, kundalik foydalanish uchun juda qulay.
          Zamonaviy dizayn va ishonchli qurilma bilan uzoq muddat xizmat qiladi. Bu matn UI namunasi
          uchun yozilgan, real tavsif backend orqali keladi.
        </TabsContent>

        <TabsContent value="attributes" className="pt-4">
          <div className="grid max-w-md grid-cols-1 gap-2 text-sm">
            {[
              ["Brend", product.brand],
              ["Kategoriya", "Elektronika"],
              ["Kafolat", "12 oy"],
              ["Ishlab chiqarilgan mamlakat", "Xitoy"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="flex flex-col gap-4 pt-4">
          {[
            { name: "Aziz K.", rating: 5, comment: "Juda zo'r mahsulot, tavsiya qilaman!" },
            { name: "Malika Y.", rating: 4, comment: "Sifatli, lekin yetkazib berish biroz kechikdi." },
          ].map((review, i) => (
            <div key={i} className="flex gap-3 border-b pb-4">
              <Avatar fallback={review.name[0]} />
              <div>
                <p className="text-sm font-medium">{review.name}</p>
                <StarRating rating={review.rating} showValue={false} size={12} />
                <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Related products */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">O'xshash mahsulotlar</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
