"use client";
import Button from "@/components/UI/buttons/Button";
import Heading from "@/components/UI/Heading/Heading";
import Table from "@/components/UI/table/Table";
import { usePopupContext } from "@/Context/ProjectProvider";
import { deleteData } from "@/helpers/DeleteData";
import {
  useDeleteCouponCodeMutation,
  useGetCouponCodesQuery,
} from "@/redux/apis/couponCodeApi";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

export default function CouponCodesPage() {
  const { popupOption, setPopupOption } = usePopupContext();

  // FILTERS
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
  });
  // ALL SELECTED IDs
  const { data, isLoading } = useGetCouponCodesQuery();
  const [deleteCouponCode, deleteResult] = useDeleteCouponCodeMutation();

  // HANDLE DELETE PRODUCT
  const handleDelete = (data) => {
    deleteData({
      handler: deleteCouponCode,
      data,
      deleteMsg: "Coupon Code deleted successfully",
    });
  };

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "couponForm",
      title: "Add New Coupon Code",
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "couponForm",
      title: "Edit Coupon Code",
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
      header: "",
      accessorKey: "count",
      minWidth: 5,
      show: true,
      isMainField: true,
    },
    {
      header: "Code",
      accessorKey: "code",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Coupon Type",
      accessorKey: "discount_type",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Coupon Value",
      accessorKey: "discountAmountTable",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Minimum Spend",
      accessorKey: "minimumSpend",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
  ];

  return (
    <div className={`max-w-screen-xl mx-auto px-3 flex flex-col gap-10 pb-40`}>
      {/* HEADING AREA */}
      <header className={`flex justify-between items-center`}>
        <div>
          <Heading
            isSubHeading={false}
            isWave={false}
            heading={"All Coupon Codes"}
          />
          <p className={``}>
            Total {data?.meta?.total}{" "}
            {data?.meta?.total > 1 ? "Coupon Codes" : "Coupon Code"} Found
          </p>
        </div>
        <Button text={"Add"} handler={handleCreate} />
      </header>

      {/* TABLE AREA */}
      <Table
        isLoading={isLoading || deleteResult.isLoading}
        rows={data?.data?.map((d, i) => ({
          ...d,
          count: (filters?.page - 1) * filters?.limit + i + 1,
          discountAmountTable:
            d?.discount_type === "percent"
              ? `${parseInt(d?.discount_value)}%`
              : `$${parseInt(d?.discount_value)}`,
          minimumSpend:
            parseInt(d?.minimum_spend) > 0
              ? `$${d?.minimum_spend}`
              : `Not Applicable`,
        }))}
        actions={actions}
        columns={columns}
      />
    </div>
  );
}
