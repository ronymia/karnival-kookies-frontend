import FixedBgComponent from "@/Shared/FixedBgComponent";
import TableComponentHeading from "@/Shared/TableComponentHeading";
import { formatRole } from "@/Utils/formatRole";
import { getFullImageLink } from "@/Utils/getFullImageLink";
import NavigateComponent from "@/Utils/navigate";
import axios from "axios";
import ButtonWrapper from "./ButtonWrapper";
import Quantity from "./Quantity";
import ProductCard from "@/Shared/ProductCard";
import Reviews from "./Reviews";

const page = async ({ params }) => {
  const product = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${params?.id}`
  );
  console.log({ productData: product?.data });
  const productByCategory = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/category/${product?.data?.data?.category}?limit=4&skip=${product?.data?.data?.id}`
  );
  console.log({ product: productByCategory?.data });
  return (
    <div>
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
                {"//"}{" "}
                <span className={`text-primary cursor-pointer`}>
                  <NavigateComponent text="Products" route="/products" />
                </span>{" "}
                {"//"}{" "}
                <span className={`text-primary cursor-pointer`}>
                  <NavigateComponent text="Chocolate" route="/" />
                </span>{" "}
                {"//"} <span>All Products</span>
              </div>
            }
            heading={product?.data?.data?.name}
          />
        }
      />
      <div className={`relative`}>
        <img
          className={`absolute w-full -top-2 sm:-top-5 left-0`}
          src="/dark_temp.png"
          alt="dark temp"
        />
        <div
          className={`grid grid-cols-1 md:grid-cols-5 gap-6 py-32 px-5 sm:px-10`}
        >
          <img
            className={`md:col-span-2`}
            src={getFullImageLink(
              product?.data?.data?.images?.length > 0 &&
                product?.data?.data?.images[0]?.file,
              "Products"
            )}
            alt={product?.data?.data?.name}
          />
          <div className={`md:col-span-3 space-y-5`}>
            <p className={`text-primary text-[30px]`}>
              {product?.data?.data?.discountPrice ? (
                <span className={`flex gap-3 items-center`}>
                  <del className={`text-base-200`}>
                    ${product?.data?.data?.regularPrice}
                  </del>
                  <span className={`text-red-500`}>
                    ${product?.data?.data?.discountPrice}
                  </span>
                </span>
              ) : (
                <span className={`text-primary`}>
                  ${product?.data?.data?.regularPrice}
                </span>
              )}
            </p>
            <p>{product?.data?.data?.description?.slice(0, 300)}...</p>
            <div className={`space-x-5`}>
              <ButtonWrapper
                text={"Add to cart"}
                id={product?.data?.data?.id}
              />
            </div>
            <p className={`text-[20px]`}>
              <span className={`text-primary font-bold`}>Category: </span>
              <span>{product?.data?.data?.categoryName}</span>
            </p>
          </div>
        </div>
        <div
          className={`flex flex-col justify-center items-center gap-10 px-5 sm:px-10 pb-40`}
        >
          <h2
            className={`text-[30px] hover:text-primary cursor-pointer border-b-4 border-primary inline-block`}
          >
            Description
          </h2>
          <p>{product?.data?.data?.description}</p>
        </div>
        <Reviews />
        <div
          className={`flex flex-col justify-center items-center gap-10 px-5 sm:px-10 pb-40`}
        >
          <h2 className={`text-[30px]`}>Related products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productByCategory?.data?.data?.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

// export const getServerSideProps = async (context) => {
//   const axiosPublic = useAxiosPublic();
//   const { id } = context.params; // Extract the 'id' from params

//   try {
//     const res = await axiosPublic.get(`/products/${id}`);
//     return {
//       props: {
//         product: res?.data,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         error: "Product not found",
//       },
//     };
//   }
// };
