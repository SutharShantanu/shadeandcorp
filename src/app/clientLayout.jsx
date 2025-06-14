"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/components/loading";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import ScrollProgressBar from "@/components/ui/scrollTop";

export default function ClientLayout ({ children }) {
    const pathname = usePathname();
    const noMarginPages = ["/login", "/signup", "/"];

    return (
        <Suspense fallback={<Loading />}>
            <Navbar />
            <motion.div className={noMarginPages.includes(pathname) ? "mt-[60px]" : "mt-[99px]"}>
                {children}
                <Toaster richColors position="bottom-right" />
                <Footer />
            </motion.div>
            <ScrollProgressBar showPercentage />
        </Suspense>
    );
}
