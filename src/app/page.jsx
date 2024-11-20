import NavigateHandler from "@/Shared/Buttons/NavigateHandler";
import FixedBgComponent from "@/Shared/FixedBgComponent";
import Heading from "@/Shared/Heading";
import ProductCard from "@/Shared/ProductCard";
import HomeSearchWrapper from "@/Shared/SearchFields/HomeSearchWrapper";
import CategorySection from "./CategorySection";
import Slider from "./slider";

export default async function page({ searchParams }) {
  console.log({ searchParams });

  try {
    // Fetch products
    const productRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/get/random?page=${
        searchParams?.page || 1
      }&perPage=${searchParams?.perPage || 8}&searchKey=${
        searchParams?.searchKey || ""
      }`
    );
    if (!productRes.ok) throw new Error("Failed to fetch products");
    const productByRandom = await productRes.json();

    // Fetch categories
    const categoryRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`
    );
    if (!categoryRes.ok) throw new Error("Failed to fetch categories");
    const categories = await categoryRes.json();

    console.log({
      productByRandom: productByRandom?.data,
      categories: categories?.data[0],
    });

    const tabs = categories?.data?.map((category) => ({
      id: category?.id,
      name: category?.name,
    }));

    // Slider images
    const images = [
      { id: 1, image: "/chocolate.jpg" },
      { id: 2, image: "/cake.jpg" },
      { id: 3, image: "/cherry.jpg" },
      { id: 4, image: "/candy.jpg" },
    ];
    const slides = images?.map((image) => image?.image);

    return (
      <div className="flex flex-col gap-20 overflow-hidden pb-20">
        {/* SLIDER */}
        <Slider
          prevNextBtn
          img={slides}
          running={true}
          dots={true}
          borderWidth={2}
          borderClr={"#000"}
        />

        {/* FEATURED PRODUCTS */}
        <div className="space-y-10">
          <Heading
            subHeading={"Online Store"}
            heading={"Discover Sweet Delicious"}
          />
          <HomeSearchWrapper />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productByRandom?.data?.data?.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>
          <div className="flex flex-col justify-center items-center">
            <NavigateHandler text={"Online Store"} route={"/products"} />
          </div>
        </div>

        {/* FIXED COMPONENT */}
        <div className="relative">
          <FixedBgComponent
            component={
              <div className="text-3xl md:text-6xl font-bold text-base-300 space-y-5 text-center relative">
                <p>Made with love</p>
                <p>
                  <span className="text-primary">unique sweets</span> for
                  gourmet
                </p>
                <div className="w-full flex justify-center items-center absolute -top-10 rotating-square">
                  <p className="h-32 md:h-48 w-32 md:w-48 border border-primary"></p>
                </div>
              </div>
            }
          />
        </div>

        {/* CATEGORY */}
        <div className="px-5 md:px-10 mb-20">
          <CategorySection tabs={tabs} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Failed to load data</div>;
  }
}
