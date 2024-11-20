"use client";
import { getAllCategories } from "@/apis/categories";
import { deleteProduct, getAllProducts } from "@/apis/products";
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
import { errorHandler } from "@/Utils/errorHandler";
import { getFullImageLink } from "@/Utils/getFullImageLink";
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
  const [isProductLoading, setIsProductLoading] = useState(false);
  console.log({ isProductLoading });
  const [data, setData] = useState([]);
  const [isUpdating, setIsUpdating] = useState();

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
  });

  useEffect(() => {
    setIsProductLoading(true);
    getAllProducts(filters)
      .then((res) => {
        if (res?.data) {
          console.log({ res });
          setData(res);
          setIsProductLoading(false);
        }
      })
      .catch((err) => {
        setIsProductLoading(false);
        console.log({ err });
        errorHandler({ err, setLoading: setIsProductLoading });
      });
  }, [isUpdating, filters]);

  const [categories, setCategories] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  useEffect(() => {
    setIsCategoryLoading(true);
    getAllCategories()
      .then((res) => {
        if (res?.data) {
          console.log({ res });
          setCategories(res);
          setIsCategoryLoading(false);
        }
      })
      .catch((err) => {
        setIsCategoryLoading(false);
        console.log({ err });
        errorHandler({ err, setLoading: setIsCategoryLoading });
      });
  }, []);

  // HANDLE PER PAGE
  const setPerPage = (count) => {
    setFilters({ ...filters, perPage: count, page: 1 });
  };

  // HANDLE DELETE PRODUCT
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const handleDeleteProduct = (data) => {
    deleteData({
      handler: deleteProduct,
      data,
      deleteMsg: "Product deleted successfully",
      setIsUpdating,
      setIsDeleteLoading,
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
        setPopupOption({ ...popupOption, open: false });
      },
      closeOnDocumentClick: false,
    });
  };

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "product",
      title: "Add New Product",
      setIsUpdating: setIsUpdating,
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "product",
      title: "Edit Product",
      data: data,
      setIsUpdating: setIsUpdating,
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
      attribute_name: "regularPrice",
      minWidth: 10,
      show: true,
      isMainField: true,
    },
    {
      name: "Discount Price",
      attribute_name: "discountPrice",
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
      attribute_name: "category_table",
      minWidth: 10,
      show: true,
    },
  ]);

  if (isProductLoading) {
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
              Total {data?.total} {data?.total > 1 ? "Products" : "Product"}{" "}
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
            isLoading={isProductLoading}
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
                    d?.images?.length > 0 ? d?.images[0]?.file : "",
                    "Products"
                  )}
                  alt={d?.name}
                  className={`w-16 h-16 object-cover cursor-pointer`}
                />
              ),
              price: d?.price,
              category_table: categories?.data?.find(
                (c) => c?.id === d?.category
              )?.name,
              // category_table: (
              //   <div className={`flex gap-1 capitalize`}>
              //     {d?.category?.split("_")?.map((c, i) => (
              //       <span key={i}>{c}</span>
              //     ))}
              //   </div>
              // ),
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
