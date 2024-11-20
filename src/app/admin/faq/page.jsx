"use client";
import { deleteFaq, getAllFaqs } from "@/apis/faqs";
import { usePopupContext } from "@/Context/ProjectProvider";
import AdminRoute from "@/Routes/AdminRoute";
import Button from "@/Shared/Button";
import CustomLoading from "@/Shared/CustomLoading";
import Heading from "@/Shared/Heading";
import { Pagination } from "@/Shared/Paginations/Pagination";
import Table from "@/Shared/Table";
import TableComponentHeading from "@/Shared/TableComponentHeading";
import { deleteData } from "@/Utils/deleteData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

const Page = () => {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);
  const [isFaqLoading, setIsFaqLoading] = useState(false);
  console.log({ isFaqLoading });
  const [data, setData] = useState([]);
  const [isUpdating, setIsUpdating] = useState();

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
  });

  useEffect(() => {
    setIsFaqLoading(true);
    getAllFaqs(filters)
      .then((res) => {
        if (res?.data) {
          console.log({ res });
          setData(res);
          setIsFaqLoading(false);
        }
      })
      .catch((err) => {
        setIsFaqLoading(false);
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
      handler: deleteFaq,
      data,
      deleteMsg: "FAQ deleted successfully",
      setIsUpdating,
      setIsDeleteLoading,
    });
  };

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "faq",
      title: "Add New FAQ",
      setIsUpdating: setIsUpdating,
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "faq",
      title: "Edit FAQ",
      data: data,
      setIsUpdating: setIsUpdating,
    });
  };

  // ALL ACTION BUTTONS
  const [actions, setActions] = useState([
    {
      name: "edit",
      handler: handleEdit,
      Icon: RiEdit2Fill,
      colorClass: "text-secondary",
      backgroundColorClass: "bg-secondary-content",
      disabledOn: [],
    },
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
      name: "Question",
      attribute_name: "question",
      minWidth: 45,
      show: true,
      isMainField: true,
    },

    {
      name: "Answer",
      attribute_name: "answer",
      minWidth: 50,
      show: true,
    },
  ]);

  if (isFaqLoading) {
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
              {"//"} <span>All FAQ</span>
            </div>
          }
          heading={"FAQS"}
        />
        {/* HEADING AREA */}
        <div className={`flex justify-between items-center`}>
          <div>
            <Heading isSubHeading={false} isWave={false} heading={"All FAQ"} />
            <p className={``}>
              Total {data?.total} {data?.total > 1 ? "FAQS" : "FAQ"} Found
            </p>
          </div>
          <Button text={"Add"} handler={handleCreate} />
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
            isLoading={isFaqLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.perPage + i + 1,
            }))}
            actions={actions}
            cols={cols}
            getFullDataToActionHandler
          />
        </div>
      </div>
    </AdminRoute>
  );
};

export default Page;
