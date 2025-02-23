"use client";
import Button from "@/components/UI/buttons/Button";
import Heading from "@/components/UI/Heading/Heading";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import Pagination from "@/components/UI/table/Pagination";
import Table from "@/components/UI/table/Table";
import TableComponentHeading from "@/components/UI/table/TableComponentHeading";
import { usePopupContext } from "@/Context/ProjectProvider";
import { deleteData } from "@/helpers/DeleteData";
import {
  useDeleteMetaDataMutation,
  useGetAllMetaDataQuery,
} from "@/redux/apis/metaDataApis";
import SplitDescription from "@/Shared/SplitDescription";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

export default function MetaDataPage() {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // FILTERS
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
  const handleDeleteMetaData = (data) => {
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
      //   setIsUpdating: setIsUpdating,
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
      //   setIsUpdating: setIsUpdating,
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
      handler: handleDeleteMetaData,
      Icon: MdDelete,
      colorClass: "text-red-600",
      backgroundColorClass: "bg-red-200",
      isLoading: deleteResult.isLoading,
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
      name: "URL",
      attribute_name: "url",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Name",
      attribute_name: "title",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Description",
      attribute_name: "description_table",
      minWidth: 30,
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
              {"//"} <span>All Meta Data</span>
            </div>
          }
          heading={"Meta Data"}
        />
        {/* HEADING AREA */}
        <div className={`flex justify-between items-center`}>
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
          <Button text={"Add"} handler={handleCreate} />
        </div>
        {/* TABLE AREA */}
        <div className={`space-y-10`}>
          <Table
            isLoading={isLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.limit + i + 1,
              url: d?.url,
              title: d?.title,
              description_table: (
                <SplitDescription text={d?.description} length={30} />
              ),
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
