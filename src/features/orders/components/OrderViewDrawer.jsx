"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { SlideOverDrawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/buttons";
import { getFullImageLink } from "@/utils/getFullImageLink";
import {
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiClock,
  FiEdit3,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { OrderService } from "../services";
import OrderStatusModal from "./OrderStatusModal";

export default function OrderViewDrawer({ isOpen, onClose, data }) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  if (!data) return null;

  const orderNum =
    data.order_number || data.orderId || `#ORD-${data.id?.slice(0, 6) || "N/A"}`;
  const trackNum = data.tracking_number || "TRK-PENDING";
  const status = data.status || "pending";
  const paymentMethod =
    data.payment_method || data.paymentMethod || "Card Payment";
  const total = OrderService.calculateTotal(data);

  // Customer / Shipping information
  const customerInfo = data.shipping_info || data.checkoutInfo || {};
  const customerName = customerInfo.name || data.name || "Valued Customer";
  const customerEmail =
    customerInfo.email || data.userEmail || data.email || "No email provided";
  const customerPhone =
    customerInfo.phone || data.phone || "No phone provided";
  const street = customerInfo.streetAddress || customerInfo.address || "";
  const city = customerInfo.city || "";
  const state = customerInfo.state || "";
  const postcode = customerInfo.postalCode || customerInfo.postcode || "";
  const country = customerInfo.country || "";
  const apartment = customerInfo.apartment || "";
  const deliveryInstructions = customerInfo.deliveryInstruction || "";

  // Line items
  const items = data.order_items || data.paymentInfo || [];

  return (
    <>
      <OrderStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        order={data}
      />

      <SlideOverDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={`Order Details • ${orderNum}`}
        description="Inspect customer delivery details, line items, and invoice breakdown."
        size="2xl"
      >
        <div className="flex flex-col h-full justify-between gap-6 pb-6">
          <div className="space-y-6">
            {/* TOP SUMMARY BANNER */}
            <div className="p-5 rounded-2xl bg-white/5 border border-primary/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-bold">
                    {orderNum}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {trackNum}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-white">
                  ${total.toFixed(2)}
                </h3>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <FiClock className="text-neutral-500 text-xs" />
                  <span>
                    Placed on{" "}
                    {data.created_at || data.createdAt
                      ? moment(data.created_at || data.createdAt).format(
                          "MMMM DD, YYYY • hh:mm A"
                        )
                      : "Recently"}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="capitalize">
                    {OrderService.formatStatus(status)}
                  </span>
                  <FiEdit3 className="text-xs ml-1 opacity-75" />
                </button>
              </div>
            </div>

            {/* ORDERED ITEMS LIST */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                <FiPackage className="text-sm" />
                <span>
                  Ordered Bakery Items ({items.length}{" "}
                  {items.length === 1 ? "variety" : "varieties"})
                </span>
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => {
                  const product = item.product || {};
                  const itemName = product.name || item.name || `Item #${idx + 1}`;
                  const itemPrice = Number(
                    product.discount_price ||
                      product.regular_price ||
                      item.price ||
                      item.unit_price ||
                      0
                  );
                  const qty = Number(item.quantity || 1);
                  const itemTotal = itemPrice * qty;
                  const imageSrc =
                    product.images?.[0] || item.image || "/images/cookie-placeholder.jpg";

                  return (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={getFullImageLink(imageSrc)}
                          alt={itemName}
                          className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                          onError={(e) => {
                            e.target.src = "/images/cookie-placeholder.jpg";
                          }}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-white text-sm truncate">
                            {itemName}
                          </span>
                          <span className="text-xs text-neutral-400">
                            ${itemPrice.toFixed(2)} × {qty}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono font-bold text-primary text-sm shrink-0">
                        ${itemTotal.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SHIPPING & CUSTOMER DETAILS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                <FiMapPin className="text-sm" />
                <span>Customer & Delivery Destination</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                    Recipient Name
                  </span>
                  <span className="text-white font-medium text-sm">
                    {customerName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                    Contact Phone
                  </span>
                  <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                    <FiPhone className="text-neutral-500" />
                    <span>{customerPhone}</span>
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                    Email Address
                  </span>
                  <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                    <FiMail className="text-neutral-500" />
                    <span>{customerEmail}</span>
                  </span>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                    Shipping Address
                  </span>
                  <p className="text-neutral-200 mt-1 leading-relaxed">
                    {[
                      street,
                      apartment && `Apt/Suite ${apartment}`,
                      city,
                      state,
                      postcode,
                      country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "No address on file"}
                  </p>
                </div>

                {deliveryInstructions && (
                  <div className="sm:col-span-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">
                      Delivery Instructions
                    </span>
                    <p className="mt-0.5 text-xs">{deliveryInstructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* PAYMENT METHOD & FINANCIAL SUMMARY */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                <FiCreditCard className="text-sm" />
                <span>Payment & Invoice Summary</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Payment Gateway</span>
                  <span className="font-medium text-white">
                    {OrderService.formatPaymentMethod(paymentMethod)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-emerald-400">Free</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Total Amount</span>
                  <span className="font-mono text-primary text-base">
                    ${total.toFixed(2)}
                  </span>
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
    </>
  );
}

OrderViewDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};
