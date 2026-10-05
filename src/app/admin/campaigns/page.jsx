"use client";

import withPermission from "@/hoc/WithPermission";
import { CampaignAdminScreen } from "@/features/campaigns";

function CampaignsPage() {
  return <CampaignAdminScreen />;
}

export default withPermission(CampaignsPage, ["admin"]);
