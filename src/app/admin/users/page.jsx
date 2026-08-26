"use client";
import Button from "@/components/ui/buttons/Button";
import Heading from "@/components/ui/heading/Heading";
import Pagination from "@/components/ui/table/Pagination";
import Table from "@/components/ui/table/Table";
import TableComponentHeading from "@/components/ui/table/TableComponentHeading";
import { usePopupContext } from "@/hooks/usePopupContext";
import { useGetAllUsersQuery } from "@/redux/apis/userApis";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { RiEdit2Fill } from "react-icons/ri";

export default function UserList() {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // FILTERS
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
  });

  // GET ALL USER
  const users = useGetAllUsersQuery({
    page: filters?.page,
    limit: filters?.limit,
  });

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "userForm",
      title: "Add New User",
    });
  };
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "userForm",
      title: "Edit User",
      data: data,
    });
  };

  // HANDLE CREATE
  const handleView = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "viewUser",
      title: "User Details",
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
  ];

  // ALL DISPLAYED COLUMNS IN TABLE
  const cols = [
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
      header: "Email",
      accessorKey: "email",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Phone",
      accessorKey: "phone",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Is Verified",
      accessorKey: "verified",
      minWidth: 15,
      show: true,
      isMainField: true,
    },
    {
      header: "Role",
      accessorKey: "user_role",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
  ];

  /* ******************************************************
  
  ***************************************************************/
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
              {"//"} <span>All Users</span>
            </div>
          }
          heading={"Users"}
        />
        {/* HEADING AREA */}
        <div className={`flex justify-between items-center`}>
          <div>
            <Heading
              isSubHeading={false}
              isWave={false}
              heading={"User Management"}
            />
            <p className={``}>
              Total {users.data?.meta?.total}{" "}
              {users.data?.meta?.total > 1 ? "Users" : "User"} Found
            </p>
          </div>
          <Button text={"Add"} handler={handleCreate} />
        </div>

        {/* TABLE AREA */}
        <div className={`space-y-10`}>
          <Table
            isLoading={users.isLoading}
            rows={users.data?.data?.map((d, i) => ({
              ...d,
              count: (filters?.page - 1) * filters?.limit + i + 1,
              name: d?.profile?.name || `N/A`,
              phone: d?.profile?.phone || `N/A`,
              verified: d?.is_email_verified ? "Yes" : "No",
              user_role: (
                <div
                  className={`px-3 py-1 font-bold cursor-pointer rounded-full inline-block ${
                    d?.role === "admin" ? "bg-green-500" : "bg-primary"
                  }  shadow-lg shadow-base-100  text-base-300 capitalize`}
                >
                  {d?.role}
                </div>
              ),
            }))}
            actions={actions}
            columns={cols}
          />

          {/* PAGINATION */}
          <Pagination
            setFilters={setFilters}
            filters={filters}
            total={users.data?.meta?.total}
          />
        </div>
      </div>
    </>
  );
}
