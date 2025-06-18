import Navbar from "@/components/navbar/navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ShowNavbar from "@/components/navbar/show-navbar";
import { LayoutProps } from "@/lib/types/types";

import { Toaster } from "sonner";
import AuthProvider from "@/provider/AuthProvider";
import QueryProvider from "@/provider/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GlobalContextProvider } from "@/context/store";
import RemoveCheckoutCookie from "@/components/checkout/remove-checkout-cookie";
import NextUIProvider from "@/provider/NextUIProvider";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SGTMake: Your One-Stop Shop for Engineering Services",
  description: "SGTMake is an online store that caters to a wide range of electronic product needs. They offer a comprehensive selection of components and assemblies, making them an ideal resource for various industries and individual projects.",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryProvider>
            <GlobalContextProvider>
              <NextUIProvider>
                <ShowNavbar>
                  <Navbar />
                </ShowNavbar>
                {children}
                {/* <ShowFooter>
                  <Footer />
                </ShowFooter> */}
                <RemoveCheckoutCookie />
                <ReactQueryDevtools />
              </NextUIProvider>
            </GlobalContextProvider>
          </QueryProvider>
        </AuthProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
