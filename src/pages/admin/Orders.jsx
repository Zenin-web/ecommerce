import { Link } from "react-router-dom";
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

import {
useGetAllOrdersAdminQuery,
useUpdateOrderStatusMutation,
} from "@/store/api/orderApi/orderApi";

import { orderStatusLabels } from "@/constants/orders";
import { formatPrice } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/auth";

export default function AdminOrders() {
const {
data: ordersData,
isLoading,
isError,
} = useGetAllOrdersAdminQuery();

const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
useUpdateOrderStatusMutation();

const orders = ordersData?.data ?? [];

const handleStatusChange = async (orderId, status) => {
try {
await updateOrderStatus({
id: orderId,
body: {
status,
},
}).unwrap();
toast.success("Buyurtma holati yangilandi");
} catch (error) {
console.error("ORDER STATUS ERROR:", error);
toast.error(getApiErrorMessage(error, "Buyurtma holatini yangilashda xatolik yuz berdi"));
}
};

if (isLoading) {
return (
<div className="flex items-center justify-center py-20 text-muted-foreground">
Buyurtmalar yuklanmoqda...
</div>
);
}

if (isError) {
return (
<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
<p className="font-medium text-destructive">
Buyurtmalarni yuklashda xatolik yuz berdi.
</p>
    <p className="mt-1 text-sm text-muted-foreground">
      Backend ishlayotganini tekshirib ko'ring.
    </p>
  </div>
);
}

if (orders.length === 0) {
return (
<div className="flex items-center justify-center py-20 text-muted-foreground">
Hozircha buyurtmalar mavjud emas.
</div>
);
}

return (
<Card className="overflow-x-auto p-0">
<table className="w-full text-sm">
<thead className="border-b bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
<tr>
<th className="px-4 py-3 font-medium">Buyurtma</th>
<th className="px-4 py-3 font-medium">Mijoz</th>
<th className="px-4 py-3 font-medium">Sana</th>
<th className="px-4 py-3 font-medium">Mahsulotlar</th>
<th className="px-4 py-3 font-medium">Jami</th>
<th className="px-4 py-3 font-medium">Holat</th>
</tr>
</thead>

    <tbody>
      {orders.map((order) => {
        const status = orderStatusLabels[order.status];

        return (
          <tr
            key={order._id}
            className="border-b last:border-0 hover:bg-secondary/30"
          >
            <td className="px-4 py-3 font-medium">
              <Link
                to={`/orders/${order._id}`}
                className="hover:underline"
              >
                #{order._id.toUpperCase()}
              </Link>
            </td>

            <td className="px-4 py-3">
              <p className="font-medium">{order.user?.name || order.address?.fullName || "Noma'lum"}</p>
              <p className="text-xs text-muted-foreground">{order.address?.phone || order.user?.phone || ""}</p>
            </td>

            <td className="px-4 py-3 text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
            </td>

            <td className="px-4 py-3 text-muted-foreground">
              {order.items?.length ?? 0} ta mahsulot
            </td>

            <td className="px-4 py-3 font-medium">
              {formatPrice(order.totalPrice)}
            </td>

            <td className="px-4 py-3">
              <Select
                defaultValue={order.status}
                disabled={isUpdatingStatus}
                onValueChange={(status) => {
                  handleStatusChange(order._id, status);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue>
                    {status ? (
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    ) : (
                      order.status
                    )}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {Object.entries(orderStatusLabels).map(
                    ([value, { label }]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</Card>
);
}
