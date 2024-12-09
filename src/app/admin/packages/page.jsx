"use client";
import { usePopupContext } from "@/Context/ProjectProvider";
import { deleteDataV2 } from "@/helpers/DeleteDataV2";
import {
  useDeletePackageMutation,
  useGetAllPackagesQuery,
} from "@/redux/apis/packageApis";
import AdminRoute from "@/Routes/AdminRoute";
import Button from "@/Shared/Button";
import CustomLoading from "@/Shared/CustomLoading";
import Heading from "@/Shared/Heading";
import { Pagination } from "@/Shared/Paginations/Pagination";
import SplitDescription from "@/Shared/SplitDescription";
import Table from "@/Shared/Table";
import TableComponentHeading from "@/Shared/TableComponentHeading";
import { getFullImageLink } from "@/Utils/getFullImageLink";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

const PackagePage = () => {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);

  // FILTERS
  const [filters, setFilters] = useState({
    page: 1,
    perPage: 20,
    limit: 20,
  });

  //   GET ALL PACKAGES
  const { data, isLoading } = useGetAllPackagesQuery({});
  //   DELETE PACKAGE
  const [deletePackage, deleteResult] = useDeletePackageMutation();

  // HANDLE PER PAGE
  const setPerPage = (count) => {
    setFilters({ ...filters, perPage: count, page: 1 });
  };

  // HANDLE DELETE PRODUCT
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const handleDeleteProduct = (data) => {
    deleteDataV2({
      handler: deletePackage,
      data,
      deleteMsg: "Package deleted successfully",
    });
  };

  // HANDLE VIEW
  const handleView = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "packageView",
      title: "Package Details",
      data: data,
    });
  };
  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "packageForm",
      title: "Add New Combo Package",
      //   setIsUpdating: setIsUpdating,
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "packageForm",
      title: "Edit Combo Package",
      data: data,
      //   setIsUpdating: setIsUpdating,
    });
  };
  //
  const handleViewImages = (images) => {
    setPopupOption({
      open: true,
      type: "viewFile",
      title: "Files",
      files: images,
      onClose: () => {
        setPopupOption({ ...popupOption, open: false, files: [] });
      },
      closeOnDocumentClick: false,
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
      name: "Image",
      attribute_name: "image_table",
      minWidth: 15,
      show: true,
      isMainField: true,
    },
    {
      name: "Regular Price",
      attribute_name: "regular_price",
      minWidth: 10,
      show: true,
      isMainField: true,
    },
    {
      name: "Discount Price",
      attribute_name: "discount_price",
      minWidth: 10,
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

  console.log({ package: data });

  if (isLoading) {
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
              {"//"} <span>All Packages</span>
            </div>
          }
          heading={"Packages"}
        />
        {/* HEADING AREA */}
        <div className={`flex justify-between items-center`}>
          <div>
            <Heading
              isSubHeading={false}
              isWave={false}
              heading={"All Packages"}
            />
            <p className={``}>
              Total {data?.meta?.total}{" "}
              {data?.meta?.total > 1 ? "Packages" : "Packages"} Found
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
            totalItems={data?.meta?.total}
            setPageNo={(data) => setFilters({ ...filters, page: data })}
            setPerPage={setPerPage}
            perPage={filters?.perPage}
            isLoading={isLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.perPage + i + 1,
              name: d?.name,
              description_table: (
                <SplitDescription text={d?.description} length={30} />
              ),
              image_table: (
                <img
                  onClick={() => handleViewImages(d?.images)}
                  src={getFullImageLink(
                    d?.images?.length > 0 ? d?.images[0] : ""
                  )}
                  alt={d?.name}
                  className={`w-16 h-16 object-cover cursor-pointer`}
                />
              ),
              price: d?.price,
            }))}
            actions={actions}
            cols={cols}
            getFullDataToActionHandler
          />
          {/* PAGINATION */}
          <Pagination
            setFilters={setFilters}
            filters={filters}
            total={data?.meta?.total}
          />
        </div>
      </div>
    </AdminRoute>
  );
};

export default PackagePage;
