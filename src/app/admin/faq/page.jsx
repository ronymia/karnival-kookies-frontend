"use client";
import Button from "@/components/ui/buttons/Button";
import Heading from "@/components/ui/heading/Heading";
import Table from "@/components/ui/table/Table";
import TableComponentHeading from "@/components/ui/table/TableComponentHeading";
import { usePopupContext } from "@/hooks/usePopupContext";
import { deleteData } from "@/helpers/DeleteData";
import { errorHandler } from "@/helpers/errorHandler";
import { useDeleteFaqMutation, useGetFaqsQuery } from "@/redux/apis/faqApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

export default function Page() {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // FILTERS
  // eslint-disable-next-line no-unused-vars
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
  });

  const [deleteFaq, deleteResult] = useDeleteFaqMutation();

  const { data, isLoading, isError, error } = useGetFaqsQuery({
    page: filters.page,
    limit: filters.limit,
  });

  useEffect(() => {
    if (isError) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  // HANDLE DELETE PRODUCT
  const handleDelete = (data) => {
    deleteData({
      handler: deleteFaq,
      data,
      deleteMsg: "FAQ deleted successfully",
    });
  };

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "faqForm",
      title: "Add New FAQ",
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "faqForm",
      title: "Edit FAQ",
      data: data,
    });
  };

  // ALL ACTION BUTTONS
  const actions = [
    {
      name: "edit",
      handler: handleEdit,
      Icon: RiEdit2Fill,
      disabledOn: [],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MdDelete,
      disabledOn: [],
    },
  ];

  // ALL DISPLAYED COLUMNS IN TABLE
  const columns = [
    {
      header: "#",
      accessorKey: "count",
      minWidth: 5,
      show: true,
      isMainField: true,
    },
    {
      header: "Question",
      accessorKey: "question",
      minWidth: 45,
      show: true,
      isMainField: true,
    },

    {
      header: "Answer",
      accessorKey: "answer",
      minWidth: 50,
      show: true,
    },
  ];

  return (
    <>
      <div
        className={`max-w-screen-xl mx-auto px-3 flex flex-col gap-10 pt-36 pb-40`}
      >
        <TableComponentHeading
          routes={
            <div className={`text-sm`}>
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
        <header className={`flex justify-between items-center`}>
          <div>
            <Heading isSubHeading={false} isWave={false} heading={"All FAQ"} />
            <p className={``}>
              Total {data?.meta?.total} {data?.meta?.total > 1 ? "FAQS" : "FAQ"}{" "}
              Found
            </p>
          </div>
          <Button text={"Add"} handler={handleCreate} />
        </header>

        {/* <======================= TABLE AREA =======================> */}
        <Table
          isLoading={isLoading || deleteResult.isLoading}
          rows={data?.data?.map((d, i) => ({
            ...d,
            count: (filters?.page - 1) * filters?.limit + i + 1,
          }))}
          actions={actions}
          columns={columns}
        />
      </div>
    </>
  );
}
