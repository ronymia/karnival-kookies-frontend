"use client";
import Button from "@/components/UI/buttons/Button";
import Heading from "@/components/UI/Heading/Heading";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import Pagination from "@/components/UI/table/Pagination";
import Table from "@/components/UI/table/Table";
import TableComponentHeading from "@/components/UI/table/TableComponentHeading";
import { usePopupContext } from "@/Context/ProjectProvider";
import { deleteData } from "@/helpers/DeleteData";
import { errorHandler } from "@/helpers/errorHandler";
import {
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/redux/apis/categoryApis";
import SplitDescription from "@/Shared/SplitDescription";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

export default function CategoryPage() {
  // NAVIGATION
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // DATABASE QUERY
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
  });

  // GET API FOR CATEGORIES
  const { data, isLoading, isError, error } = useGetAllCategoriesQuery({
    page: filters.page,
    limit: filters.limit,
  });
  // DELETE API
  const [deleteCategory, deleteResult] = useDeleteCategoryMutation();

  // IF ANY ERROR FIRE WHILE FETCHING CATEGORY DATABASE
  useEffect(() => {
    if (isError) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  // HANDLE DELETE CATEGORY
  const handleDelete = async (data) => {
    deleteData({
      data: { ...data, title: "category" },
      handler: deleteCategory,
    });
  };

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "categoryForm",
      title: "Add New Category",
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "categoryForm",
      title: "Edit Category",
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
      "data-label": "#",
      accessorKey: "count",
    },
    {
      header: "Name",
      "data-label": "Name",
      accessorKey: "name",
    },
    {
      header: "Description",
      "data-label": "Description",
      accessorKey: "description",
    },
  ];

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
              {"//"} <span>All Categories</span>
            </div>
          }
          heading={"Categories"}
        />
        {/* HEADING AREA */}
        <div className={`flex justify-between items-center`}>
          <div>
            <Heading
              isSubHeading={false}
              isWave={false}
              heading={"All Categories"}
            />
            <p className={``}>
              Total {data?.meta?.total}{" "}
              {data?.meta?.total > 1 ? "Categories" : "Category"} Found
            </p>
          </div>
          <Button text={"Add"} handler={handleCreate} />
        </div>

        {/* TABLE AREA */}
        <section className={`space-y-10`}>
          {/* <================================ TABLE ===============================> */}
          <Table
            isLoading={isLoading || deleteResult?.isLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.limit + i + 1,
              name: d?.name,
              description_table: (
                <SplitDescription text={d?.description} length={30} />
              ),
            }))}
            columns={columns}
            actions={actions}
          />
          {/* <================================ PAGINATION ===============================> */}
          <Pagination
            setFilters={setFilters}
            filters={filters}
            total={data?.meta?.total}
            totalPage={data?.meta?.total_page}
          />
        </section>
      </div>
    </>
  );
}
