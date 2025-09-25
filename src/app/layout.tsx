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
import CurrencyOutProvider from "@/provider/CurrencyProvider";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sgtmake.com"),
  title: {
    default: "SGTMake: Your One-Stop Shop for Engineering Services",
    template: "%s | SGTMake",
  },
  description:
    "SGTMake provides engineering services, electronic components, CNC machining, 3D printing, laser cutting, wiring harnesses, and more.",
  keywords: [
    "SGTMake",
    "engineering services",
    "CNC machining",
    "3D printing",
    "laser cutting",
    "wiring harness",
    "electronics",
  ],
  openGraph: {
    title: "SGTMake: Your One-Stop Shop for Engineering Services",
    description:
      "Explore CNC machining, 3D printing, laser cutting, connectors, and engineering services at SGTMake.",
    url: "https://www.sgtmake.com",
    siteName: "SGTMake",
    images: [
      {
        url: "https://www.sgtmake.com/og-image.png", // add a real image in /public
        width: 1200,
        height: 630,
        alt: "SGTMake Engineering Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SGTMake: Engineering Services Hub",
    description:
      "SGTMake provides CNC machining, 3D printing, laser cutting, connectors, and electronic assemblies.",
    images: ["https://www.sgtmake.com/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryProvider>
            <GlobalContextProvider>
              <NextUIProvider>
                <CurrencyOutProvider>
                <ShowNavbar>
                  <Navbar />
                </ShowNavbar>
                {children}
                </CurrencyOutProvider>
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
