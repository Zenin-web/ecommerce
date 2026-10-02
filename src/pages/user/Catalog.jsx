import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/shared/ProductCard";
import { Pagination } from "@/components/shared/Pagination";
import { useGetAllCategoriesQuery } from "@/store/api/categoryApi";
import { useGetAllProductsQuery } from "@/store/api/productApi";
import { buildCatalogQuery } from "@/lib/catalog";

function Filters({ categories, selected, params, onChange }) {
  const [min, setMin] = useState(params.get("minPrice") || "");
  const [max, setMax] = useState(params.get("maxPrice") || "");
  const [error, setError] = useState("");
  return <div className="space-y-6">
    <div><h3 className="mb-3 font-semibold">Kategoriya</h3>
      <label className="mb-2 flex gap-2"><input type="radio" checked={!selected} onChange={() => onChange({ category: "" })} />Barchasi</label>
      {categories.map(cat => <label key={cat._id} className="mb-2 flex gap-2 text-sm"><input type="radio" checked={selected === cat.slug || selected === cat._id} onChange={() => onChange({ category: cat.slug })} />{cat.name}</label>)}
    </div>
    <form className="space-y-2" onSubmit={e => {
      e.preventDefault();
      if (min !== "" && max !== "" && Number(min) > Number(max)) { setError("Boshlang‘ich narx oxirgi narxdan oshmasin"); return; }
      setError(""); onChange({ minPrice: min, maxPrice: max });
    }}>
      <h3 className="font-semibold">Narx oralig‘i</h3>
      <Label>Dan<Input aria-label="Minimal narx" type="number" min="0" value={min} onChange={e => setMin(e.target.value)} /></Label>
      <Label>Gacha<Input aria-label="Maksimal narx" type="number" min="0" value={max} onChange={e => setMax(e.target.value)} /></Label>
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
      <Button type="submit" variant="outline" size="sm">Qo‘llash</Button>
    </form>
  </div>;
}

export default function Catalog() {
  const [showFilters, setShowFilters] = useState(false);
  const [params, setParams] = useSearchParams();
  const { categorySlug } = useParams();
  const selected = params.has("category") ? params.get("category") : categorySlug || "";
  const { data: categoriesResponse, isLoading: loadingCategories, isError: categoriesError, refetch: refetchCategories } = useGetAllCategoriesQuery();
  const categories = (categoriesResponse?.data || []).filter(category => category.isActive !== false);
  const category = categories.find(cat => cat.slug === selected || cat._id === selected);
  const unknownCategory = Boolean(selected) && !loadingCategories && !category;
  const query = buildCatalogQuery(params, category?._id);
  const { currentData: response, isFetching, isError, refetch } = useGetAllProductsQuery(query, {
    skip: Boolean(selected) && (loadingCategories || categoriesError || unknownCategory),
  });
  const change = (updates) => {
    const next = new URLSearchParams(params);
    // Keep the effective category when using legacy /catalog/:slug links.
    if (categorySlug && !next.has("category")) next.set("category", categorySlug);
    next.delete("page");
    for (const [key, value] of Object.entries(updates)) {
      if (key === "category") next.set(key, value); // Empty explicitly clears a path category.
      else if (value === "") next.delete(key);
      else next.set(key, value);
    }
    setParams(next);
  };
  const products = response?.data || [];
  const busy = isFetching || (Boolean(selected) && loadingCategories);
  const filters = <Filters key={`${params.get("minPrice")}|${params.get("maxPrice")}`} categories={categories} selected={selected} params={params} onChange={change} />;
  return <div>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-xl font-semibold">Katalog</h1><p className="text-sm text-muted-foreground">{params.get("search") && `“${params.get("search")}” — `}{busy ? "Yuklanmoqda..." : `${unknownCategory ? 0 : response?.pagination?.total || 0} ta mahsulot`}</p></div>
      <div className="flex gap-2"><Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(true)}><SlidersHorizontal className="size-4" />Filtrlar</Button>
        <select aria-label="Saralash" className="rounded-md border bg-background p-2 text-sm" value={params.get("sort") || "new"} onChange={e => change({ sort: e.target.value })}>
          <option value="new">Yangi kelganlar</option><option value="cheap">Arzon narx bo‘yicha</option><option value="expensive">Qimmat narx bo‘yicha</option><option value="rating">Reyting bo‘yicha</option>
        </select>
      </div>
    </div>
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <Card className="hidden h-fit p-4 lg:block">{loadingCategories ? "Kategoriyalar yuklanmoqda..." : categoriesError ? <p role="alert">Kategoriyalarni yuklab bo‘lmadi</p> : filters}</Card>
      {showFilters && <div className="fixed inset-0 z-50 flex lg:hidden"><button aria-label="Filtrlarni yopish" className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} /><div className="relative ml-auto h-full w-72 space-y-4 overflow-y-auto bg-background p-4"><Button variant="ghost" size="icon" aria-label="Yopish" onClick={() => setShowFilters(false)}><X /></Button>{filters}</div></div>}
      <div>
        {busy ? <p className="py-12 text-center">Mahsulotlar yuklanmoqda...</p> : isError || (selected && categoriesError) ? <div role="alert" className="py-12 text-center"><p>Ma’lumotlarni yuklab bo‘lmadi</p><Button onClick={selected && categoriesError ? refetchCategories : refetch}>Qayta urinish</Button></div> : unknownCategory || products.length === 0 ? <p className="py-12 text-center">Mahsulotlar topilmadi</p> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{products.map(product => <ProductCard key={product._id} product={product} />)}</div>}
        {!unknownCategory && !isError && <Pagination pagination={response?.pagination} disabled={busy} onPageChange={page => { const next = new URLSearchParams(params); next.set("page", page); setParams(next); }} />}
      </div>
    </div>
  </div>;
}
