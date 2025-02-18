"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/productCard";
import { MenTopwear } from "@/dummy/clothes";
import FilterBar from "@/components/filter/filter";

const CategoryPage = () => {
  const { slug } = useParams();
  const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <motion.div className="py-6 container mx-auto">
      <h1 className="text-heading mb-6">Men's {capitalizedSlug}</h1>
      <motion.div className="flex gap-2 justify-between">
        <FilterBar />
        <motion.div className="w-5/6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {MenTopwear.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CategoryPage;
