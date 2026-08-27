import ProductCard from "@/components/ui/ProductCard";
import Slider from "./slider";
import Heading from "@/components/ui/heading/Heading";
import HomeSearchWrapper from "@/components/ui/searchfields/HomeSearchWrapper";
import NavigateHandler from "@/components/ui/buttons/NavigateHandler";
import FixedBgComponent from "@/components/layouts/FixedBgComponent";
import axios from "axios";
import CategorySection from "@/components/CategorySection";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000 * 30, // Request timeout (accommodates cold start)
});

// Fetch Data Function
const fetchData = async (endpoint) => {
  try {
    const { data } = await api.get(endpoint);
    return data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    return null;
  }
};

export async function generateMetadata() {
  try {
    const result = await api.get(`/v1.0/meta-data?meta_key=home_page`);
    const metadata = result.data?.data[0] || {};

    return {
      title: metadata?.title || "Karnival Kookies | Home",
      description: metadata?.description || "This is the landing page",
    };
  } catch {
    return {
      title: "Karnival Kookies | Home",
      description: "This is the landing page",
    };
  }
}

export default async function HomePage() {
  // FETCH PRODUCT, CATEGORY, PACKAGE
  const [productData, categoryData, packageData] = await Promise.all([
    fetchData(`/v1.0/products?page=1&limit=8`),
    fetchData(`/v1.0/categories`),
    fetchData(`/v1.0/packages`),
  ]);
  const products = productData?.data || [];
  const categories = categoryData?.data || [];
  const packages = packageData?.data || [];

  // CATEGORY TAB
  const tabs = categories.map((category) => ({
    id: category?.id,
    name: category?.name,
  }));

  const slides = [
    { id: 1, image: "/chocolate.jpg" },
    { id: 2, image: "/cake.jpg" },
    { id: 3, image: "/cherry.jpg" },
    { id: 4, image: "/candy.jpg" },
  ].map((image) => image.image);

  return (
    <div className="flex flex-col gap-20 overflow-hidden pb-20">
      {/* <------------------------ BANNER SLIDER ---------------------------> */}
      <Slider
        prevNextBtn
        img={slides}
        running={true}
        dots={true}
        borderWidth={2}
        borderClr={"#000"}
      />

      {/* <------------------------------ FEATURED PRODUCTS ------------------------------------> */}
      <section className="space-y-10">
        {/* <------------------------ HEADING --------------------------> */}
        <Heading
          subHeading={"Online Store"}
          heading={"Discover Sweet Delicious"}
        />

        {/* <------------------------ SEARCH BOX FOR FEATURE PRODUCTS --------------------------> */}
        <HomeSearchWrapper />

        {/* <------------------------ FEATURE PRODUCT LIST --------------------------> */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        {/* <------------------------ NAVIGATION --------------------------> */}
        <div className="flex flex-col justify-center items-center">
          <NavigateHandler text={"Online Store"} route={"/products"} />
        </div>
      </section>

      {/* <------------------------ FIX BG COMPONENT --------------------------> */}
      <section className="relative">
        <FixedBgComponent
          component={
            <div className="text-3xl md:text-6xl font-bold text-base-300 space-y-5 text-center relative">
              <p>Made with love</p>
              <p>
                <span className="text-primary">unique sweets</span> for gourmet
              </p>
            </div>
          }
        />
      </section>

      {/* <------------------------ CATEGORY SECTION --------------------------> */}
      <section className="px-5 md:px-10 mb-20">
        <CategorySection tabs={tabs} />
      </section>

      {/* <------------------------ PACKAGES SECTION --------------------------> */}
      <section className="px-5 md:px-10 mb-20">
        {/* <------------------------ HEADING --------------------------> */}
        <Heading subHeading={"Online Store"} heading={"Combo Packages"} />

        {/* <------------------------ PACKAGE LIST --------------------------> */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        {/* <------------------------ NAVIGATE TO PRODUCT PAGE --------------------------> */}
        <div className="flex flex-col justify-center items-center">
          <NavigateHandler text={"See More"} route={"/products"} />
        </div>
      </section>
    </div>
  );
}
