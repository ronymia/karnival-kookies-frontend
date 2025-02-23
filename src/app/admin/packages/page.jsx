"use client";
import Button from "@/components/UI/buttons/Button";
import Heading from "@/components/UI/Heading/Heading";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import CustomPopup from "@/components/UI/modal/CustomPopup";
import Pagination from "@/components/UI/table/Pagination";
import Table from "@/components/UI/table/Table";
import TableComponentHeading from "@/components/UI/table/TableComponentHeading";
import {
  useDeletePackageMutation,
  useGetAllPackagesQuery,
} from "@/redux/apis/packageApis";
import SplitDescription from "@/Shared/SplitDescription";
import { getFullImageLink } from "@/Utils/getFullImageLink";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import PackageForm from "./PackageForm";
import withPermission from "@/Hoc/WithPermission";
import { deleteData } from "@/helpers/DeleteData";

function PackagePage() {
  const router = useRouter();
  //
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    title: "",
    data: null,
    closeOnDocumentClick: false,
    overlayStyle: { background: "red" },
    onClose: () => {
      setPopupOption({ ...popupOption, open: false });
    },
  });

  // ALL SELECTED IDs

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

  // HANDLE DELETE PRODUCT
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const handleDeleteProduct = (data) => {
    deleteData({
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
      type: "view",
      title: "Package Details",
      data: data,
    });
  };
  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      data: null,
      type: "create",
      form: "packageForm",
      title: "Add New Combo Package",
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    console.log({ dataaaaaa: data });
    setPopupOption({
      ...popupOption,
      open: true,
      data: data,
      type: "update",
      form: "packageForm",
      title: "Update Combo Package",
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
  const actions = [
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
  ];

  // ALL DISPLAYED COLUMNS IN TABLE
  const columns = [
    {
      header: "#",
      "data-label": "#",
      accessorKey: "count",
      minWidth: 5,
      show: true,
      isMainField: true,
    },
    {
      header: "Name",
      "data-label": "Name",
      accessorKey: "name",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Image",
      "data-label": "Image",
      accessorKey: "image_table",
      minWidth: 15,
      show: true,
      isMainField: true,
    },
    {
      header: "Price",
      "data-label": "Price",
      accessorKey: "mainPrice",
      minWidth: 10,
      show: true,
      isMainField: true,
    },
    {
      header: "Discount Amount",
      "data-label": "Discount Amount",
      accessorKey: "discountAmount",
      minWidth: 10,
      show: true,
      isMainField: true,
    },
    {
      header: "Net Price",
      "data-label": "Net Price",
      accessorKey: "netPrice",
      minWidth: 30,
      show: true,
    },
    {
      header: "Description",
      "data-label": "Description",
      accessorKey: "description_table",
      minWidth: 30,
      show: true,
    },
  ];

  if (isLoading) {
    return <CustomLoading />;
  }
  return (
    <>
      <CustomPopup
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        Component={
          <>
            {/* CREATE */}
            {popupOption?.type === "create" && (
              <PackageForm
                data={popupOption?.data}
                handleClosePopup={() => {
                  setPopupOption((prev) => ({
                    ...prev,
                    open: false,
                    type: "",
                    title: "",
                    data: null,
                  }));
                }}
              />
            )}
            {/* UPDATE */}
            {popupOption?.type === "update" && (
              <PackageForm
                data={popupOption?.data}
                handleClosePopup={() => {
                  setPopupOption((prev) => ({
                    ...prev,
                    open: false,
                    type: "",
                    title: "",
                    data: null,
                  }));
                }}
              />
            )}
            {/* view */}
            {popupOption?.type === "view" && (
              <PackageForm
                data={popupOption?.data}
                handleClosePopup={() => {
                  setPopupOption((prev) => ({
                    ...prev,
                    open: false,
                    type: "",
                    title: "",
                    data: null,
                  }));
                }}
              />
            )}
          </>
        }
      />

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
              {"//"} <span>Combo Package Management</span>
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
              heading={"Combo Package Management"}
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
            isLoading={isLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.perPage + i + 1,
              name: d?.name,
              description_table: (
                <SplitDescription text={d?.description} length={30} />
              ),
              mainPrice: `$ ${d?.price}`,
              netPrice: `$ ${parseFloat(d?.net_price).toFixed(2)}`,
              discountAmount:
                d?.discount_type === "fixed"
                  ? d?.discount_value !== null &&
                    d?.discount_value !== undefined
                    ? `$ ${d?.discount_value}`
                    : "N/A"
                  : d?.discount_value !== null &&
                    d?.discount_value !== undefined
                  ? `${d?.discount_value}%`
                  : "N/A",
              image_table: (
                <Image
                  onClick={() => handleViewImages(d?.images)}
                  src={getFullImageLink(
                    d?.images?.length > 0 ? d?.images[0] : "",
                    "Products"
                  )}
                  width={100}
                  height={100}
                  alt={d?.name}
                  className={`w-16 h-16 object-cover cursor-pointer`}
                />
              ),
            }))}
            actions={actions}
            columns={columns}
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

export default withPermission(PackagePage, ["admin"]);
