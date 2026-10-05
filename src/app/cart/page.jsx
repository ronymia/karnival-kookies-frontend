"use client";

import withPermission from "@/hoc/WithPermission";
import { CartScreen } from "@/features/cart";

function CartPage() {
  return <CartScreen />;
}

export default withPermission(CartPage, ["customer"]);
