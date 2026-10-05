"use client";

import ReviewForm from "@/app/shop-product/[id]/ReviewForm";
import CustomPopup from "@/components/ui/modal/CustomPopup";
import FileViewer from "@/components/ui/modal/FileViewer";
import { ProjectContext } from "@/contexts/ProjectContext";
import CategoryForm from "@/features/category/components/CategoryForm";
import { CouponCodeForm } from "@/features/coupon-codes";
import { FaqForm } from "@/features/faq";
import { MetaDataForm } from "@/features/meta-data";
import { OrderViewDrawer } from "@/features/orders";
import { PackageForm, PackageViewDrawer } from "@/features/packages";
import { ProductForm } from "@/features/products";
import { UserForm, UserViewDrawer } from "@/features/users";
import { useState } from "react";

export default function ProjectProvider({ children }) {
  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    id: null,
    onClose: () => {
      setPopupOption((prev) => ({ ...prev, open: false }));
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
        popupClasses="w-[70vw] h-[90vh]"
        popupOption={popupOption}
        setPopupOption={setPopupOption}
        Component={
          <>
            {popupOption?.type === "viewUser" && <ViewUser />}
            {popupOption?.type === "userForm" && <UserForm />}
            {popupOption?.type === "productForm" && (
              <ProductForm
                editData={popupOption?.data}
                onClose={popupOption?.onClose}
              />
            )}
            {popupOption?.type === "categoryForm" && <CategoryForm />}
            {popupOption?.type === "faqForm" && (
              <FaqForm
                editData={popupOption?.data}
                onClose={popupOption?.onClose}
              />
            )}
            {popupOption?.type === "couponCodeForm" && (
              <CouponCodeForm
                editData={popupOption?.data}
                onClose={popupOption?.onClose}
              />
            )}
            {popupOption?.type === "reviewForm" && <ReviewForm />}
            {popupOption?.type === "packageForm" && (
              <PackageForm
                editData={popupOption?.data}
                onClose={popupOption?.onClose}
              />
            )}
            {popupOption?.type === "packageView" && (
              <PackageViewDrawer
                isOpen={true}
                data={popupOption?.data}
                onClose={popupOption?.onClose}
              />
            )}
            {popupOption?.type === "metaDataForm" && (
              <MetaDataForm
                editData={popupOption?.data}
                onClose={popupOption?.onClose}
              />
            )}
            {popupOption?.type === "userForm" && (
              <UserForm
                editData={popupOption?.data}
                onClose={popupOption?.onClose}
              />
            )}
            {popupOption?.type === "viewUser" && (
              <UserViewDrawer
                isOpen={true}
                data={popupOption?.data}
                onClose={popupOption?.onClose}
              />
            )}
            {popupOption?.type === "viewOrder" && (
              <OrderViewDrawer
                isOpen={true}
                data={popupOption?.data}
                onClose={popupOption?.onClose}
              />
            )}
            {popupOption?.type === "viewFile" && <FileViewer />}
          </>
        }
      />
      {children}
    </ProjectContext.Provider>
  );
}
