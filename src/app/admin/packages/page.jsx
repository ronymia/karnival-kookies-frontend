"use client";

import withPermission from "@/hoc/WithPermission";
import { PackageAdminScreen } from "@/features/packages";

function PackagePage() {
  return <PackageAdminScreen />;
}

export default withPermission(PackagePage, ["admin"]);
