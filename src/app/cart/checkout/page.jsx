"use client";

import withPermission from "@/hoc/WithPermission";
import { CheckoutScreen } from "@/features/cart";

function CheckOutPage() {
  return <CheckoutScreen />;
}

export default withPermission(CheckOutPage, ["customer"]);
