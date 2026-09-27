import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockOrders, orderStatusLabels } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";

const steps = ["pending", "processing", "shipped", "delivered"];

export default function OrderDetail() {
  const { id } = useParams();
  const order = mockOrders.find((o) => o._id === id) || mockOrders[0];
  const status = orderStatusLabels[order.status];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/orders">
          <ArrowLeft className="size-4" />
          Buyurtmalarga qaytish
        </Link>
      </Button>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Buyurtma #{order._id.toUpperCase()}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
            </p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        {order.status !== "cancelled" && (
          <div className="mt-6 flex items-center">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-1 items-center last:flex-none">
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    i <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <Separator className="my-5" />

        <div className="flex flex-col gap-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Separator className="my-5" />

        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Yetkazib berish manzili</p>
            <p className="text-muted-foreground">Chilonzor tumani, 12-uy, Toshkent</p>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm">
          <CreditCard className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="font-medium">To'lov usuli</p>
            <p className="text-muted-foreground">Naqd pul</p>
          </div>
        </div>

        <Separator className="my-5" />

        <div className="flex justify-between text-base font-semibold">
          <span>Jami</span>
          <span>{formatPrice(order.totalPrice)}</span>
        </div>
      </Card>
    </div>
  );
}
