import React from "react";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { FiCopy, FiPackage, FiCreditCard } from "react-icons/fi";
import { OrderService } from "./orderService";

export const ORDER_TABLE_COLUMNS = [
  {
    header: "#",
    accessorKey: "count",
    minWidth: 5,
    show: true,
    isMainField: true,
  },
  {
    header: "ORDER & TRACKING",
    accessorKey: "order_tracking_display",
    minWidth: 25,
    show: true,
    isMainField: true,
  },
  {
    header: "CUSTOMER",
    accessorKey: "customer_display",
    minWidth: 25,
    show: true,
    isMainField: true,
  },
  {
    header: "ITEMS SUMMARY",
    accessorKey: "items_summary",
    minWidth: 20,
    show: true,
  },
  {
    header: "TOTAL AMOUNT",
    accessorKey: "amount_display",
    minWidth: 15,
    show: true,
  },
  {
    header: "PAYMENT",
    accessorKey: "payment_display",
    minWidth: 15,
    show: true,
  },
  {
    header: "STATUS",
    accessorKey: "status_display",
    minWidth: 18,
    show: true,
  },
];

/**
 * Formats raw order records into rich table rows.
 */
export function formatOrderRows(
  orders = [],
  currentPage = 1,
  pageSize = 10,
  onOpenStatusModal
) {
  if (!Array.isArray(orders)) return [];

  return orders.map((order, idx) => {
    const orderNum = order.order_number || order.orderId || `#ORD-${order.id?.slice(0, 6) || "N/A"}`;
    const trackNum = order.tracking_number || "TRK-PENDING";
    const email = order.shipping_info?.email || order.checkoutInfo?.email || order.userEmail || order.email || "No email";
    const name = order.shipping_info?.name || order.checkoutInfo?.name || order.name || "Valued Customer";
    const total = OrderService.calculateTotal(order);
    const payment = OrderService.formatPaymentMethod(order.payment_method || order.paymentMethod);

    const items = order.order_items || order.paymentInfo || [];
    const totalItemCount = items.reduce((acc, curr) => acc + (Number(curr.quantity) || 1), 0);

    const handleCopy = (text, label) => {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text={`${label} copied to clipboard`}
          />
        ));
      }
    };

    // Status styling
    let statusBg = "bg-amber-500/10 text-amber-300 border-amber-500/30";
    if (order.status === "delivered") {
      statusBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    } else if (order.status === "shipped") {
      statusBg = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    } else if (order.status === "preparing" || order.status === "confirmed") {
      statusBg = "bg-purple-500/10 text-purple-300 border-purple-500/30";
    } else if (order.status === "cancelled") {
      statusBg = "bg-red-500/10 text-red-400 border-red-500/30";
    }

    return {
      ...order,
      count: (currentPage - 1) * pageSize + idx + 1,

      // ORDER & TRACKING DISPLAY
      order_tracking_display: (
        <div className="flex flex-col gap-1 py-1">
          <div className="flex items-center gap-1.5 font-bold text-white text-xs sm:text-sm">
            <span>{orderNum}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(orderNum, "Order number");
              }}
              title="Copy Order ID"
              className="text-neutral-500 hover:text-primary transition-colors"
            >
              <FiCopy className="text-xs" />
            </button>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
            <span className="truncate max-w-[140px]">{trackNum}</span>
            {trackNum !== "TRK-PENDING" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(trackNum, "Tracking number");
                }}
                title="Copy Tracking #"
                className="text-neutral-500 hover:text-primary transition-colors"
              >
                <FiCopy className="text-[10px]" />
              </button>
            )}
          </div>
        </div>
      ),

      // CUSTOMER DISPLAY
      customer_display: (
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="font-semibold text-white truncate max-w-[180px]">
            {name}
          </span>
          <span className="text-neutral-400 text-[11px] truncate max-w-[180px]">
            {email}
          </span>
        </div>
      ),

      // ITEMS SUMMARY
      items_summary: (
        <div className="flex items-center gap-1.5 text-xs text-neutral-300">
          <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
            <FiPackage className="text-xs" />
          </div>
          <span>
            {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}
          </span>
        </div>
      ),

      // TOTAL AMOUNT
      amount_display: (
        <div className="font-mono font-bold text-primary text-sm sm:text-base">
          ${total.toFixed(2)}
        </div>
      ),

      // PAYMENT METHOD
      payment_display: (
        <div className="flex items-center gap-1.5 text-xs text-neutral-300">
          <FiCreditCard className="text-neutral-500 text-xs shrink-0" />
          <span className="truncate max-w-[120px]">{payment}</span>
        </div>
      ),

      // STATUS BADGE WITH QUICK STATUS UPDATE TRIGGER
      status_display: (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenStatusModal?.(order);
          }}
          title="Click to change order status"
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBg} transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm capitalize inline-flex items-center gap-1.5`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>{OrderService.formatStatus(order.status)}</span>
        </button>
      ),
    };
  });
}
