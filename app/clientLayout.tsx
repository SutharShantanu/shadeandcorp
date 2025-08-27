"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
// import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import Loading from "@/components/ui/loading";
import Footer from "@/components/layout/footer";
import ScrollProgressBar from "@/components/ui/scrollTop";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Config for special routes
  const routeConfig: Record<
    string,
    { hideFooter?: boolean; hideNavbar?: boolean; noMargin?: boolean }
  > = {
    "/login": { hideFooter: true, hideNavbar: true, noMargin: true },
    "/signup": { hideFooter: true, hideNavbar: true, noMargin: true },
    "/forget-password": { hideFooter: true, hideNavbar: true, noMargin: true },
    "/checkout": { hideFooter: false, hideNavbar: false, noMargin: false },
  };

  const currentConfig = routeConfig[pathname] || {};
  const marginTop = currentConfig.noMargin ? "mt-0" : "mt-[99px]";

  return (
    <Suspense fallback={<Loading />}>
      {!currentConfig.hideNavbar && (
        <motion.div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
          {/* <Navbar /> */}
        </motion.div>
      )}

      <motion.div className={marginTop}>
        {children}
        <Toaster richColors position="bottom-right" />

        {!currentConfig.hideFooter && <Footer />}
      </motion.div>

      <ScrollProgressBar />
    </Suspense>
  );
}
