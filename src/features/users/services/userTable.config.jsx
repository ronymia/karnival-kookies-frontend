import React from "react";
import { FiCheckCircle, FiXCircle, FiPhone, FiMapPin } from "react-icons/fi";
import { UserService } from "./userService";

export const USER_TABLE_COLUMNS = [
  {
    header: "#",
    accessorKey: "count",
    minWidth: 5,
    show: true,
    isMainField: true,
  },
  {
    header: "USER ACCOUNT",
    accessorKey: "user_display",
    minWidth: 35,
    show: true,
    isMainField: true,
  },
  {
    header: "CONTACT & LOCATION",
    accessorKey: "contact_display",
    minWidth: 30,
    show: true,
  },
  {
    header: "ASSIGNED ROLE",
    accessorKey: "role_badge",
    minWidth: 18,
    show: true,
  },
  {
    header: "EMAIL VERIFIED",
    accessorKey: "verified_badge",
    minWidth: 15,
    show: true,
  },
];

/**
 * Formats raw user records into rich table rows.
 */
export function formatUserRows(users = [], currentPage = 1, pageSize = 10) {
  if (!Array.isArray(users)) return [];

  return users.map((u, idx) => {
    const displayName = u.profile?.name || u.name || "Anonymous User";
    const email = u.email || "No email";
    const phone = u.profile?.phone || u.phone || "No phone";
    const city = u.profile?.city || "";
    const country = u.profile?.country || "";
    const location = [city, country].filter(Boolean).join(", ") || "Location not set";

    const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const isVerified = Boolean(u.is_email_verified);

    // Dynamic Role Color Classes
    let roleClasses = "bg-primary/10 text-primary border-primary/25";
    switch (u.role) {
      case "super_admin":
        roleClasses = "bg-amber-500/15 text-amber-300 border-amber-500/30";
        break;
      case "admin":
        roleClasses = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
        break;
      case "manager":
        roleClasses = "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
        break;
      case "product_manager":
        roleClasses = "bg-purple-500/15 text-purple-300 border-purple-500/30";
        break;
      case "order_manager":
        roleClasses = "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
        break;
      case "marketing_manager":
        roleClasses = "bg-pink-500/15 text-pink-300 border-pink-500/30";
        break;
      case "content_editor":
        roleClasses = "bg-teal-500/15 text-teal-300 border-teal-500/30";
        break;
      case "customer_support":
        roleClasses = "bg-sky-500/15 text-sky-300 border-sky-500/30";
        break;
      case "analyst":
        roleClasses = "bg-orange-500/15 text-orange-300 border-orange-500/30";
        break;
      default:
        roleClasses = "bg-primary/10 text-primary border-primary/25";
        break;
    }

    return {
      ...u,
      count: (currentPage - 1) * pageSize + idx + 1,

      // USER AVATAR & NAME DISPLAY
      user_display: (
        <div className="flex items-center gap-3 py-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-black border border-primary/40 flex items-center justify-center font-bold text-xs text-primary shrink-0 shadow-sm">
            {initials || "U"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-white text-xs sm:text-sm truncate">
              {displayName}
            </span>
            <span className="text-[11px] text-neutral-400 truncate">
              {email}
            </span>
          </div>
        </div>
      ),

      // CONTACT & LOCATION DISPLAY
      contact_display: (
        <div className="flex flex-col gap-0.5 text-xs text-neutral-300">
          <div className="flex items-center gap-1.5">
            <FiPhone className="text-neutral-500 text-xs shrink-0" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
            <FiMapPin className="text-neutral-500 text-xs shrink-0" />
            <span className="truncate max-w-[160px]">{location}</span>
          </div>
        </div>
      ),

      // ROLE BADGE
      role_badge: (
        <div className="inline-flex">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${roleClasses} shadow-sm`}
          >
            {UserService.formatRole(u.role)}
          </span>
        </div>
      ),

      // EMAIL VERIFICATION BADGE
      verified_badge: (
        <div className="flex items-center gap-1.5">
          {isVerified ? (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <FiCheckCircle className="text-sm shrink-0" />
              <span>Verified</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-400 font-medium">
              <FiXCircle className="text-sm shrink-0 text-neutral-500" />
              <span>Unverified</span>
            </span>
          )}
        </div>
      ),
    };
  });
}
