import ProjectProvider from "@/providers/ProjectProvider";
import { Cormorant } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/shared/Footer";
import ReduxProvider from "@/providers/ReduxProvider";
import LiveChat from "@/components/layouts/LiveChat";
import AuthProvider from "@/providers/AuthProvider";
import Navbar from "@/components/layouts/Navbar";
import AppErrorBoundary from "@/components/AppErrorBoundary";

const cormorant = Cormorant({ subsets: ["latin"] });

export const metadata = {
  title: "Karnival Kookies",
  description: "Default Description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="defaultTheme" suppressHydrationWarning>
      {/* <=================== HEAD ===================> */}
      <head>
        <link rel="icon" type="image/svg+xml" href="/cremeLogo.png" />
      </head>

      {/* <=================== BODY ===================> */}
      <body
        className={`${cormorant.className} antialiased relative`}
        suppressHydrationWarning
      >
        <AppErrorBoundary>
          <ReduxProvider>
            <AuthProvider>
              <ProjectProvider>
                {/* <=================== NAVBAR ===================> */}
                <Navbar />

                {/* <=================== MAIN CONTENT ==================> */}
                <main className="">{children}</main>

                {/* <=================== FOOTER ===================> */}
                <Footer />

                {/* <=================== LIVE CHAT ===================> */}
                <LiveChat />

                {/* <=================== NOTIFICATION TOASTER ===================> */}
                <Toaster position="top-right" />
              </ProjectProvider>
            </AuthProvider>
          </ReduxProvider>
        </AppErrorBoundary>
      </body>
    </html>
  );
}
