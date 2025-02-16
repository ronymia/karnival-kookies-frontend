"use client";
import { deleteDiscount, getAllDiscounts } from "@/apis/discounts";
import Button from "@/components/UI/buttons/Button";
import Heading from "@/components/UI/Heading/Heading";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import Table from "@/components/UI/table/Table";
import { usePopupContext } from "@/Context/ProjectProvider";
import { deleteData } from "@/Utils/deleteData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

export default function DiscountComponent() {
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
      header: "",
      "data-label": "",
      accessorKey: "count",
      minWidth: 5,
      show: true,
      isMainField: true,
    },
    {
      header: "Code",
      "data-label": "Code",
      accessorKey: "code",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Discount Type",
      "data-label": "Discount Type",
      accessorKey: "discountType",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Discount Amount",
      "data-label": "Discount Amount",
      accessorKey: "discountAmountTable",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Minimum Spend",
      "data-label": "Minimum Spend",
      accessorKey: "minimumSpend",
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
          columns={cols}
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
}
