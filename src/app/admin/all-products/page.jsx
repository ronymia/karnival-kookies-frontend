"use client";
import { usePopupContext } from "@/Context/ProjectProvider";
import { deleteDataV2 } from "@/helpers/DeleteDataV2";
import {
  useDeleteProductsMutation,
  useGetAllProductsQuery,
} from "@/redux/apis/productApis";
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

export default function ProductPage() {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteProduct, deleteResult] = useDeleteProductsMutation();

  // FILTERS
  const [filters, setFilters] = useState({
    searchTerm: "",
    page: 1,
    limit: 10,
  });
  const { data, isLoading, refetch } = useGetAllProductsQuery({
    searchTerm: filters?.searchTerm,
    page: filters?.page,
    limit: filters?.limit,
  });

  useEffect(() => {
    refetch();
  }, [filters]);

  // HANDLE PER PAGE
  const setPerPage = (count) => {
    setFilters({ ...filters, perPage: count, page: 1 });
  };

  // HANDLE DELETE PRODUCT
  const handleDeleteProduct = (data) => {
    deleteDataV2({
      handler: deleteProduct,
      data,
      deleteMsg: "Product deleted successfully",
    });
  };

  // HANDLE VIEW
  const handleView = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "viewProduct",
      title: "Product Details",
      data: data,
    });
  };

  const handleViewImages = (images) => {
    setPopupOption({
      open: true,
      type: "viewFile",
      title: "Files",
      files: images?.map((image) => image?.file),
      fileFolder: "Products",
      onClose: () => {
        setPopupOption({
          ...popupOption,
          open: false,
          files: "",
          fileFolder: "",
        });
      },
      closeOnDocumentClick: false,
    });
  };

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "productForm",
      title: "Add New Product",
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "productForm",
      title: "Edit Product",
      data: data,
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
    {
      name: "Category",
      attribute_name: "category",
      minWidth: 10,
      show: true,
    },
  ]);

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
              {"//"} <span>All Products</span>
            </div>
          }
          heading={"Products"}
        />
        {/* HEADING AREA */}
        <div className={`flex justify-between items-center`}>
          <div>
            <Heading
              isSubHeading={false}
              isWave={false}
              heading={"All Products"}
            />
            <p className={``}>
              Total {data?.meta?.total}{" "}
              {data?.meta?.total > 1 ? "Products" : "Product"} Found
            </p>
          </div>
          <Button text={"Add"} handler={handleCreate} />
        </div>
        {/* TABLE AREA */}
        <div className={`space-y-10`}>
          <Table
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            itemsPerPage={filters?.limit}
            totalItems={data?.meta?.total}
            setPageNo={(data) => setFilters({ ...filters, page: data })}
            setPerPage={setPerPage}
            perPage={filters?.limit}
            isLoading={isLoading || deleteResult.isLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.limit + i + 1,
              name: d?.name,
              description_table: (
                <SplitDescription text={d?.description} length={30} />
              ),
              image_table: (
                <img
                  onClick={() => handleViewImages(d?.images)}
                  src={getFullImageLink(
                    d?.images?.length > 0 ? d?.images[0] : "",
                    "Products"
                  )}
                  alt={d?.name}
                  className={`w-16 h-16 object-cover cursor-pointer`}
                />
              ),
              price: d?.price,
              category: d?.category?.name,
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
}
