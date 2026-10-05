"use client";

import withPermission from "@/hoc/WithPermission";
import { OrderAdminScreen } from "@/features/orders";

function OrderPage() {
  return <OrderAdminScreen />;
}

export default withPermission(OrderPage, ["admin"]);
