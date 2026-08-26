"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import CartItemsCard from "./CartItemsCard";
import { useSelector } from "react-redux";
import { useGetCartByEmailQuery } from "@/redux/apis/cartApis";
import { errorHandler } from "@/helpers/errorHandler";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import FixedBgComponent from "@/components/layouts/FixedBgComponent";
import TableComponentHeading from "@/components/ui/table/TableComponentHeading";
import NavigateComponent from "@/components/ui/navigate/navigate";
import Button from "@/components/ui/buttons/Button";
import withAuth from "@/hoc/WithAuth";

function CartPage() {
  const { user } = useSelector((state) => state.auth);
  const { totalQuantity, totalPrice } = useSelector((state) => state.cart);

  const router = useRouter();
  // USER FROM REDUX STORE

  const getCartByEmail = useGetCartByEmailQuery(
    { user_id: user?.id },
    { skip: !user?.id }
  );

  // IF ERROR
  useEffect(() => {
    if (getCartByEmail.isError) {
      errorHandler({ err: getCartByEmail.error });
    }
  }, []);

  // HANDLE CHECKOUT
  const handleCheckout = () => {
    if (totalQuantity > 0) {
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

  if (getCartByEmail.isLoading) {
    return <CustomLoading />;
  }
  return (
    <>
      <div className={`flex flex-col gap-20 mb-60`}>
        {/* <======================= HEADER ================================> */}
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

        {/* <============================= CARD ITEM =================================> */}
        {getCartByEmail.data?.data?.length > 0 ? (
          <section
            className={`grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-6 w-full px-5 md:px-10`}
          >
            {/* <============================= CARD ITEM =================================> */}
            <section
              className={`flex flex-col gap-5 mx-auto md:col-span-2 w-full`}
            >
              {getCartByEmail.data?.data?.map((item) => (
                <CartItemsCard key={item?.id} item={item} />
              ))}
            </section>

            {/* <============================= CHECKOUT =================================> */}
            <section className={`flex flex-col gap-3`}>
              <h1 className={`text-[20px] font-black`}>
                Selected for checkout
              </h1>
              <h1 className={`font-medium text-body-sub`}>
                Quantity: {totalQuantity}
              </h1>
              <h1 className={`font-medium text-body-sub`}>
                Total: ${totalPrice?.toFixed(2)}
              </h1>

              <Button
                type={`button`}
                text={"Proceed Checkout"}
                handler={handleCheckout}
              />
            </section>
          </section>
        ) : (
          <section className={`flex flex-col justify-center items-center`}>
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
                  type={`button`}
                  text={"Go To Shop"}
                  handler={() => router.push("/products")}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default withAuth(CartPage);
