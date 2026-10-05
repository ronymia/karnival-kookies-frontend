import HomeScreen from "@/features/home/screens/HomeScreen";

export async function generateMetadata() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1.0/meta-data?meta_key=home_page`,
      {
        signal: controller.signal,
        next: { revalidate: 120 },
      }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const result = await res.json();
      const metadata = result?.data?.[0] || {};
      return {
        title: metadata?.title || "Karnival Kookies | Home",
        description: metadata?.description || "Artisanal gourmet cookies and handcrafted sweet treats.",
      };
    }
  } catch {
    clearTimeout(timeoutId);
  }

  return {
    title: "Karnival Kookies | Home",
    description: "Artisanal gourmet cookies and handcrafted sweet treats.",
  };
}

export default async function HomePage() {
  return <HomeScreen />;
}
