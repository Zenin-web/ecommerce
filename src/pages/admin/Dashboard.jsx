import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminStatsQuery } from "@/store/api/orderApi";
import { formatPrice } from "@/lib/utils";

const orderStatusLabels = {
  pending: { label: "Kutilmoqda", variant: "outline" },
  processing: { label: "Tayyorlanmoqda", variant: "secondary" },
  shipped: { label: "Jo'natildi", variant: "default" },
  delivered: { label: "Yetkazildi", variant: "success" },
  cancelled: { label: "Bekor qilindi", variant: "destructive" },
};

export default function Dashboard() {
  const { data, isLoading, isError } = useGetAdminStatsQuery();
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <Card className="p-6 text-destructive">
        Statistikani yuklashda xatolik yuz berdi. Backend ishlayotganini tekshiring.
      </Card>
    );
  }

  const cards = [
    {
      label: "Umumiy savdo",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
    },
    {
      label: "Buyurtmalar",
      value: stats.totalOrders,
      icon: ShoppingCart,
    },
    {
      label: "Mahsulotlar",
      value: stats.totalProducts,
      icon: Package,
    },
    {
      label: "Foydalanuvchilar",
      value: stats.totalUsers,
      icon: Users,
    },
  ];

  // Oxirgi 14 kunlik savdo grafigi uchun eng katta qiymatga nisbatan foiz
  const salesDays = stats.salesLast14Days || [];
  const maxSale = Math.max(1, ...salesDays.map((d) => d.total));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Savdo dinamikasi</h3>
            <Badge variant="secondary">Oxirgi 14 kun</Badge>
          </div>

          {salesDays.length === 0 ? (
            <p className="flex h-56 items-center justify-center text-sm text-muted-foreground">
              Bu davrda savdo mavjud emas.
            </p>
          ) : (
            <div className="flex h-56 items-end justify-between gap-2">
              {salesDays.map((day) => (
                <div
                  key={day._id}
                  className="group relative flex-1 rounded-t-md bg-primary/70 transition-all hover:bg-primary"
                  style={{ height: `${Math.max(4, (day.total / maxSale) * 100)}%` }}
                  title={`${day._id}: ${formatPrice(day.total)}`}
                />
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-semibold">So'nggi buyurtmalar</h3>
          <div className="flex flex-col gap-3">
            {(stats.recentOrders || []).length === 0 && (
              <p className="text-sm text-muted-foreground">Hozircha buyurtmalar mavjud emas.</p>
            )}
            {(stats.recentOrders || []).map((order) => {
              const status = orderStatusLabels[order.status];
              return (
                <div key={order._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{order.user?.name || "Noma'lum"}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(order.totalPrice)}</p>
                  </div>
                  {status ? (
                    <Badge variant={status.variant}>{status.label}</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">{order.status}</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
