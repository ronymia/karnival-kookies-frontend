"use client";
import ProductForm from "@/app/admin/all-products/ProductForm";
import ViewProduct from "@/app/admin/all-products/ViewProduct";
import CategoryForm from "@/app/admin/categories/CategoryForm";
import CouponForm from "@/app/admin/coupon-codes/CouponForm";
import FaqForm from "@/app/admin/faq/FaqForm";
import MetaDataForm from "@/app/admin/meta-data/MetaDataForm";
import ViewOrder from "@/app/admin/orders/ViewOrder";
import PackageForm from "@/app/admin/packages/PackageForm";
import PackageView from "@/app/admin/packages/PackageView";
import UserForm from "@/app/admin/users/UserForm";
import ViewUser from "@/app/admin/users/ViewUser";
import CreateAndUpdateReview from "@/app/products/[id]/CreateAndUpdateReview";
import CustomPopup from "@/components/UI/modal/CustomPopup";
import FileViewer from "@/components/UI/modal/FileViewer";
import { createContext, useContext, useState } from "react";

// INITIALIZE PROJECT CONTEXT
export const ProjectContext = createContext();

//
export default function ProjectProvider({ children }) {
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
    lockScroll: false,
  });
  const value = {
    // POPUP OPTIONS
    popupOption,
    setPopupOption,
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
            {popupOption?.type === "categoryForm" && <CategoryForm />}

            {/* FAQ */}
            {popupOption?.type === "faqForm" && <FaqForm />}
            {popupOption?.type === "viewOrder" && <ViewOrder />}

            {/* COUPON CODE */}
            {popupOption?.type === "couponCodeForm" && <CouponForm />}

            {/* REVIEW */}
            {popupOption?.type === "review" && <CreateAndUpdateReview />}

            {/* PACKAGES */}
            {popupOption?.type === "packageForm" && <PackageForm />}
            {popupOption?.type === "packageView" && <PackageView />}

            {/* META DATA */}
            {popupOption?.type === "metaDataForm" && <MetaDataForm />}

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
  return null;
};

// CONTEXT FOR POPUP
export const usePopupContext = () => {
  const { popupOption, setPopupOption } = useContext(ProjectContext);

  return { popupOption, setPopupOption };
};
