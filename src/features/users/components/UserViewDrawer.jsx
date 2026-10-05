"use client";

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { SlideOverDrawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/buttons";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { UserService } from "../services";

export default function UserViewDrawer({ isOpen, onClose, data }) {
  if (!data) return null;

  const displayName = data.profile?.name || data.name || "Anonymous User";
  const email = data.email || "No email provided";
  const phone = data.profile?.phone || data.phone || "No phone provided";
  const isVerified = Boolean(data.is_email_verified);
  const roleName = UserService.formatRole(data.role);

  const address = data.profile?.address || "Not specified";
  const city = data.profile?.city || "Not specified";
  const country = data.profile?.country || "Not specified";
  const postcode = data.profile?.postcode || "Not specified";
  const gender = data.profile?.gender || "Not specified";
  const dob = data.profile?.date_of_birth || "Not specified";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="User Account Profile"
      description="Inspect account details, verified contact channels, and system activity."
      size="xl"
    >
      <div className="flex flex-col h-full justify-between gap-6 pb-6">
        <div className="space-y-6">
          {/* PROFILE SUMMARY CARD */}
          <div className="p-5 rounded-2xl bg-white/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-black border border-primary/40 flex items-center justify-center font-bold text-lg text-primary shrink-0 shadow-md">
                {initials || "U"}
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg sm:text-xl font-normal text-white leading-tight">
                  {displayName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <FiMail className="text-neutral-500" />
                    <span>{email}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiPhone className="text-neutral-500" />
                    <span>{phone}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25">
                {roleName}
              </span>

              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <FiCheckCircle className="text-xs" />
                  <span>Email Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
                  <FiXCircle className="text-xs text-neutral-500" />
                  <span>Unverified Email</span>
                </span>
              )}
            </div>
          </div>

          {/* PERSONAL & DEMOGRAPHIC INFO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <FiUser className="text-sm" />
              <span>Personal Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">
                  Gender
                </span>
                <p className="text-sm text-white capitalize">{gender}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">
                  Date of Birth
                </span>
                <p className="text-sm text-white">{dob}</p>
              </div>
            </div>
          </div>

          {/* LOCATION & ADDRESS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <FiMapPin className="text-sm" />
              <span>Delivery & Billing Location</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">
                  Street Address
                </span>
                <p className="text-sm text-white">{address}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">
                  City
                </span>
                <p className="text-sm text-white">{city}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">
                  Country
                </span>
                <p className="text-sm text-white">{country}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">
                  Postal Code
                </span>
                <p className="text-sm text-white">{postcode}</p>
              </div>
            </div>
          </div>

          {/* TIMESTAMPS */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              <FiClock className="text-primary text-sm" />
              <span>Account Timestamps</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <FiCalendar className="text-primary text-sm shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-400 block">
                    Joined Date
                  </span>
                  <span className="text-white font-medium">
                    {data.created_at
                      ? moment(data.created_at).format("MMM DD, YYYY • hh:mm A")
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <FiClock className="text-primary text-sm shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-400 block">
                    Last Profile Update
                  </span>
                  <span className="text-white font-medium">
                    {data.updated_at
                      ? moment(data.updated_at).format("MMM DD, YYYY • hh:mm A")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            className="min-w-[120px]"
          >
            Close
          </Button>
        </div>
      </div>
    </SlideOverDrawer>
  );
}

UserViewDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};
