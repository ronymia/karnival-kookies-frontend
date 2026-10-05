"use client";

import { ProductAdminScreen } from "@/features/products";
import withPermission from "@/hoc/WithPermission";

function ProductPage() {
  return <ProductAdminScreen />;
}

export default withPermission(ProductPage, ["admin"]);
