import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { mockOrders, orderStatusLabels } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";

export default function Orders() {
  if (mockOrders.length === 0) {
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
        {mockOrders.map((order) => {
          const status = orderStatusLabels[order.status];

          return (
            <Card key={order._id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">Buyurtma #{order._id.toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
                  </p>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>

              <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.title} × {item.quantity}
                  </p>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="font-semibold">{formatPrice(order.totalPrice)}</p>
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
