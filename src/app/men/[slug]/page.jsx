"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
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
import FilterBar from "@/components/filter/filter";
import ProductListingHeader from "@/components/product/productListingHeader";
import ProductCard from "@/components/product/productCard";

const CategoryPage = () => {
  const { slug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState('grid');
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = MenTopwear.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(MenTopwear.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);

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
            className={`w-5/6 grid ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2'} -m-[.5px] h-fit`}
          >
            {currentItems.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
          </motion.div>
        </motion.div>
        <Pagination className="my-4 w-fit mr-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </motion.div>
    </motion.div >
  );
};

export default CategoryPage;