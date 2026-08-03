import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import LayoutWrapper from "@/components/LayoutWrapper";
import { cn } from "@/lib/utils";
import { Raleway, Inter } from "next/font/google";

const ralewayHeading = Raleway({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shade & Corp",
  description: "Curated selection of premium products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, ralewayHeading.variable)}
    >
      <body
        className="antialiased font-sans"
        suppressHydrationWarning
      >
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
