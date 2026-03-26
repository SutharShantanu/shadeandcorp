"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
  filters: {
    view?: string;
    columns?: string;
  };
}

export default function ProductGrid({ products, filters }: ProductGridProps) {
  const [columnsCount, setColumnsCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      // Logic for grid column counts
      if (window.innerWidth < 640) {
        setColumnsCount(1);
      } else if (window.innerWidth < 1024) {
        setColumnsCount(2);
      } else {
        const preferred = Number(filters.columns);
        setColumnsCount(preferred || 3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [filters.columns]);

  if (filters.view === "list") {
    return (
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {products.map((product: any) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard product={product} layout="list" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  // Split products into columns for masonry look
  const columns = Array.from({ length: columnsCount }, () => [] as any[]);
  products.forEach((product, index) => {
    columns[index % columnsCount].push(product);
  });

  return (
    <div className="flex gap-4 sm:gap-6 items-start">
      {columns.map((columnProducts, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {columnProducts.map((product) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                <ProductCard product={product} layout="grid" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
