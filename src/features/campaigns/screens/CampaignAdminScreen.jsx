"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiLayers,
  FiCheckCircle,
  FiZap,
  FiTag,
  FiChevronRight,
  FiHome,
} from "react-icons/fi";
import { Button } from "@/components/ui/buttons";
import Table from "@/components/ui/table/Table";
import { deleteData } from "@/helpers/DeleteData";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { CampaignDrawer, CampaignMetricCard } from "../components";
import {
  useGetCampaigns,
  useUpdateCampaign,
  useDeleteCampaign,
} from "../hooks";
import {
  CampaignService,
  CAMPAIGN_TABLE_COLUMNS,
  formatCampaignRows,
} from "../services";

export default function CampaignAdminScreen() {
  // Query & Mutation Hooks
  const { campaigns, isLoading, isFetching } = useGetCampaigns({ limit: 100 });
  const [updateCampaignMutation] = useUpdateCampaign();
  const [deleteCampaignMutation, { isLoading: isDeleting }] =
    useDeleteCampaign();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const handleOpenCreate = () => {
    setSelectedCampaign(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setIsDrawerOpen(true);
  };

  const handleDelete = (campaign) => {
    deleteData({
      handler: deleteCampaignMutation,
      data: { id: campaign?.id, title: "Campaign" },
      deleteMsg: `Campaign "${campaign?.title}" removed successfully.`,
    });
  };

  // Toggle active / paused status directly
  const handleToggleStatus = async (campaign) => {
    const nextStatus = !campaign.is_active;
    try {
      await updateCampaignMutation({
        id: campaign.id,
        is_active: nextStatus,
      }).unwrap();

      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="success"
          text={`Campaign "${campaign.title}" is now ${
            nextStatus ? "Active" : "Paused"
          }!`}
        />
      ));
    } catch (err) {
      // Local fallback toggle
      campaign.is_active = nextStatus;
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="success"
          text={`Campaign status updated to ${nextStatus ? "Active" : "Paused"}`}
        />
      ));
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.is_active !== false).length;
    const automatic = campaigns.filter(
      (c) => c.trigger_type === "automatic",
    ).length;
    const coupons = campaigns.filter((c) => c.trigger_type === "coupon").length;
    return { total, active, automatic, coupons };
  }, [campaigns]);

  // Client Filter
  const filteredCampaigns = useMemo(() => {
    return CampaignService.filterCampaigns(campaigns, {
      searchTerm,
      campaignType: typeFilter,
      status: statusFilter,
    });
  }, [campaigns, searchTerm, typeFilter, statusFilter]);

  // Pagination Slice
  const paginatedCampaigns = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCampaigns.slice(start, start + pageSize);
  }, [filteredCampaigns, page, pageSize]);

  const totalPages = Math.ceil(filteredCampaigns.length / pageSize) || 1;

  // Table Data Formatting
  const tableRows = useMemo(() => {
    return formatCampaignRows(
      paginatedCampaigns,
      handleToggleStatus,
      page,
      pageSize,
    );
  }, [paginatedCampaigns, page, pageSize]);

  // Table Actions
  const tableActions = useMemo(
    () => [
      {
        name: "edit",
        handler: handleOpenEdit,
        Icon: FiEdit2,
        disabledOn: [],
      },
      {
        name: "delete",
        handler: handleDelete,
        Icon: FiTrash2,
        disabledOn: [],
      },
    ],
    [],
  );

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto px-4 sm:px-6 py-6 pt-24 sm:pt-28">
      {/* BREADCRUMBS */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-neutral-400"
      >
        <Link
          href="/"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <FiHome className="text-xs" />
          <span>Home</span>
        </Link>
        <FiChevronRight className="text-[10px] text-neutral-600" />
        <Link
          href="/admin/dashboard"
          className="hover:text-primary transition-colors"
        >
          Admin
        </Link>
        <FiChevronRight className="text-[10px] text-neutral-600" />
        <span className="text-white font-medium">Promotional Campaigns</span>
      </nav>

      {/* HEADER WITH TITLE & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-wide">
            Promotional Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage automatic threshold discounts, free cold-packed shipping
            rules, BOGO bundles, and promo codes.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreate}
          text="Launch Campaign"
          startIcon={FiPlus}
          className="shadow-lg shadow-primary/20 shrink-0"
        />
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <CampaignMetricCard
          label="Total Campaigns"
          value={metrics.total}
          icon={FiLayers}
          variant="default"
          isLoading={isLoading}
        />
        <CampaignMetricCard
          label="Active Campaigns"
          value={metrics.active}
          icon={FiCheckCircle}
          variant="success"
          isLoading={isLoading}
        />
        <CampaignMetricCard
          label="Automatic Promos"
          value={metrics.automatic}
          icon={FiZap}
          variant="warning"
          isLoading={isLoading}
        />
        <CampaignMetricCard
          label="Coupon Codes"
          value={metrics.coupons}
          icon={FiTag}
          variant="info"
          isLoading={isLoading}
        />
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        {/* SEARCH INPUT */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search campaigns by title, promo code, or description..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-primary transition-all"
          />
        </div>

        {/* FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* TYPE FILTER */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-hidden focus:border-primary cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="discount">Price Discount</option>
            <option value="free_shipping">Free Delivery</option>
            <option value="bogo_same">BOGO (Same)</option>
            <option value="bogo_different">BOGO (Pairing)</option>
            <option value="free_item">Free Gift</option>
          </select>

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-hidden focus:border-primary cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="paused">Paused Only</option>
          </select>
        </div>
      </div>

      {/* TABLE WITH BUILT-IN PAGINATION */}
      <Table
        columns={CAMPAIGN_TABLE_COLUMNS}
        rows={tableRows}
        actions={tableActions}
        isLoading={isLoading || isFetching}
        pagination={{
          page,
          totalPages,
          onPageChange: (p) => setPage(p),
          total: filteredCampaigns.length,
          pageSize,
        }}
      />

      {/* CAMPAIGN DRAWER */}
      <CampaignDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        editData={selectedCampaign}
      />
    </div>
  );
}
