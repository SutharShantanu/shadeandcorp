"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/productCard";
import { MenTopwear } from "@/dummy/clothes";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const CategoryPage = () => {
  const { slug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = MenTopwear.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(MenTopwear.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <motion.div className="py-6 container mx-auto">
      <h1 className="text-title font-forum mb-6 text-foreground">Men's {slug}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {currentItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-primary-default text-primary-foreground rounded-lg"
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={`page-${index + 1}`}>
              <PaginationLink
                isActive={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
                className="bg-primary-default text-primary-foreground border-border rounded-md"
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-primary-default text-primary-foreground rounded-lg"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </motion.div>
  );
};

export default CategoryPage;