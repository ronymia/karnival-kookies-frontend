"use client";
import { getAllCheckoutsForAdmin } from "@/apis/carts";
import { usePopupContext } from "@/Context/ProjectProvider";
import { errorHandlerV2 } from "@/helpers/errorHandlerV2";
import {
  useGetAllOrdersQuery,
  useOrderStatusChangeMutation,
} from "@/redux/apis/orderApis";
import AdminRoute from "@/Routes/AdminRoute";
import ButtonLoading from "@/Shared/ButtonLoading";
import CustomLoading from "@/Shared/CustomLoading";
import Heading from "@/Shared/Heading";
import { Pagination } from "@/Shared/Paginations/Pagination";
import Table from "@/Shared/Table";
import TableComponentHeading from "@/Shared/TableComponentHeading";
import { errorHandler } from "@/Utils/errorHandler";
import { formatRole } from "@/Utils/formatRole";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { FiX } from "react-icons/fi";

const Page = () => {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();
  // FILTERS
  const [filters, setFilters] = useState({
    searchTerm: "",
    page: 1,
    limit: 10,
  });
  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);

  const [isUpdating, setIsUpdating] = useState();
  const [statusChangeId, setStatusChangeId] = useState(null);

  const [changeOrderStatus, statusResult] = useOrderStatusChangeMutation();
  const { data, isError, error, refetch, isLoading } = useGetAllOrdersQuery({
    searchTerm: filters?.searchTerm,
    page: filters?.page,
    limit: filters?.limit,
  });

  if (isError) {
    errorHandlerV2({ err: error });
  }

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
      name: "#",
      attribute_name: "count",
      minWidth: 5,
      show: true,
      isMainField: true,
    },
    {
      name: "Order ID",
      attribute_name: "order_id",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Email",
      attribute_name: "email",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Products",
      attribute_name: "products",
      minWidth: 20,
      show: true,
      isMainField: true,
    },

    {
      name: "Amount",
      attribute_name: "totalAmount",
      minWidth: 20,
      show: true,
    },
    {
      name: "Payment Method",
      attribute_name: "payment_method",
      minWidth: 20,
      show: true,
    },
    {
      name: "Status",
      attribute_name: "status_table",
      minWidth: 10,
      show: true,
    },
  ]);

  const handleOpenModal = (id) => {
    setStatusChangeId(id);
    document.getElementById("dialog_status_change").showModal();
  };

  // ORDER STATUS CHANGE
  const handleChangeStatus = async (status) => {
    try {
      const result = await changeOrderStatus({
        id: statusChangeId,
        status,
      }).unwrap();
      // SUCCESS MESSAGE
      if (result?.success) {
        document.getElementById("dialog_status_change").close();
        setIsUpdating(Math.random());
      }
    } catch (err) {
      errorHandlerV2({ err });
    }
  };
  const handleCancelBookingModal = () => {
    document.getElementById("dialog_status_change").close();
  };

  if (isLoading) {
    return <CustomLoading />;
  }
  return (
    <AdminRoute>
      <div
        className={`max-w-screen-xl mx-auto px-3 flex flex-col gap-10 pt-36 pb-40`}
      >
        <dialog
          id="dialog_status_change"
          className="modal modal-bottom md:modal-middle "
        >
          <div
            className={`w-[300px] px-5 py-12 rounded-lg h-auto bg-secondary relative space-y-3`}
          >
            <button
              onClick={handleCancelBookingModal}
              className="w-9 h-9 rounded-full bg-secondary border-primary flex justify-center items-center absolute top-3 right-3"
            >
              <FiX className="text-primary text-xl" />
            </button>
            {[
              "pending",
              "confirmed",
              "preparing",
              "shipped",
              "delivered",
              "cancelled",
            ]?.map((status, i) => (
              <div
                key={i}
                onClick={() => handleChangeStatus(status)}
                className={`py-3 font-bold ${
                  status === "pending"
                    ? "bg-primary"
                    : status === "preparing"
                    ? "bg-lime-500"
                    : status === "cancelled"
                    ? "bg-red-500"
                    : "bg-green-500"
                } text-base-300 border border-primary rounded-lg cursor-pointer transition-all active:scale-90 flex justify-center items-center`}
              >
                <p>{formatRole(status)}</p>
              </div>
            ))}
          </div>
        </dialog>
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
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            itemsPerPage={filters?.limit}
            totalItems={data?.total}
            setPageNo={(data) => setFilters({ ...filters, page: data })}
            setPerPage={setPerPage}
            perPage={filters?.limit}
            isLoading={isLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.limit + i + 1,
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
                  onClick={() => handleOpenModal(d?.id)}
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
            cols={cols}
            getFullDataToActionHandler
          />
          {/* PAGINATION */}
          <Pagination
            setFilters={setFilters}
            filters={filters}
            total={data?.total}
          />
        </div>
      </div>
    </AdminRoute>
  );
};

export default Page;
