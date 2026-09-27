import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, RotateCcw, ImageOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { getBanners } from "@/services/api";
import { useGetAllCategoriesQuery } from "@/store/api/categoryApi/categoryApi";
import { useGetAllProductsQuery } from "@/store/api/productApi/productApi";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
  } = useGetAllCategoriesQuery();

  const categories = categoriesResponse?.data || [];

  const {
    data: productsResponse,
    isLoading: loadingProducts,
  } = useGetAllProductsQuery();

  const products = productsResponse?.data || [];

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getBanners();

        const bannerList = response?.data || [];
        setBanners(bannerList);
      } catch (error) {
        console.error("Bannerlarni olishda xatolik:", error);
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {/* Hero banner */}
      <section className="grid gap-4 sm:grid-cols-3">
        {loadingBanners ? (
          <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-secondary sm:col-span-2 sm:aspect-[21/9]">
            <p className="text-muted-foreground">
              Bannerlar yuklanmoqda...
            </p>
          </div>
        ) : banners.length > 0 ? (
          <>
            <Link
              to={banners[0].link || "#"}
              className="relative flex aspect-[16/9] items-end overflow-hidden rounded-xl bg-secondary sm:col-span-2 sm:aspect-[21/9]"
            >
              {banners[0].image ? (
                <img
                  src={banners[0].image}
                  alt={banners[0].title}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <ImageOff className="absolute right-6 top-6 size-16 text-muted-foreground/30" />
              )}

              <div className="absolute inset-0 bg-black/30" />

              <div className="relative z-10 p-6 text-white">
                <p className="text-sm font-medium">
                  {banners[0].title}
                </p>
              </div>
            </Link>

            <div className="flex flex-col gap-4">
              {banners.slice(1).map((banner) => (
                <Link
                  key={banner._id}
                  to={banner.link || "#"}
                  className="relative flex flex-1 items-end overflow-hidden rounded-xl bg-secondary p-4"
                >
                  {banner.image ? (
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    <ImageOff className="absolute right-4 top-4 size-8 text-muted-foreground/30" />
                  )}

                  <div className="absolute inset-0 bg-black/30" />

                  <p className="relative z-10 text-sm font-semibold text-white">
                    {banner.title}
                  </p>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-secondary sm:col-span-2 sm:aspect-[21/9]">
            <p className="text-muted-foreground">
              Banner mavjud emas
            </p>
          </div>
        )}
      </section>

      {/* Perks */}
      <section className="grid grid-cols-1 gap-4 rounded-xl border bg-card p-4 sm:grid-cols-3">
        {[
          {
            icon: Truck,
            title: "Tez yetkazib berish",
            desc: "Toshkent bo'ylab 1 kunda",
          },
          {
            icon: ShieldCheck,
            title: "Kafolatlangan sifat",
            desc: "Original mahsulotlar",
          },
          {
            icon: RotateCcw,
            title: "Oson qaytarish",
            desc: "14 kun ichida qaytarish",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>

            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section>
        <SectionTitle
          title="Kategoriyalar"
          viewAllLink="/catalog"
        />

        {loadingCategories ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Kategoriyalar yuklanmoqda...
          </div>
        ) : categories.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Kategoriyalar mavjud emas
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/catalog?category=${cat.slug}`}
              >
                <Card className="flex aspect-square flex-col items-center justify-center gap-2 p-3 text-center transition-colors hover:border-primary">
                  <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                    <ImageOff className="size-5 text-muted-foreground/50" />
                  </div>

                  <span className="line-clamp-2 text-xs font-medium">
                    {cat.name}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      <section>
        <SectionTitle
          title="Tavsiya etilgan mahsulotlar"
          viewAllLink="/catalog"
        />

        {loadingProducts ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Mahsulotlar yuklanmoqda...
          </div>
        ) : products.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Mahsulotlar mavjud emas
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      {/* Discounted products */}
      <section>
        <SectionTitle
          title="Chegirmadagi mahsulotlar"
          viewAllLink="/catalog"
        />

        {loadingProducts ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Mahsulotlar yuklanmoqda...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products
              .filter((product) => product.discount > 0)
              .map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}