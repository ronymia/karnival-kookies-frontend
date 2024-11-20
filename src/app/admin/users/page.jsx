"use client";
import { getAllUsers, updateUser } from "@/apis/auth";
import { deleteFaq, getAllFaqs } from "@/apis/faqs";
import { usePopupContext } from "@/Context/ProjectProvider";
import AdminRoute from "@/Routes/AdminRoute";
import Button from "@/Shared/Button";
import ButtonLoading from "@/Shared/ButtonLoading";
import CustomLoading from "@/Shared/CustomLoading";
import CustomToaster from "@/Shared/CustomToaster";
import Heading from "@/Shared/Heading";
import { Pagination } from "@/Shared/Paginations/Pagination";
import Table from "@/Shared/Table";
import TableComponentHeading from "@/Shared/TableComponentHeading";
import { deleteData } from "@/Utils/deleteData";
import { errorHandler } from "@/Utils/errorHandler";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import Swal from "sweetalert2";

const Page = () => {
  const router = useRouter();
  const { popupOption, setPopupOption } = usePopupContext();

  // ALL SELECTED IDs
  const [selectedIds, setSelectedIds] = useState([]);
  const [isUserLoading, setIsUserLoading] = useState(false);
  console.log({ isUserLoading });
  const [data, setData] = useState([]);
  const [isUpdating, setIsUpdating] = useState();

  console.log({ data });

  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
  });

  useEffect(() => {
    setIsUserLoading(true);
    getAllUsers(filters)
      .then((res) => {
        if (res?.data) {
          console.log({ res });
          setData(res);
          setIsUserLoading(false);
        }
      })
      .catch((err) => {
        setIsUserLoading(false);
        console.log({ err });
      });
  }, [isUpdating]);

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
    }).then((result) => {
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
    });
  };

  // HANDLE PER PAGE
  const setPerPage = (count) => {
    setFilters({ ...filters, perPage: count, page: 1 });
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
  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      ...popupOption,
      open: true,
      type: "user",
      title: "Edit User",
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
    // {
    //   name: "edit",
    //   handler: handleEdit,
    //   Icon: RiEdit2Fill,
    //   colorClass: "text-secondary",
    //   backgroundColorClass: "bg-secondary-content",
    //   disabledOn: [],
    // },
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
      name: "Email",
      attribute_name: "email",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Phone",
      attribute_name: "phone",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
    {
      name: "Is Verified",
      attribute_name: "verified",
      minWidth: 15,
      show: true,
      isMainField: true,
    },
    {
      name: "Role",
      attribute_name: "user_role",
      minWidth: 20,
      show: true,
      isMainField: true,
    },
  ]);

  if (isUserLoading) {
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
              Total {data?.total} {data?.total > 1 ? "Users" : "User"} Found
            </p>
          </div>
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
            isLoading={isUserLoading}
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
