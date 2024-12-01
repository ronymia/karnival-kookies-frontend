import NavigateHandler from "@/Shared/Buttons/NavigateHandler";
import FixedBgComponent from "@/Shared/FixedBgComponent";
import Heading from "@/Shared/Heading";
import ProductCard from "@/Shared/ProductCard";
import HomeSearchWrapper from "@/Shared/SearchFields/HomeSearchWrapper";
import CategorySection from "./CategorySection";
import Slider from "./slider";

// Fetch Data on the Server
async function fetchProducts({ searchParams }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/get/random?page=${
      searchParams?.page || 1
    }&perPage=${searchParams.perPage || 8}&searchKey=${
      searchParams.searchKey || ""
    }`,
    {
      next: {
        revalidate: 30,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function fetchCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`, {
    next: {
      revalidate: 30,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

async function fetchPackages() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/packages`, {
    next: {
      revalidate: 30,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch packages");
  return res.json();
}

export default async function HomePage({ searchParams }) {
  try {
    // Fetch data
    const [products, categories, packages] = await Promise.all([
      fetchProducts(searchParams),
      fetchCategories(),
      fetchPackages(),
    ]);

    const tabs = categories?.data?.map((category) => ({
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
        <section className="space-y-10">
          <Heading
            subHeading={"Online Store"}
            heading={"Discover Sweet Delicious"}
          />
          <HomeSearchWrapper />
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.data?.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </section>
          <div className="flex flex-col justify-center items-center">
            <NavigateHandler text={"Online Store"} route={"/products"} />
          </div>
        </section>

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
              </div>
            }
          />
        </div>

        {/* CATEGORY */}
        <section className="px-5 md:px-10 mb-20">
          <CategorySection tabs={tabs} />
        </section>

        {/* PACKAGES */}
        <section className="px-5 md:px-10 mb-20">
          <Heading subHeading={"Online Store"} heading={"Combo Packages"} />
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages?.data?.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </section>
          <div className="flex flex-col justify-center items-center">
            <NavigateHandler text={"See More"} route={"/products"} />
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Failed to load data</div>;
  }
}
