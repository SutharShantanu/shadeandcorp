"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/productCard";
import { MenTopwear } from "@/dummy/clothes";

const CategoryPage = () => {
  const { slug } = useParams();

  return (
    <motion.div className="py-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Men's {slug}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {MenTopwear.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryPage;
