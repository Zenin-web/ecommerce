import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { orderStatusLabels } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";
import { useGetMyOrdersQuery } from "@/store/api/orderApi/orderApi";
import { useAuth } from "@/hooks/useAuth";

const fallbackStatus = { label: "Kutilmoqda", variant: "secondary" };

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const { data: ordersResponse, isLoading, isError } = useGetMyOrdersQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon={Package}
        title="Buyurtmalarni ko'rish uchun tizimga kiring"
        description="Buyurtmalar tarixi shaxsiy hisobingizga bog'liq"
        actionLabel="Kirish"
        actionLink="/login"
      />
    );
  }

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">Buyurtmalar yuklanmoqda...</p>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Ma'lumotlarni yuklashda xatolik yuz berdi
      </p>
    );
  }

  const orders = ordersResponse?.data || [];

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Buyurtmalar yo'q"
        description="Siz hali birorta ham buyurtma bermagansiz"
        actionLabel="Xarid qilishni boshlash"
        actionLink="/catalog"
      />
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Buyurtmalarim</h1>

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const status = orderStatusLabels[order.status] || fallbackStatus;
          const items = order.items || order.products || [];

          return (
            <Card key={order._id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">
                    Buyurtma #{(order._id || "").toString().slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("uz-UZ")
                      : ""}
                  </p>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>

              <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
                {items.map((item, i) => (
                  <p key={i}>
                    {item.title || item.product?.title} × {item.quantity}
                  </p>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="font-semibold">{formatPrice(order.totalPrice || order.total || 0)}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/orders/${order._id}`}>Batafsil</Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
