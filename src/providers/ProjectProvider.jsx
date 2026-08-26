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
import ReviewForm from "@/app/products/[id]/ReviewForm";
import CustomPopup from "@/components/ui/modal/CustomPopup";
import FileViewer from "@/components/ui/modal/FileViewer";
import { useState } from "react";
import { ProjectContext } from "@/contexts/ProjectContext";

export default function ProjectProvider({ children }) {
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
            {popupOption?.type === "viewUser" && <ViewUser />}
            {popupOption?.type === "userForm" && <UserForm />}
            {popupOption?.type === "productForm" && <ProductForm />}
            {popupOption?.type === "viewProduct" && <ViewProduct />}
            {popupOption?.type === "categoryForm" && <CategoryForm />}
            {popupOption?.type === "faqForm" && <FaqForm />}
            {popupOption?.type === "viewOrder" && <ViewOrder />}
            {popupOption?.type === "couponCodeForm" && <CouponForm />}
            {popupOption?.type === "reviewForm" && <ReviewForm />}
            {popupOption?.type === "packageForm" && <PackageForm />}
            {popupOption?.type === "packageView" && <PackageView />}
            {popupOption?.type === "metaDataForm" && <MetaDataForm />}
            {popupOption?.type === "viewFile" && <FileViewer />}
          </>
        }
      />
      {children}
    </ProjectContext.Provider>
  );
}
