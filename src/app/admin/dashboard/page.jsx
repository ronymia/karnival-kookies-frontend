"use client";
import { usePopupContext } from "@/hooks/usePopupContext";
import DashboardCard from "@/shared/DashboardCard";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import Button from "@/components/ui/buttons/Button";
import { useGetDashboardDataQuery } from "@/redux/apis/dashboardApi";

function Page() {
  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  const { popupOption, setPopupOption } = usePopupContext();
  const router = useRouter();
  const { data, isLoading } = useGetDashboardDataQuery();

  const handleAddProduct = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "productForm",
      title: "Add New Product",
    });
  };

  if (isLoading) {
    return <CustomLoading />;
  }
  return (
    <>
      <div className={`max-w-screen-xl mx-auto px-3 space-y-10 pt-36 pb-40`}>
        {/* TOP SECTION */}
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

          {/* UPCOMING BOOKING */}
          <div className={`flex flex-col sm:flex-row items-center gap-3`}>
            <Button
              parentClasses="w-full md:w-auto"
              paddings="px-5 py-3 w-full md:w-auto flex justify-center"
              text={"Add New Product"}
              handler={handleAddProduct}
            />
            <Button
              parentClasses="w-full md:w-auto"
              paddings="px-5 py-3 w-full md:w-auto flex justify-center"
              text={"Manage Campaigns"}
              handler={() => router.push("/admin/campaigns")}
            />
            <Button
              parentClasses="w-full md:w-auto"
              paddings="px-5 py-3 w-full md:w-auto flex justify-center"
              text={"Manage Orders"}
              handler={() => router.push("/admin/orders")}
            />
          </div>
        </div>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5`}
        >
          <DashboardCard
            header={"Total Orders"}
            content={
              <div className={`text-[14px] font-bold grid grid-cols-2 gap-1`}>
                <p>Total: {data?.data?.totalOrders}</p>
              </div>
            }
            containerClass={"bg-gradient-to-r from-green-700 to-green-950"}
          />
          <DashboardCard
            header={"Last 7 days Orders"}
            content={
              <div className={`text-[14px] font-bold grid grid-cols-2 gap-1`}>
                <p>Total: {data?.data?.last7DaysOrders}</p>
              </div>
            }
            containerClass={"bg-gradient-to-r from-green-700 to-green-950"}
          />
          <DashboardCard
            header={"Last 30 days Orders"}
            content={
              <div className={`text-[14px] font-bold grid grid-cols-2 gap-1`}>
                <p>Total: {data?.data?.last30DaysOrders}</p>
              </div>
            }
            containerClass={"bg-gradient-to-r from-green-700 to-green-950"}
          />
          <DashboardCard
            header={"Total Revenue"}
            content={
              <p className={`text-3xl font-bold`}>$ {data?.data?.totalSales}</p>
            }
            containerClass={"bg-gradient-to-r from-teal-700 to-teal-950"}
          />
          <DashboardCard
            header={"Last 7 days Revenue"}
            content={
              <p className={`text-3xl font-bold`}>
                $ {data?.data?.last7DaysSales}
              </p>
            }
            containerClass={"bg-gradient-to-r from-teal-700 to-teal-950"}
          />
          <DashboardCard
            header={"Last 30 days Revenue"}
            content={
              <p className={`text-3xl font-bold`}>
                $ {data?.data?.last7DaysSales}
              </p>
            }
            containerClass={"bg-gradient-to-r from-teal-700 to-teal-950"}
          />
          <DashboardCard
            header={"Total Products"}
            content={
              <div className={`text-[14px] font-bold grid grid-cols-2 gap-1`}>
                <p>Total: {data?.data?.totalProducts}</p>
              </div>
            }
            containerClass={"bg-gradient-to-r from-emerald-700 to-emerald-950"}
          />
          <DashboardCard
            header={"Total Users"}
            content={
              <div className={`text-[14px] font-bold grid grid-cols-2 gap-1`}>
                <p>Total: {data?.data?.totalUsers}</p>
              </div>
            }
            containerClass={"bg-gradient-to-r from-emerald-700 to-emerald-950"}
          />
          <DashboardCard
            header={"Total Cart Items"}
            content={
              <div className={`text-[14px] font-bold grid grid-cols-2 gap-1`}>
                <p>Total: {data?.data?.totalCartItems}</p>
              </div>
            }
            containerClass={"bg-gradient-to-r from-emerald-700 to-emerald-950"}
          />
        </div>
      </div>
    </>
  );
}

export default Page;
