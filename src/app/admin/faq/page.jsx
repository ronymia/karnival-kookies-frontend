"use client";
import { deleteFaq, getAllFaqs } from "@/apis/faqs";
import Button from "@/components/UI/buttons/Button";
import Heading from "@/components/UI/Heading/Heading";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import Table from "@/components/UI/table/Table";
import TableComponentHeading from "@/components/UI/table/TableComponentHeading";
import { usePopupContext } from "@/Context/ProjectProvider";
import { deleteData } from "@/helpers/DeleteData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

export default function Page() {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // ALL SELECTED IDs
  const [isFaqLoading, setIsFaqLoading] = useState(false);
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
            isLoading={isFaqLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.perPage + i + 1,
            }))}
            actions={actions}
            columns={cols}
          />
        </div>
      </div>
    </>
  );
}
