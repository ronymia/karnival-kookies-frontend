"use client";

import React from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import { FiX, FiCheckCircle } from "react-icons/fi";
import { useOrderStatusChange } from "../hooks";
import { ORDER_STATUSES, OrderService } from "../services";

export default function OrderStatusModal({ isOpen, onClose, order }) {
  const [changeStatus, { isLoading }] = useOrderStatusChange();

  if (!isOpen || !order) return null;

  const currentStatus = order.status;
  const orderNum =
    order.order_number || order.orderId || `#ORD-${order.id?.slice(0, 6) || "N/A"}`;

  const handleSelectStatus = async (status) => {
    if (status === currentStatus) {
      onClose();
      return;
    }

    try {
      await changeStatus({
        id: order.id,
        status,
      }).unwrap();

      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="success"
          text={`Order status updated to "${OrderService.formatStatus(status)}"`}
        />
      ));

      onClose();
    } catch (err) {
      errorHandler({ err });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#14120e] border border-primary/30 p-6 shadow-2xl space-y-5">
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <FiX className="text-base" />
        </button>

        {/* HEADER */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Quick Status Update
          </span>
          <h3 className="font-serif text-xl font-normal text-white mt-0.5">
            Update Fulfillment for {orderNum}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Current Status:{" "}
            <strong className="text-white capitalize">
              {OrderService.formatStatus(currentStatus)}
            </strong>
          </p>
        </div>

        {/* STATUS OPTIONS GRID */}
        <div className="grid grid-cols-1 gap-2.5">
          {ORDER_STATUSES.map((st) => {
            const isSelected = st.value === currentStatus;

            let badgeColor = "hover:border-amber-500/50 hover:bg-amber-500/10";
            if (st.value === "delivered") {
              badgeColor = "hover:border-emerald-500/50 hover:bg-emerald-500/10";
            } else if (st.value === "shipped") {
              badgeColor = "hover:border-cyan-500/50 hover:bg-cyan-500/10";
            } else if (st.value === "preparing" || st.value === "confirmed") {
              badgeColor = "hover:border-purple-500/50 hover:bg-purple-500/10";
            } else if (st.value === "cancelled") {
              badgeColor = "hover:border-red-500/50 hover:bg-red-500/10";
            }

            return (
              <button
                key={st.value}
                type="button"
                disabled={isLoading}
                onClick={() => handleSelectStatus(st.value)}
                className={`w-full p-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-primary/20 border-primary text-primary ring-1 ring-primary/40"
                    : `bg-white/5 border-white/10 text-neutral-200 ${badgeColor}`
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-current" />
                  <span>{st.label}</span>
                </div>

                {isSelected && (
                  <FiCheckCircle className="text-primary text-base" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

OrderStatusModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.object,
};
