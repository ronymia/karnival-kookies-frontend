import { usePopupContext } from "@/Context/ProjectProvider";
import { getFullImageLink } from "@/Utils/getFullImageLink";

const ProductComponent = () => {
  const { popupOption } = usePopupContext();
  console.log({ popupOption });
  const { paymentInfo } = popupOption?.data;

  return (
    <div className={`space-y-5`}>
      {paymentInfo?.map((item, index) => (
        <div
          className={`flex items-center bg-base-100 gap-2 sm:gap-5 shadow-xl max-w-[800px] w-full p-1 sm:px-4 sm:py-2 rounded-[5px] relative`}
          key={item?.id}
        >
          <img
            className={` w-[70px] sm:w-[100px]`}
            src={getFullImageLink(item?.product?.images[0]?.file, "Products")}
            alt={item?.product?.name}
          />
          <div className={`flex flex-col justify-between gap-5 flex-grow`}>
            <div className={` space-y-1`}>
              <h3
                className={`text-[12px] text-primary sm:text-base font-semibold mr-3`}
              >
                {item?.product?.name}
              </h3>
              <h3 className={`text-primary font-[20px]`}>
                ${" "}
                {item?.product?.discountPrice
                  ? item?.product?.discountPrice
                  : item?.product?.regularPrice}
              </h3>
              <h3 className={`text-primary font-[20px]`}>
                Quantity: {item?.quantity}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductComponent;
