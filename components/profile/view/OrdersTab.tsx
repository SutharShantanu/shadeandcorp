"use client";

import { useState } from "react";
import { Package, ShoppingBag, Calendar, DollarSign, Eye, Truck, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { IconBadge } from "@/components/ui/icon-badge";
import { format } from "date-fns";

interface OrdersTabProps {
  userProfile: UserProfile | null;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: number;
  trackingNumber?: string;
}

// Mock data - in a real app, this would come from an API
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 129.99,
    items: 3,
    trackingNumber: "TRK123456789",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-01-20",
    status: "shipped",
    total: 89.50,
    items: 2,
    trackingNumber: "TRK987654321",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "2024-01-25",
    status: "processing",
    total: 249.99,
    items: 1,
  },
];

const statusColors = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersTab({ userProfile }: OrdersTabProps) {
  const [orders] = useState<Order[]>(mockOrders);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Order History</h3>
        <p className="text-sm text-muted-foreground mb-4">
          View and track all your orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Button>Start Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Order {order.orderNumber}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <IconBadge variant="default" size="sm">
                        <Calendar className="size-3 text-muted-foreground" />
                      </IconBadge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(order.date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconBadge variant="default" size="sm">
                      <Tag className="size-3 text-muted-foreground" />
                    </IconBadge>
                    <Badge className={statusColors[order.status]}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="size-4" />
                      <span>{order.items} {order.items === 1 ? "item" : "items"}</span>
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Truck className="size-4" />
                        <span>Tracking: {order.trackingNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <DollarSign className="size-4" />
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="size-4 mr-2" />
                      View Details
                    </Button>
                    {order.status === "shipped" && (
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

