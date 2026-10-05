"use client";

import withPermission from "@/hoc/WithPermission";
import { MetaDataAdminScreen } from "@/features/meta-data";

function MetaDataPage() {
  return <MetaDataAdminScreen />;
}

export default withPermission(MetaDataPage, ["admin"]);
