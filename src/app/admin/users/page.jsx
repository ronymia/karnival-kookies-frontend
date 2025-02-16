"use client";
import { updateUser } from "@/apis/auth";
import Button from "@/components/UI/buttons/Button";
import ButtonLoading from "@/components/UI/buttons/ButtonLoading";
import Heading from "@/components/UI/Heading/Heading";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import Pagination from "@/components/UI/table/Pagination";
import Table from "@/components/UI/table/Table";
import TableComponentHeading from "@/components/UI/table/TableComponentHeading";
import CustomToaster from "@/components/UI/toaster/CustomToaster";
import { usePopupContext } from "@/Context/ProjectProvider";
import { errorHandler } from "@/helpers/errorHandler";
import { useGetAllUsersQuery } from "@/redux/apis/userApis";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiFillEye } from "react-icons/ai";
import { RiEdit2Fill } from "react-icons/ri";
import Swal from "sweetalert2";

export default function UserList() {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // ALL SELECTED IDs
  const [isUserLoading, setIsUserLoading] = useState(false);

  // FILTERS
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    perPage: 20,
  });

  // GET ALL USER
  const { data, isLoading } = useGetAllUsersQuery({
    page: filters?.page,
    limit: filters?.limit,
  });

  // USER DELETE
  const [isUpdating, setIsUpdating] = useState();

  const [isChangingRole, setIsChangingRole] = useState({
    id: null,
    isLoading: false,
  });
  const handleChangeRole = (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Role Will be Changed on Confirm",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Change Role",
      customClass: {
        confirmButton: "bg-primary",
        cancelButton: "bg-error",
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          setIsChangingRole({ id: data?.id, isLoading: true });
          updateUser({
            email: data?.email,
            role: data?.role === "admin" ? "user" : "admin",
          })
            .then((res) => {
              console.log({ res });
              if (res?.success) {
                setIsUpdating(Math.random());
                toast.custom((t) => (
                  <CustomToaster
                    t={t}
                    type={"success"}
                    text={`Role Changed successfully`}
                  />
                ));
                setIsChangingRole({ id: null, isLoading: false });
              }
              setIsChangingRole({ id: null, isLoading: false });
            })
            .catch((err) => {
              setIsChangingRole({ id: null, isLoading: false });
              console.log({ err });
              errorHandler({ err, setLoading: setIsUserLoading });
            });
        }
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  // HANDLE CREATE
  const handleCreate = () => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "userForm",
      title: "Add New User",
      setIsUpdating: setIsUpdating,
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
      setIsUpdating: setIsUpdating,
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
  ]);

  // ALL DISPLAYED COLUMNS IN TABLE
  const [cols, setCols] = useState([
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
      header: "Email",
      "data-label": "Email",
      accessorKey: "email",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Phone",
      "data-label": "Phone",
      accessorKey: "phone",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      header: "Is Verified",
      "data-label": "Is Verified",
      accessorKey: "verified",
      minWidth: 15,
      show: true,
      isMainField: true,
    },
    {
      header: "Role",
      "data-label": "Role",
      accessorKey: "user_role",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
  ]);

  if (isLoading) {
    return <CustomLoading />;
  }

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
            <Heading isSubHeading={false} isWave={false} heading={"All User"} />
            <p className={``}>
              Total {data?.meta?.total}{" "}
              {data?.meta?.total > 1 ? "Users" : "User"} Found
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
              verified: d?.isVerified ? "Yes" : "No",
              user_role:
                isChangingRole?.id === d?.id && isChangingRole?.isLoading ? (
                  <ButtonLoading />
                ) : (
                  <div
                    onClick={() => handleChangeRole(d)}
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
            total={data?.meta?.total}
          />
        </div>
      </div>
    </>
  );
}
