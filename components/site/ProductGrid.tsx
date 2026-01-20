"use client";

import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductGridProps {
    products: any[];
    filters: {
        view?: string;
        columns?: string;
    };
}

export default function ProductGrid({ products, filters }: ProductGridProps) {
    return (
        <motion.div
            layout
            className={cn(
                filters.view === "list"
                    ? "flex flex-col gap-4"
                    : cn(
                        "grid gap-6",
                        filters.columns === "2" && "grid-cols-1 sm:grid-cols-2",
                        filters.columns === "4" && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
                        (!filters.columns || filters.columns === "3") && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    )
            )}
        >
            <AnimatePresence mode="popLayout">
                {products.map((product: any) => (
                    <motion.div
                        key={product._id || product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                            duration: 0.3,
                            layout: { duration: 0.3, ease: "easeOut" }
                        }}
                    >
                        <ProductCard
                            product={product}
                            layout={filters.view as "grid" | "list" || "grid"}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
