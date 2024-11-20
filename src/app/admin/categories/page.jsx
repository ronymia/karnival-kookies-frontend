"use client";
import { deleteCategory, getAllCategories } from "@/apis/categories";
import { usePopupContext } from "@/Context/ProjectProvider";
import AdminRoute from "@/Routes/AdminRoute";
import Button from "@/Shared/Button";
import CustomLoading from "@/Shared/CustomLoading";
import Heading from "@/Shared/Heading";
import { Pagination } from "@/Shared/Paginations/Pagination";
import SplitDescription from "@/Shared/SplitDescription";
import Table from "@/Shared/Table";
import TableComponentHeading from "@/Shared/TableComponentHeading";
import { deleteData } from "@/Utils/deleteData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

const Page = () => {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  console.log({ isCategoryLoading });
  const [data, setData] = useState([]);
  const [isUpdating, setIsUpdating] = useState();

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
  });

  useEffect(() => {
    setIsCategoryLoading(true);
    getAllCategories(filters)
      .then((res) => {
        if (res?.data) {
          console.log({ res });
          setData(res);
          setIsCategoryLoading(false);
        }
      })
      .catch((err) => {
        setIsCategoryLoading(false);
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
      handler: deleteCategory,
      data,
      deleteMsg: "Category deleted successfully",
      setIsUpdating,
      setIsDeleteLoading,
    });
  };

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "category",
      title: "Add New Category",
      setIsUpdating: setIsUpdating,
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "category",
      title: "Edit Category",
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
      name: "Name",
      attribute_name: "name",
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

  if (isCategoryLoading) {
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
              Total {data?.total} {data?.total > 1 ? "Categories" : "Category"}{" "}
              Found
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
            isLoading={isCategoryLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.perPage + i + 1,
              name: d?.name,
              description_table: (
                <SplitDescription text={d?.description} length={30} />
              ),
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
