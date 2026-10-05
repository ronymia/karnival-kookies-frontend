"use client";

import withPermission from "@/hoc/WithPermission";
import { UserAdminScreen } from "@/features/users";

function UserPage() {
  return <UserAdminScreen />;
}

export default withPermission(UserPage, ["admin"]);
