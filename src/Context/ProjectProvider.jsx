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
import { useLazyGetUserQuery } from "@/redux/apis/authApis";
import CustomLoading from "@/Shared/CustomLoading";
import CustomPopup from "@/Shared/CustomPopup";
import FileViewer from "@/Shared/FileViewer";
import { createContext, useContext, useEffect, useState } from "react";

// INITIALIZE PROJECT CONTEXT
export const ProjectContext = createContext();

//
export default function ProjectProvider({ children }) {
  // IF USER RELOAD THEN API WILL BE CALL
  // const getUser = useGetUserQuery(undefined, { skip: !isUserComing });
  const [isUserComing, setIsUserComing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [getUser, getUserResult] = useLazyGetUserQuery();
  const token = window.localStorage.getItem("token")?.split(" ")[1];

  useEffect(() => {
    if (token) {
      setIsUserComing(Math.random());
    }
  }, []);

  // GET CURRENT USER
  useEffect(() => {
    if (isUserComing) {
      setIsLoading(true);
      getUser()
        .unwrap()
        .then((data) => {
          console.log("Fetched user:", data);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          window.localStorage.clear();
        })
        .finally(() => setIsLoading(false));
    }
  }, [isUserComing]);

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
    isUserComing,
    setIsUserComing,
    isLoading,
  };

  // if (isLoading) {
  //   return <CustomLoading />;
  // }

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
  const { isUserComing, setIsUserComing, isLoading } =
    useContext(ProjectContext);

  return {
    isUserComing,
    setIsUserComing,
    isLoading,
  };
};

// CONTEXT FOR POPUP
export const usePopupContext = () => {
  const { popupOption, setPopupOption } = useContext(ProjectContext);

  return { popupOption, setPopupOption };
};
