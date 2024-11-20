"use client";
import { deleteCategory, getAllCategories } from "@/apis/categories";
import { deleteDiscount, getAllDiscounts } from "@/apis/discounts";
import { usePopupContext } from "@/Context/ProjectProvider";
import Button from "@/Shared/Button";
import CustomLoading from "@/Shared/CustomLoading";
import Heading from "@/Shared/Heading";
import { Pagination } from "@/Shared/Paginations/Pagination";
import SplitDescription from "@/Shared/SplitDescription";
import Table from "@/Shared/Table";
import { deleteData } from "@/Utils/deleteData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

const DiscountComponent = () => {
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
    getAllDiscounts(filters)
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
      handler: deleteDiscount,
      data,
      deleteMsg: "Code deleted successfully",
      setIsUpdating,
      setIsDeleteLoading,
    });
  };

  // HANDLE VIEW
  const handleView = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "viewDiscountCode",
      title: "Discount Code Details",
      data: data,
    });
  };

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "discountCode",
      title: "Add New Discount Code",
      setIsUpdating: setIsUpdating,
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "discountCode",
      title: "Edit Discount Code",
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
      name: "",
      attribute_name: "count",
      minWidth: 5,
      show: true,
      isMainField: true,
    },
    {
      name: "Code",
      attribute_name: "code",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Discount Type",
      attribute_name: "discountType",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Discount Amount",
      attribute_name: "discountAmountTable",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Minimum Spend",
      attribute_name: "minimumSpend",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
  ]);

  if (isCategoryLoading) {
    return <CustomLoading />;
  }
  return (
    <div className={`max-w-screen-xl mx-auto px-3 flex flex-col gap-10 pb-40`}>
      {/* HEADING AREA */}
      <div className={`flex justify-between items-center`}>
        <div>
          <Heading
            isSubHeading={false}
            isWave={false}
            heading={"All Discount Codes"}
          />
          <p className={``}>
            Total {data?.total}{" "}
            {data?.total > 1 ? "Discount Codes" : "Discount Code"} Found
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
            discountAmountTable:
              d?.discountType === "percentage"
                ? `${d?.discountAmount}%`
                : `$${d?.discountAmount}`,
          }))}
          actions={actions}
          cols={cols}
          getFullDataToActionHandler
        />
        {/* PAGINATION */}
        {/* <Pagination
          setFilters={setFilters}
          filters={filters}
          total={data?.total}
        /> */}
      </div>
    </div>
  );
};

export default DiscountComponent;
