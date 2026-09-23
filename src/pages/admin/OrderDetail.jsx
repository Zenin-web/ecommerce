import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useGetSingleOrderQuery, useUpdateOrderStatusMutation } from "@/store/api/orderApi";
import { orderStatusLabels } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/auth";

export default function OrderDetail() {
  const { id } = useParams();

  const {
    data: orderData,
    isLoading,
    isError,
  } = useGetSingleOrderQuery(id);

  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();

  const order = orderData?.data;

  const handleStatusChange = async (status) => {
    try {
      await updateOrderStatus({ id, body: { status } }).unwrap();
      toast.success("Holat yangilandi");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Holatni yangilashda xatolik yuz berdi"));
    }
  };

  if (isLoading) {
    return <Card className="p-6">Buyurtma yuklanmoqda...</Card>;
  }

  if (isError || !order) {
    return <Card className="p-6 text-destructive">Buyurtmani yuklashda xatolik yuz berdi.</Card>;
  }

  const status = orderStatusLabels[order.status];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Buyurtma #{order._id}</h1>
          <p className="text-muted-foreground">Buyurtma tafsilotlari</p>
        </div>

        <Select
          defaultValue={order.status}
          disabled={isUpdatingStatus}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-44">
            <SelectValue>
              {status ? <Badge variant={status.variant}>{status.label}</Badge> : order.status}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(orderStatusLabels).map(([value, { label }]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Buyurtma ID</p>
            <p className="font-medium">{order._id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Sana</p>
            <p className="font-medium">
              {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Holat</p>
            {status ? (
              <Badge variant={status.variant}>{status.label}</Badge>
            ) : (
              <span>{order.status}</span>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Mijoz</h2>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Ism: </span>{order.user?.name || order.address?.fullName || "-"}</p>
            <p><span className="text-muted-foreground">Email: </span>{order.user?.email || "-"}</p>
            <p><span className="text-muted-foreground">Telefon: </span>{order.address?.phone || order.user?.phone || "-"}</p>
            <p><span className="text-muted-foreground">To'lov turi: </span>{order.paymentMethod || "-"}</p>
            <p><span className="text-muted-foreground">To'langan: </span>{order.isPaid ? "Ha" : "Yo'q"}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Yetkazib berish manzili</h2>
          {order.address ? (
            <div className="space-y-1 text-sm">
              <p>{order.address.fullName}</p>
              <p className="text-muted-foreground">{order.address.phone}</p>
              <p className="text-muted-foreground">
                {[order.address.region, order.address.district, order.address.street]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Manzil kiritilmagan.</p>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Mahsulotlar</h2>

        <div className="space-y-4">
          {order.items?.map((item, index) => (
            <div
              key={item._id || index}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.quantity} dona</p>
              </div>
              <p className="font-medium">{formatPrice(item.price)}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Jami</span>
          <span className="text-xl font-bold">{formatPrice(order.totalPrice)}</span>
        </div>
      </Card>
    </div>
  );
}
