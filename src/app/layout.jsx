import ProjectProvider from "@/Context/ProjectProvider";
import { Cormorant } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/Shared/Footer";
import ReduxProvider from "@/redux/ReduxProvider";
import LiveChat from "@/components/layouts/LiveChat";
import AuthProvider from "@/Context/AuthProvider";
import Navbar from "@/components/layouts/Navbar";

const cormorant = Cormorant({ subsets: ["latin"] });

export const metadata = {
  title: "Karnival Kookies",
  description: "Default Description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cormorant.className} antialiased relative`}>
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
      </body>
    </html>
  );
}
