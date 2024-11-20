"use client";
import { getAllUserDashboardItems } from "@/apis/dashboardApis";
import { useAuthContext } from "@/Context/ProjectProvider";
import PrivateRoute from "@/Routes/PrivateRoute";
import CustomLoading from "@/Shared/CustomLoading";
import DashboardCard from "@/Shared/DashboardCard";
import Heading from "@/Shared/Heading";
import { errorHandler } from "@/Utils/errorHandler";
import { formatRole } from "@/Utils/formatRole";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [data, setData] = useState({});
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  useEffect(() => {
    setIsDashboardLoading(true);
    getAllUserDashboardItems({ email: user?.email })
      .then((res) => {
        setData(res);
        setIsDashboardLoading(false);
      })
      .catch((err) => {
        setIsDashboardLoading(false);
        console.log({ err });
        errorHandler({ err, setLoading: setIsDashboardLoading });
      });
  }, [user]);
  console.log({ data });

  if (isDashboardLoading) {
    return <CustomLoading />;
  }
  return (
    <PrivateRoute>
      <div className={`max-w-screen-xl mx-auto px-3 space-y-10 pt-36 pb-40`}>
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
        <div data-auto="container-personal-details" className="w-full">
          {/* HEADING */}
          <div
            id="header"
            className="pb-7 flex justify-between items-center w-full"
          >
            <Heading isSubHeading={false} heading={"Personal Details"} />
          </div>
          {/* MAIN */}
          <div className="space-y-5">
            <div className={`text-xl space-x-2`}>
              <span className={` font-bold text-primary`}>Name: </span>
              <span className="text-base-300">{formatRole(user?.name)}</span>
            </div>
            <div className={`text-xl space-x-2`}>
              <span className={` font-bold text-primary`}>Email: </span>
              <span className="text-base-300">{user?.email}</span>
            </div>
            <div className={`text-xl space-x-2`}>
              <span className={` font-bold text-primary`}>Phone Number: </span>
              <span className="text-base-300">{user?.phone}</span>
            </div>
            <div className={`text-xl space-x-2`}>
              <span className={` font-bold text-primary`}>Role: </span>
              <span className="text-base-300">{formatRole(user?.role)}</span>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default Page;
