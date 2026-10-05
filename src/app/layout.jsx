import ProjectProvider from "@/providers/ProjectProvider";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/layouts/Footer";
import ReduxProvider from "@/providers/ReduxProvider";
import Navbar from "@/layouts/Navbar";
import AppErrorBoundary from "@/components/AppErrorBoundary";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "Karnival Kookies | Artisanal Gourmet Bakery",
  description: "Artisanal gourmet cookies and handcrafted luxury sweet treats baked fresh daily.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="defaultTheme"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      {/* <=================== HEAD ===================> */}
      <head>
        <link rel="icon" type="image/svg+xml" href="/cremeLogo.png" />
      </head>

      {/* <=================== BODY ===================> */}
      <body
        className={`${plusJakartaSans.className} font-sans bg-[#0B0A0B] text-neutral-200 antialiased relative selection:bg-primary/30 selection:text-white`}
        suppressHydrationWarning
      >
        <AppErrorBoundary>
          <ReduxProvider>
            <ProjectProvider>
              {/* <=================== NAVBAR ===================> */}
              <Navbar />

              {/* <=================== MAIN CONTENT ==================> */}
              <main>{children}</main>

              {/* <=================== FOOTER ===================> */}
              <Footer />

              {/* <=================== NOTIFICATION TOASTER ===================> */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "rgba(24, 21, 19, 0.95)",
                    color: "#f3f4f6",
                    border: "1px solid rgba(210, 152, 44, 0.25)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
                    borderRadius: "16px",
                    fontSize: "14px",
                    fontFamily: "var(--font-sans)",
                  },
                  success: {
                    iconTheme: {
                      primary: "#34d399",
                      secondary: "#181513",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#f43f5e",
                      secondary: "#181513",
                    },
                  },
                }}
              />
            </ProjectProvider>
          </ReduxProvider>
        </AppErrorBoundary>
      </body>
    </html>
  );
}
