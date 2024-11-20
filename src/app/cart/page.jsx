"use client";
import { getAllCartItems } from "@/apis/carts";
import { useAuthContext, useCartContext } from "@/Context/ProjectProvider";
import Button from "@/Shared/Button";
import CustomLoading from "@/Shared/CustomLoading";
import CustomToaster from "@/Shared/CustomToaster";
import FixedBgComponent from "@/Shared/FixedBgComponent";
import TableComponentHeading from "@/Shared/TableComponentHeading";
import NavigateComponent from "@/Utils/navigate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CartItemsCard from "./CartItemsCard";
import PrivateRoute from "@/Routes/PrivateRoute";

const Page = () => {
  const {
    checkoutQuantity,
    checkoutTotal,
    selectedItems,
    setSelectedItems,
    checkedId,
    setCheckedId,
  } = useCartContext();
  console.log({ selectedItems });
  const router = useRouter();
  const { user } = useAuthContext();
  const [data, setData] = useState([]);
  console.log({ data });

  const [isUpdating, setIsUpdating] = useState();
  const [isCartLoading, setIsCartLoading] = useState(false);

  useEffect(() => {
    setIsCartLoading(true);
    getAllCartItems({ email: user?.email })
      .then((res) => {
        if (res?.data) {
          console.log({ res });
          setData(res);
          setIsCartLoading(false);
        }
      })
      .catch((err) => {
        setIsCartLoading(false);
        console.log({ err });
      });
  }, [user, isUpdating]);

  //   HANDLE CHECKED
  const handleChecked = (e, item) => {
    const checked = e?.target?.checked;
    setSelectedItems((prev) => {
      if (checked) {
        setCheckedId([...checkedId, item?.id]);
        return [...prev, item];
      } else {
        setCheckedId(checkedId.filter((i) => i !== item?.id));
        return prev.filter((i) => i.id !== item?.id);
      }
    });
  };

  // HANDLE CHECKOUT
  const handleCheckout = () => {
    if (checkoutQuantity > 0) {
      router.push("/cart/checkout");
    } else {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type={"error"}
          text={`You have not selected any item to checkout`}
        />
      ));
    }
  };

  return (
    <PrivateRoute>
      <div className={`flex flex-col gap-20 mb-60`}>
        <FixedBgComponent
          url="/chocolate_bg.jpg"
          wrapperClass={`pt-60 pb-40`}
          component={
            <TableComponentHeading
              routes={
                <div className={`text-[14px]`}>
                  <span className={`text-primary cursor-pointer`}>
                    <NavigateComponent text="Home" route="/" />
                  </span>{" "}
                  {"//"} <span>Cart</span>
                </div>
              }
              heading={"Cart"}
            />
          }
        />
        {data?.data?.length > 0 ? (
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-6 w-full px-5 md:px-10`}
          >
            <div className={`flex flex-col gap-5 mx-auto md:col-span-2 w-full`}>
              {data?.data?.map((item) => (
                <CartItemsCard
                  key={item?.id}
                  item={item}
                  setIsUpdating={setIsUpdating}
                  handleChecked={handleChecked}
                  checked={checkedId}
                />
              ))}
            </div>
            <div className={`flex flex-col gap-3`}>
              <h1 className={`text-[20px] font-black`}>
                Selected for checkout
              </h1>
              <h1 className={`font-medium text-body-sub`}>
                Quantity: {checkoutQuantity}
              </h1>
              <h1 className={`font-medium text-body-sub`}>
                Total: ${checkoutTotal.toFixed(2)}
              </h1>

              <Button text={"Proceed Checkout"} handler={handleCheckout} />
            </div>
          </div>
        ) : (
          <div className={`flex flex-col justify-center items-center`}>
            {/* <img className={`w-[500px] min-w-[280px]`} src={emptyCart} alt="" /> */}
            <div className={`flex flex-col gap-2`}>
              <p
                className={`text-center font-bold text-[20px] text-heading-main`}
              >
                Your cart is empty
              </p>
              <p className={`font-medium text-[14px] text-body-sub mb-3`}>
                Looks like you {"haven't"} added anything to your cart. Go ahead
                and explore shop
              </p>
              <div className={`flex justify-center items-center`}>
                <Button
                  text={"Go To Shop"}
                  handler={() => router.push("/products")}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default Page;
