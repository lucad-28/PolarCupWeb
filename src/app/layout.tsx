import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClientSessionProvider } from "@/components/ClientSessionProvider";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Toaster } from "@/components/ui/sonner";

const roboto = localFont({
  src: [
    {
      path: "./fonts/roboto/Roboto-Thin.woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/roboto/Roboto-ThinItalic.woff",
      weight: "100",
      style: "italic",
    },
    {
      path: "./fonts/roboto/Roboto-ExtraLight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/roboto/Roboto-ExtraLightItalic.woff",
      weight: "200",
      style: "italic",
    },
    {
      path: "./fonts/roboto/Roboto-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/roboto/Roboto-LightItalic.woff",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/roboto/Roboto-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/roboto/Roboto-Italic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/roboto/Roboto-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/roboto/Roboto-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/roboto/Roboto-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/roboto/Roboto-SemiBoldItalic.woff",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/roboto/Roboto-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/roboto/Roboto-BoldItalic.woff",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/roboto/Roboto-ExtraBold.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/roboto/Roboto-ExtraBoldItalic.woff",
      weight: "800",
      style: "italic",
    },
    {
      path: "./fonts/roboto/Roboto-Black.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/roboto/Roboto-BlackItalic.woff",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});

const robotoCondensed = localFont({
  src: [
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-Thin.woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-ThinItalic.woff",
      weight: "100",
      style: "italic",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-ExtraLight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-ExtraLightItalic.woff",
      weight: "200",
      style: "italic",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-LightItalic.woff",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-Italic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-SemiBoldItalic.woff",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-BoldItalic.woff",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-ExtraBold.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-ExtraBoldItalic.woff",
      weight: "800",
      style: "italic",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-Black.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/roboto-condensed/Roboto_Condensed-BlackItalic.woff",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-roboto-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PolarCup",
  description: "PolarCup interface to manage your devices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${robotoCondensed.variable} font-sans antialiased`}
      >
        <ClientSessionProvider>
          <Toaster />
          <LoadingScreen>{children}</LoadingScreen>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
