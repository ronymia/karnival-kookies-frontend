"use client";
import {
  getAllCheckouts,
  getAllCheckoutsForAdmin,
  updateStatus,
} from "@/apis/carts";
import { useAuthContext, usePopupContext } from "@/Context/ProjectProvider";
import PrivateRoute from "@/Routes/PrivateRoute";
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

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  console.log({ isOrderLoading });
  const [data, setData] = useState([]);
  const [isUpdating, setIsUpdating] = useState();
  const { user } = useAuthContext();

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
    email: user?.email,
  });

  useEffect(() => {
    setIsOrderLoading(true);
    getAllCheckouts(filters)
      .then((res) => {
        if (res?.data) {
          console.log({ res });
          setData(res);
          setIsOrderLoading(false);
        }
      })
      .catch((err) => {
        setIsOrderLoading(false);
        console.log({ err });
        errorHandler({ err, setLoading: setIsOrderLoading });
      });
  }, [isUpdating]);

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
      name: "Order Id",
      attribute_name: "orderId",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Email",
      attribute_name: "userEmail",
      minWidth: 20,
      show: true,
      isMainField: true,
    },

    {
      name: "Amount",
      attribute_name: "totalPayableAmount",
      minWidth: 20,
      show: true,
    },
    {
      name: "Payment Method",
      attribute_name: "paymentMethod_table",
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

  if (isOrderLoading) {
    return <CustomLoading />;
  }
  return (
    <PrivateRoute>
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
              Total {data?.total} {data?.total > 1 ? "Orders" : "Order"} Found
            </p>
          </div>
        </div>
        {/* TABLE AREA */}
        <div className={`space-y-10`}>
          <Table
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            itemsPerPage={filters?.perPage}
            totalItems={data?.total}
            setPageNo={(data) => setFilters({ ...filters, page: data })}
            setPerPage={setPerPage}
            perPage={filters?.perPage}
            isLoading={isOrderLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.perPage + i + 1,
              paymentMethod_table: formatRole(d?.paymentMethod),
              status_table: (
                <div
                  className={`px-3 py-1 font-bold rounded-full inline-block ${
                    d?.status === "pending"
                      ? "bg-primary"
                      : d?.status === "processing"
                      ? "bg-lime-500"
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
    </PrivateRoute>
  );
};

export default Page;
