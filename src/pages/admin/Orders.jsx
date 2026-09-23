import { Link } from "react-router-dom";

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
} from "@/store/api/orderApi";

import { orderStatusLabels } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";

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
} catch (error) {
console.error("ORDER STATUS ERROR:", error);
}
};

if (isLoading) {
return (
<Card className="p-6">
Buyurtmalar yuklanmoqda...
</Card>
);
}

if (isError) {
return (
<Card className="p-6 text-destructive">
Buyurtmalarni yuklashda xatolik yuz berdi.
</Card>
);
}

if (orders.length === 0) {
return (
<Card className="p-6">
Hozircha buyurtmalar mavjud emas.
</Card>
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