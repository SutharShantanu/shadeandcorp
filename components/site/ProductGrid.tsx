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
              "gap-4 sm:gap-6 space-y-4 sm:space-y-6 [&>div]:break-inside-avoid",
              filters.columns === "2" && "columns-1 sm:columns-2",
              filters.columns === "4" &&
                "columns-1 sm:columns-2 lg:columns-3 xl:columns-4",
              (!filters.columns || filters.columns === "3") &&
                "columns-1 sm:columns-2 lg:columns-3",
            ),
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
              layout: { duration: 0.3, ease: "easeOut" },
            }}
          >
            <ProductCard
              product={product}
              layout={(filters.view as "grid" | "list") || "grid"}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
