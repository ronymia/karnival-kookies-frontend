"use client";

import CustomLoading from "@/components/ui/loader/CustomLoading";
import { useGetCustomerDashboardDataQuery } from "@/redux/apis/dashboardApi";
import DashboardCard from "@/shared/DashboardCard";
import React from "react";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  const {
    data: { data },
    isLoading,
  } = useGetCustomerDashboardDataQuery({
    user_id: user?.id,
  });

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <div className={`max-w-screen-2xl`}>
      <div
        className={`flex flex-col md:flex-row md:justify-between md:items-center gap-5`}
      >
        {/* WELCOME */}
        <div className={`sm:space-y-1`}>
          <div
            className={`font-bold text-lg sm:text-2xl flex items-center gap-2`}
          >
            Welcome!{" "}
            <h2 className={`flex items-center gap-2`}>
              <span>{user?.name}</span>
            </h2>{" "}
          </div>
          <p className={`text-gray-500 text-[16px]`}>
            Take a look {"what's"} going on.
          </p>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5`}
      >
        <DashboardCard
          header={"Total Orders"}
          content={
            <div className={`text-[14px] font-bold grid grid-cols-2 gap-1`}>
              <p>Total: {data?.totalOrders}</p>
              {/* <p>Checked In: {data?.today_bookings?.check_in}</p>
                <p>Pending: {data?.today_bookings?.pending}</p>
                <p>Completed: {data?.today_bookings?.converted_to_job}</p> */}
            </div>
          }
          containerClass={"bg-gradient-to-r from-green-700 to-green-950"}
        />
        <DashboardCard
          header={"Last 7 days Orders"}
          content={
            <div className={`text-[14px] font-bold grid grid-cols-2 gap-1`}>
              <p>Total: {data?.last7DaysOrders}</p>
              {/* <p>Checked In: {data?.today_bookings?.check_in}</p>
                <p>Pending: {data?.today_bookings?.pending}</p>
                <p>Completed: {data?.today_bookings?.converted_to_job}</p> */}
            </div>
          }
          containerClass={"bg-gradient-to-r from-green-700 to-green-950"}
        />
        <DashboardCard
          header={"Last 30 days Orders"}
          content={
            <div className={`text-[14px] font-bold grid grid-cols-2 gap-1`}>
              <p>Total: {data?.last30DaysOrders}</p>
              {/* <p>Checked In: {data?.today_bookings?.check_in}</p>
                <p>Pending: {data?.today_bookings?.pending}</p>
                <p>Completed: {data?.today_bookings?.converted_to_job}</p> */}
            </div>
          }
          containerClass={"bg-gradient-to-r from-green-700 to-green-950"}
        />
        <DashboardCard
          header={"Total Spent"}
          content={
            <p className={`text-3xl font-bold`}>$ {data?.totalMoneySpent}</p>
          }
          containerClass={"bg-gradient-to-r from-teal-700 to-teal-950"}
        />
        <DashboardCard
          header={"Last 7 days Spent"}
          content={
            <p className={`text-3xl font-bold`}>$ {data?.last7DaysSpent}</p>
          }
          containerClass={"bg-gradient-to-r from-teal-700 to-teal-950"}
        />
        <DashboardCard
          header={"Last 30 days Spent"}
          content={
            <p className={`text-3xl font-bold`}>$ {data?.last30DaysSpent}</p>
          }
          containerClass={"bg-gradient-to-r from-teal-700 to-teal-950"}
        />

        <DashboardCard
          header={"Total Cart Items"}
          content={
            <div className={`text-[14px] font-bold grid grid-cols-2 gap-1`}>
              <p>Total: {data?.totalCartItems}</p>
              {/* <p>Checked In: {data?.today_bookings?.check_in}</p>
                <p>Pending: {data?.today_bookings?.pending}</p>
                <p>Completed: {data?.today_bookings?.converted_to_job}</p> */}
            </div>
          }
          containerClass={"bg-gradient-to-r from-emerald-700 to-emerald-950"}
        />
      </div>
    </div>
  );
}
