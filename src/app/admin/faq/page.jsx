"use client";

import withPermission from "@/hoc/WithPermission";
import { FaqAdminScreen } from "@/features/faq";

function FaqPage() {
  return <FaqAdminScreen />;
}

export default withPermission(FaqPage, ["admin"]);
