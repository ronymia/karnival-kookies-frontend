"use client";
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
import { errorHandlerV2 } from "@/helpers/errorHandlerV2";
import { useGetUserQuery, useLogOutUserMutation } from "@/redux/apis/authApis";
import CustomLoading from "@/Shared/CustomLoading";
import CustomPopup from "@/Shared/CustomPopup";
import FileViewer from "@/Shared/FileViewer";
import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

// INITIALIZE PROJECT CONTEXT
export const ProjectContext = createContext();

//
export default function ProjectProvider({ children }) {
  const [userLogOut, logOutResult] = useLogOutUserMutation();

  // IF USER RELOAD THEN API WILL BE CALL
  const [isUserComing, setIsUserComing] = useState(null);
  const getUser = useGetUserQuery();

  useEffect(() => {
    if (isUserComing) {
      getUser.refetch(); // REFETCH WHEN isUserComing BECAME TRUE
    }
  }, [isUserComing]);

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

  const logout = async () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout!",
      customClass: {
        confirmButton: "bg-primary",
        cancelButton: "bg-error",
      },
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          // CALL LOGOUT API
          const res = await userLogOut().unwrap();
          if (res?.success) {
            setIsUserComing(Math.random());
            // NAVIGATE TO LOGIN PAGE

            // SUCCESS MESSAGE
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Logout successful",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      } catch (err) {
        errorHandlerV2({ err });
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
    // POPUP OPTIONS
    popupOption,
    setPopupOption,

    // USER
    logout,
    isUserComing,
    setIsUserComing,

    // CART
    checkoutQuantity,
    checkoutTotal,
    selectedItems,
    setSelectedItems,
    checkedId,
    setCheckedId,
  };

  if (getUser.isLoading || logOutResult.isLoading) {
    return <CustomLoading />;
  }
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
}

// AUTH CONTEXT
export const useAuthContext = () => {
  const { logout, isUserComing, setIsUserComing } = useContext(ProjectContext);

  return {
    logout,
    isUserComing,
    setIsUserComing,
  };
};

// CART CONTEXT
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

// CONTEXT FOR POPUP
export const usePopupContext = () => {
  const { popupOption, setPopupOption } = useContext(ProjectContext);

  return { popupOption, setPopupOption };
};
