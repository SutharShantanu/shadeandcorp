// CategoryPage.jsx
"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/productCard";
import { MenTopwear } from "@/dummy/clothes";
import FilterBar from "@/components/filter/filter";
import ProductListingHeader from "@/components/product/productListingHeader";
import { useState } from "react";

const CategoryPage = () => {
  const { slug } = useParams();
  const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
  const [layout, setLayout] = useState('grid');

  const handleLayoutChange = (selectedLayout) => {
    setLayout(selectedLayout);
  };

  return (
    <motion.div className="py-6 container mx-auto">
      <motion.div className="flex flex-col">
        <motion.div className="flex items-center gap-x-2 justify-between">
          <h1 className="text-heading mb-6">Men's {capitalizedSlug}</h1>
          <ProductListingHeader
            layout={layout}
            onLayoutChange={handleLayoutChange}
          />
        </motion.div>
        <motion.div className="flex gap-2 justify-between">
          <FilterBar />
          <motion.div
            className={`w-5/6 grid ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2'} gap-2`}
          >
            {MenTopwear.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div >
  );
};

export default CategoryPage;
