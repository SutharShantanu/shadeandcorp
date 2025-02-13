"use client";

import { useParams } from "next/navigation";

const CategoryPage = () => {
  const { slug } = useParams(); // Correct parameter name

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Men's {slug}</h1>
    </div>
  );
};

export default CategoryPage;
