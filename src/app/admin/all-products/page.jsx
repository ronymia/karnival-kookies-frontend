"use client";
import Button from "@/components/UI/buttons/Button";
import Heading from "@/components/UI/Heading/Heading";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import Pagination from "@/components/UI/table/Pagination";
import Table from "@/components/UI/table/Table";
import { usePopupContext } from "@/Context/ProjectProvider";
import { deleteData } from "@/helpers/DeleteData";
import withPermission from "@/Hoc/WithPermission";
import {
  useDeleteProductsMutation,
  useGetAllProductsQuery,
} from "@/redux/apis/productApis";
import SplitDescription from "@/Shared/SplitDescription";
import { getFullImageLink } from "@/Utils/getFullImageLink";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

function ProductPage() {
  const { popupOption, setPopupOption } = usePopupContext();

  // ALL SELECTED IDs
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

  // HANDLE DELETE PRODUCT
  const handleDelete = (data) => {
    deleteData({
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
  const actions = [
    {
      name: "view",
      handler: handleView,
      Icon: AiFillEye,
      disabledOn: [],
    },
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
      header: "Name",
      accessorKey: "name",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Image",
      accessorKey: "image_table",
      minWidth: 15,
      show: true,
      isMainField: true,
    },
    {
      header: "Price",
      accessorKey: "mainPrice",
      minWidth: 10,
      show: true,
      isMainField: true,
    },
    {
      header: "Discount Amount",
      accessorKey: "discountAmount",
      minWidth: 10,
      show: true,
      isMainField: true,
    },
    {
      header: "Net Price",
      accessorKey: "netPrice",
      minWidth: 30,
      show: true,
    },
    {
      header: "Category",
      accessorKey: "category",
      minWidth: 10,
      show: true,
    },
    {
      header: "Description",
      accessorKey: "description_table",
      minWidth: 10,
      show: true,
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
        {/* <================== HEADING AREA ===============> */}
        <header className={`flex justify-between items-center`}>
          <div>
            <Heading
              isSubHeading={false}
              isWave={false}
              heading={"Product Management"}
            />
            <p className={``}>
              Total {data?.meta?.total}{" "}
              {data?.meta?.total > 1 ? "Products" : "Product"} Found
            </p>
          </div>
          {/* <====================== ADD BUTTON =====================> */}
          <Button text={"Add"} handler={handleCreate} />
        </header>

        {/* <================== TABLE AREA ===============> */}
        <div className={`space-y-10`}>
          <Table
            isLoading={isLoading || deleteResult.isLoading}
            rows={data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.limit + i + 1,
              name: d?.name,
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
              description_table: (
                <SplitDescription text={d?.description} length={30} />
              ),
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
              category: d?.category?.name,
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

export default withPermission(ProductPage, ["admin"]);
