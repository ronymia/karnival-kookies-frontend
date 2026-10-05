"use client";

import withPermission from "@/hoc/WithPermission";
import { CouponCodeAdminScreen } from "@/features/coupon-codes";

function CouponCodesPage() {
  return <CouponCodeAdminScreen />;
}

export default withPermission(CouponCodesPage, ["admin"]);
