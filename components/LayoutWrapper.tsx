"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

// Auth pages that should not show Navbar and Footer
const authPages = ["/login", "/signup", "/forgot-password", "/reset-password"];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100svh-64px)]">{children}</div>
      <Footer />
    </>
  );
}
