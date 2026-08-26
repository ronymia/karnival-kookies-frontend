"use client";
import Button from "@/components/ui/buttons/Button";
import Heading from "@/components/ui/heading/Heading";
import Table from "@/components/ui/table/Table";
import TableComponentHeading from "@/components/ui/table/TableComponentHeading";
import { usePopupContext } from "@/hooks/usePopupContext";
import { deleteData } from "@/helpers/DeleteData";
import {
  useDeleteMetaDataMutation,
  useGetAllMetaDataQuery,
} from "@/redux/apis/metaDataApis";
import SplitDescription from "@/shared/SplitDescription";
import { formatRole } from "@/utils/formatRole";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

export default function MetaDataPage() {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // FILTERS
  // eslint-disable-next-line no-unused-vars
  const [filters, setFilters] = useState({
    page: 1,
    perPage: 20,
    limit: 20,
  });

  //   GET ALL PACKAGES
  const { data, isLoading } = useGetAllMetaDataQuery({});
  //   DELETE PACKAGE
  const [deleteMetaData, deleteResult] = useDeleteMetaDataMutation();

  // HANDLE DELETE PRODUCT
  const handleDelete = (data) => {
    deleteData({
      handler: deleteMetaData,
      data,
      deleteMsg: "Package deleted successfully",
    });
  };

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "metaDataForm",
      title: "Add New Meta Data",
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "metaDataForm",
      title: "Edit Meta Data",
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
      header: "Meta Key",
      accessorKey: "metaKey",
      minWidth: 30,
      show: true,
      isMainField: true,
    },
    {
      header: "Title",
      accessorKey: "title",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Description",
      accessorKey: "description_table",
      minWidth: 30,
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
            <div className={`text-[14px]`}>
              <span
                onClick={() => router.push("/")}
                className={`text-primary cursor-pointer`}
              >
                Home
              </span>{" "}
              {"//"} <span>All Meta Data</span>
            </div>
          }
          heading={"Meta Data"}
        />
        {/* HEADING AREA */}
        <header className={`flex justify-between items-center`}>
          <div>
            <Heading
              isSubHeading={false}
              isWave={false}
              heading={"All Meta Data"}
            />
            <p className={``}>
              Total {data?.meta?.total}{" "}
              {data?.meta?.total > 1 ? "Meta Data" : "Meta Data"} Found
            </p>
          </div>
          {/* ADD BUTTON */}
          <Button text={"Add"} handler={handleCreate} />
        </header>

        {/* <==================== TABLE AREA ======================> */}
        <Table
          isLoading={isLoading || deleteResult.isLoading}
          rows={data?.data?.map((d, i) => ({
            ...d,
            count: (filters?.page - 1) * filters?.limit + i + 1,
            metaKey: formatRole(d?.meta_key),
            title: d?.title,
            description_table: (
              <SplitDescription text={d?.description} length={30} />
            ),
          }))}
          actions={actions}
          columns={columns}
        />
      </div>
    </>
  );
}
