import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ProductCard } from "@/components/shared/ProductCard";
import { mockCategories, mockProducts } from "@/data/mockData";

function FiltersPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Kategoriya</h3>
        <div className="flex flex-col gap-2">
          {mockCategories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-3.5 accent-primary" />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold">Narx oralig'i</h3>
        <div className="flex items-center gap-2">
          <Input placeholder="Dan" type="number" />
          <span className="text-muted-foreground">—</span>
          <Input placeholder="Gacha" type="number" />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold">Brend</h3>
        <div className="flex flex-col gap-2">
          {["Apple", "Samsung", "Xiaomi", "Nike", "JBL"].map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-3.5 accent-primary" />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <Button className="w-full">Filtrlash</Button>
    </div>
  );
}

export default function Catalog() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Katalog</h1>
          <p className="text-sm text-muted-foreground">{mockProducts.length} ta mahsulot topildi</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal className="size-4" />
            Filtrlar
          </Button>

          <Select defaultValue="new">
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Yangi kelganlar</SelectItem>
              <SelectItem value="cheap">Arzon narx bo'yicha</SelectItem>
              <SelectItem value="expensive">Qimmat narx bo'yicha</SelectItem>
              <SelectItem value="rating">Reyting bo'yicha</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <Card className="hidden h-fit p-4 lg:block">
          <FiltersPanel />
        </Card>

        {showFilters && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="relative ml-auto flex h-full w-72 flex-col overflow-y-auto bg-background p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Filtrlar</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="size-5" />
                </button>
              </div>
              <FiltersPanel />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {mockProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
