"use client";
import Heading from "@/components/ui/heading/Heading";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import Pagination from "@/components/ui/table/Pagination";
import Table from "@/components/ui/table/Table";
import TableComponentHeading from "@/components/ui/table/TableComponentHeading";
import { usePopupContext } from "@/hooks/usePopupContext";
import { errorHandler } from "@/helpers/errorHandler";
import { useGetOrderByUserIdQuery } from "@/redux/apis/orderApis";
import { formatRole } from "@/utils/formatRole";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { useSelector } from "react-redux";

export default function Page() {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();
  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  // ALL SELECTED IDs
  // FILTERS
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    user_id: user?.id,
  });

  // GET ORDERS BY USER ID
  const { data, isLoading, isError, error } = useGetOrderByUserIdQuery(
    {
      user_id: filters?.user_id,
      page: filters?.page,
      limit: filters?.limit,
    },
    { skip: !filters?.user_id }
  );

  useEffect(() => {
    if (isError) {
      errorHandler({ err: error });
    }
  }, []);

  // HANDLE PER PAGE
  const setPerPage = (count) => {
    setFilters({ ...filters, perPage: count, page: 1 });
  };

  // HANDLE VIEW
  const handleView = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "viewOrder",
      title: "Order Details",
      data: data,
    });
  };

  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    {
      name: "view",
      handler: handleView,
      Icon: AiFillEye,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      disabledOn: [],
    },
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
    {
      header: "#",
      "data-label": "#",
      accessorKey: "count",
      minWidth: 5,
      show: true,
      isMainField: true,
    },
    {
      header: "Order ID",
      "data-label": "Order ID",
      accessorKey: "order_id",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Email",
      "data-label": "Email",
      accessorKey: "email",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Products",
      "data-label": "Products",
      accessorKey: "products",
      minWidth: 20,
      show: true,
      isMainField: true,
    },

    {
      header: "Amount",
      "data-label": "Amount",
      accessorKey: "totalAmount",
      minWidth: 20,
      show: true,
    },
    {
      header: "Payment Method",
      "data-label": "Payment Method",
      accessorKey: "payment_method",
      minWidth: 20,
      show: true,
    },
    {
      header: "Status",
      "data-label": "Status",
      accessorKey: "status_table",
      minWidth: 10,
      show: true,
    },
  ]);

  if (isLoading) {
    return <CustomLoading />;
  }
  return (
    <>
      <div
        className={`max-w-screen-xl mx-auto px-3 flex flex-col gap-10 pt-36 pb-40`}
      >
        <TableComponentHeading
          routes={
            <div className={`text-[14px]`}>
              <span
                onClick={() => router.push("/")}
                className={`text-primary cursor-pointer`}
              >
                Home
              </span>{" "}
              {"//"} <span>All Orders</span>
            </div>
          }
          heading={"Orders"}
        />
        {/* HEADING AREA */}
        <div className={`flex justify-between items-center`}>
          <div>
            <Heading
              isSubHeading={false}
              isWave={false}
              heading={"All Orders"}
            />
            <p className={``}>
              Total {data?.meta?.total}{" "}
              {data?.meta?.total > 1 ? "Orders" : "Order"} Found
            </p>
          </div>
        </div>
        {/* TABLE AREA */}
        <div className={`space-y-10`}>
          <Table
            isLoading={isLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.perPage + i + 1,
              payment_method: formatRole(d?.payment_method),
              email: d?.shipping_info?.email,
              products: d?.order_items
                .map((item) => item?.product_id)
                ?.join(","),
              totalAmount: d?.order_items
                .reduce(
                  (total, item) => total ?? 0 + parseFloat(item?.price) ?? 0,
                  0
                )
                .toFixed(2),
              status_table: (
                <div
                  // onClick={() => handleOpenModal(d?.id)}
                  className={`px-3 py-1 font-bold cursor-pointer rounded-full inline-block ${
                    d?.status === "pending"
                      ? "bg-primary"
                      : d?.status === "processing"
                      ? "bg-lime-500"
                      : d?.status === "cancelled"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }  shadow-lg shadow-base-100  text-base-300 capitalize flex justify-center items-center`}
                >
                  {d?.status}
                </div>
              ),
              //   isChangingRole?.id === d?.id && isChangingRole?.isLoading ? (
              //     <ButtonLoading />
              //   ) : (
              //   ),
            }))}
            actions={actions}
            columns={cols}
          />
          {/* PAGINATION */}
          <Pagination
            setFilters={setFilters}
            filters={filters}
            total={data?.meta?.total}
          />
        </div>
      </div>
    </>
  );
}
