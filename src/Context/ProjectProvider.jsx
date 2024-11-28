"use client";
import { getUser } from "@/apis/auth";
import ProductForm from "@/app/admin/all-products/ProductForm";
import ViewProduct from "@/app/admin/all-products/ViewProduct";
import CreateAndUpdateCategory from "@/app/admin/categories/CreateAndUpdateCategory";
import CreateAndUpdateDiscountCode from "@/app/admin/dashboard/CreateAndUpdateDiscountCode";
import CreateAndUpdateFaq from "@/app/admin/faq/CreateAndUpdateFaq";
import ViewOrder from "@/app/admin/orders/ViewOrder";
import PackageForm from "@/app/admin/packages/PackageForm";
import PackageView from "@/app/admin/packages/PackageView";
import UserForm from "@/app/admin/users/UserForm";
import ViewUser from "@/app/admin/users/ViewUser";
import CreateAndUpdateReview from "@/app/products/[id]/CreateAndUpdateReview";
import useAxiosSecure from "@/Hooks/useAxiosSecure";
import CustomPopup from "@/Shared/CustomPopup";
import FileViewer from "@/Shared/FileViewer";
import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export const ProjectContext = createContext();
const ProjectProvider = ({ children }) => {
  const axiosSecure = useAxiosSecure();
  const [login, setLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUserComing, setIsUserComing] = useState();

  // CART
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkedId, setCheckedId] = useState([]);

  const checkoutTotal = selectedItems?.reduce((accumulator, currentProduct) => {
    const perProductTotal = currentProduct?.product?.discountPrice
      ? parseFloat(currentProduct?.product?.discountPrice) *
        parseInt(currentProduct?.quantity)
      : parseFloat(currentProduct?.product?.regularPrice) *
        parseInt(currentProduct?.quantity);

    return accumulator + perProductTotal;
  }, 0);

  const checkoutQuantity = selectedItems?.reduce(
    (accumulator, currentProduct) => {
      return accumulator + parseInt(currentProduct?.quantity);
    },
    0
  );

  console.log({
    checkoutQuantity,
    checkoutTotal,
    selectedItems,
    setSelectedItems,
    checkedId,
    setCheckedId,
  });

  useEffect(() => {
    setIsLoading(true);
    getUser()
      .then((res) => {
        console.log({ res });
        setUser(res?.user);
        localStorage.setItem("token", res?.user?.token);

        if (res?.user?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log({ err });
      });
  }, [isUserComing]);

  console.log({ user });

  const logout = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout!",
      customClass: {
        confirmButton: "bg-primary",
        cancelButton: "bg-error",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          ?.post("/auth/logout", {}, { withCredentials: true })
          .then((res) => {
            console.log({ logoutRes: res });
            if (res?.data?.success) {
              setIsUserComing(Math.random());
              setUser(null);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Logout successful",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((err) => {});
      }
    });
  };

  // POPUP OPTIONS
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    id: null,
    onClose: () => {
      setPopupOption({ ...popupOption, open: false });
    },
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });
  const value = {
    // LOGIN
    login,
    setLogin,

    // POPUP OPTIONS
    popupOption,
    setPopupOption,

    // USER
    logout,
    isUserComing,
    setIsUserComing,
    user,
    setUser,
    isLoading,
    setIsLoading,

    // ADMIN
    isAdmin,
    setIsAdmin,

    // CART
    checkoutQuantity,
    checkoutTotal,
    selectedItems,
    setSelectedItems,
    checkedId,
    setCheckedId,
  };
  return (
    <ProjectContext.Provider value={value}>
      <CustomPopup
        popupClasses={`w-[70vw] h-[90vh]`}
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        Component={
          <>
            {/* USERS */}
            {popupOption?.type === "viewUser" && <ViewUser />}
            {popupOption?.type === "userForm" && <UserForm />}

            {/* PRODUCTS */}
            {popupOption?.type === "productForm" && <ProductForm />}
            {popupOption?.type === "viewProduct" && <ViewProduct />}

            {/* CATEGORIES */}
            {popupOption?.type === "category" && <CreateAndUpdateCategory />}

            {/* FAQ */}
            {popupOption?.type === "faq" && <CreateAndUpdateFaq />}
            {popupOption?.type === "viewOrder" && <ViewOrder />}

            {/* DISCOUNT */}
            {popupOption?.type === "discountCode" && (
              <CreateAndUpdateDiscountCode />
            )}

            {/* REVIEW */}
            {popupOption?.type === "review" && <CreateAndUpdateReview />}

            {/* PACKAGES */}
            {popupOption?.type === "packageForm" && <PackageForm />}
            {popupOption?.type === "packageView" && <PackageView />}

            {/* FILE VIEW */}
            {popupOption?.type === "viewFile" && <FileViewer />}
          </>
        }
      />
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;

export const useAuthContext = () => {
  const {
    login,
    setLogin,
    logout,
    isUserComing,
    setIsUserComing,
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAdmin,
    setIsAdmin,
  } = useContext(ProjectContext);

  return {
    login,
    setLogin,
    logout,
    isUserComing,
    setIsUserComing,
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAdmin,
    setIsAdmin,
  };
};

export const useCartContext = () => {
  const {
    checkoutQuantity,
    checkoutTotal,
    selectedItems,
    setSelectedItems,
    checkedId,
    setCheckedId,
  } = useContext(ProjectContext);

  return {
    checkoutQuantity,
    checkoutTotal,
    selectedItems,
    setSelectedItems,
    checkedId,
    setCheckedId,
  };
};
export const usePopupContext = () => {
  const { popupOption, setPopupOption } = useContext(ProjectContext);

  return { popupOption, setPopupOption };
};
