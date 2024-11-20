"use client";
import { deleteMessage, getAllMessages } from "@/apis/messages";
import { usePopupContext } from "@/Context/ProjectProvider";
import AdminRoute from "@/Routes/AdminRoute";
import CustomLoading from "@/Shared/CustomLoading";
import Heading from "@/Shared/Heading";
import { Pagination } from "@/Shared/Paginations/Pagination";
import Table from "@/Shared/Table";
import TableComponentHeading from "@/Shared/TableComponentHeading";
import { deleteData } from "@/Utils/deleteData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

const Page = () => {
  const router = useRouter();

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isUpdating, setIsUpdating] = useState();

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
  });

  useEffect(() => {
    setIsMessageLoading(true);
    getAllMessages(filters)
      .then((res) => {
        if (res?.data) {
          console.log({ res });
          setData(res);
          setIsMessageLoading(false);
        }
      })
      .catch((err) => {
        setIsMessageLoading(false);
        console.log({ err });
      });
  }, [isUpdating]);

  // HANDLE PER PAGE
  const setPerPage = (count) => {
    setFilters({ ...filters, perPage: count, page: 1 });
  };

  // HANDLE DELETE PRODUCT
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const handleDeleteProduct = (data) => {
    deleteData({
      handler: deleteMessage,
      data,
      deleteMsg: "Message deleted successfully",
      setIsUpdating,
      setIsDeleteLoading,
    });
  };

  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    {
      name: "delete",
      handler: handleDeleteProduct,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: isDeleteLoading,
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
      name: "Name",
      attribute_name: "name",
      minWidth: 20,
      show: true,
      isMainField: true,
    },

    {
      name: "Email",
      attribute_name: "email",
      minWidth: 20,
      show: true,
    },
    {
      name: "Message",
      attribute_name: "message",
      minWidth: 55,
      show: true,
    },
  ]);

  if (isMessageLoading) {
    return <CustomLoading />;
  }
  return (
    <AdminRoute>
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
              {"//"} <span>All Messages</span>
            </div>
          }
          heading={"Messages"}
        />
        {/* HEADING AREA */}
        <div className={`flex justify-between items-center`}>
          <div>
            <Heading
              isSubHeading={false}
              isWave={false}
              heading={"All Messages"}
            />
            <p className={``}>
              Total {data?.total} {data?.total > 1 ? "Messages" : "Message"}{" "}
              Found
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
            isLoading={isMessageLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.perPage + i + 1,
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
