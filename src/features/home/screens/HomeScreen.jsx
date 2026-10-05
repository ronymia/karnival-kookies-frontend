import ProductCard from "@/components/ui/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/products";
import Heading from "@/components/ui/heading/Heading";
import HomeSearchWrapper from "@/components/ui/searchfields/HomeSearchWrapper";
import NavigateHandler from "@/components/ui/buttons/NavigateHandler";
import FixedBgComponent from "@/components/layouts/FixedBgComponent";
import CategorySection from "@/components/CategorySection";
import HeroSection from "../components/HeroSection";

// Resilient Fetch Data Function with 6s timeout and Next.js revalidation
const fetchData = async (endpoint) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api${endpoint}`,
      {
        signal: controller.signal,
        next: { revalidate: 60 },
        headers: { "Content-Type": "application/json" },
      }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[SSR Fetch Notice] ${endpoint} skipped: ${error.message}`);
    return null;
  }
};

export default async function HomeScreen() {
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
    {
      id: 1,
      image: "/chocolate.jpg",
      badge: "Handcrafted Artisan Delights",
      title: "Rich Belgian Chocolate",
      highlight: "& Truffle Bites",
      description:
        "Crafted with pure single-origin cocoa, velvety ganache, and decadent golden dust for the ultimate luxury indulgence.",
      primaryCta: { text: "Order Sweet Box", href: "/shop-product" },
      secondaryCta: { text: "Explore Flavors", href: "/shop-product" },
    },
    {
      id: 2,
      image: "/cake.jpg",
      badge: "Baked Fresh Daily",
      title: "Signature Gourmet",
      highlight: "& Celebration Cakes",
      description:
        "Mouthwatering layered cakes baked fresh to order with premium Madagascar vanilla and rich buttercream frostings.",
      primaryCta: { text: "Explore Cakes", href: "/shop-product" },
      secondaryCta: { text: "Custom Orders", href: "/contacts" },
    },
    {
      id: 3,
      image: "/cherry.jpg",
      badge: "Seasonal Berry Specials",
      title: "Wild Black Cherry",
      highlight: "& Glazed Treats",
      description:
        "Sweet, tart, and sun-ripened berries folded into golden flaky pastries and creamy gourmet cookie doughs.",
      primaryCta: { text: "View Seasonal", href: "/shop-product" },
      secondaryCta: { text: "See Menu", href: "/shop-product" },
    },
    {
      id: 4,
      image: "/candy.jpg",
      badge: "Carnival Sweet Sensations",
      title: "Crispy Sugar Sprinkles",
      highlight: "& Carnival Flavors",
      description:
        "A joyful explosion of vibrant colors, crunchy textures, and nostalgic carnival flavors designed to brighten your day.",
      primaryCta: { text: "Shop Carnival Box", href: "/shop-product" },
      secondaryCta: { text: "Combo Packages", href: "/shop-product" },
    },
  ];

  return (
    <div className="flex flex-col gap-8 sm:gap-14 lg:gap-20 overflow-hidden pb-12 sm:pb-16 lg:pb-20">
      {/* <------------------------ BANNER SLIDER ---------------------------> */}
      <HeroSection
        slides={slides}
        running={true}
        dots={true}
        prevNextBtn={true}
      />

      {/* <------------------------------ FEATURED PRODUCTS ------------------------------------> */}
      <section className="space-y-5 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 md:px-10">
        {/* <------------------------ HEADING --------------------------> */}
        <Heading
          subHeading="Online Store"
          heading="Discover Sweet Delights"
        />

        {/* <------------------------ SEARCH BOX FOR FEATURE PRODUCTS --------------------------> */}
        <HomeSearchWrapper />

        {/* <------------------------ FEATURE PRODUCT LIST --------------------------> */}
        {products?.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <ProductGridSkeleton count={4} />
        )}

        {/* <------------------------ NAVIGATION --------------------------> */}
        <div className="flex flex-col justify-center items-center pt-2">
          <NavigateHandler text="Explore All Products" route="/shop-product" />
        </div>
      </section>

      {/* <------------------------ BRAND STATEMENT BANNER (MOTION PARALLAX) --------------------------> */}
      <section className="relative w-full">
        <FixedBgComponent
          imagePath="/chocolate.jpg"
          wrapperClass="py-20 sm:py-28 md:py-36"
          component={
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-primary/90">
                Artisan Confectionery
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
                Crafted with Pure Passion & Finest Ingredients
              </h2>
              <p className="text-neutral-300 text-xs sm:text-base font-light max-w-2xl leading-relaxed">
                From velvety Belgian chocolates to golden crumb pastries, every
                bite is baked fresh to perfection for unforgettable indulgence.
              </p>
            </div>
          }
        />
      </section>

      {/* <------------------------------ PACKAGES ------------------------------------> */}
      <section className="space-y-5 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 md:px-10">
        {/* <------------------------ HEADING --------------------------> */}
        <Heading
          subHeading="Special Bundles"
          heading="Signature Treat Packages"
        />

        {/* <------------------------ SEARCH BOX FOR FEATURE PRODUCTS --------------------------> */}
        <HomeSearchWrapper />

        {/* <------------------------ PACKAGE LIST --------------------------> */}
        {packages?.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <ProductGridSkeleton count={4} />
        )}

        {/* <------------------------ NAVIGATE TO PRODUCT PAGE --------------------------> */}
        <div className="flex flex-col justify-center items-center pt-2">
          <NavigateHandler text="Explore All Packages" route="/shop-product" />
        </div>
      </section>
    </div>
  );
}
