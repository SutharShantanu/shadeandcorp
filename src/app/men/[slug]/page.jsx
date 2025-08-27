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
import { Frame, MarsStroke, PaintBucket, Shirt, Transgender, Venus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PageHeader from "@/components/header/sectionHeader";

const CategoryPage = () => {
  const { slug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState('grid');
  const [appliedFilters, setAppliedFilters] = useState({
    Gender: ["Men"],
    Category: ["T-Shirts", "Jeans"],
    Color: ["Blue"],
    Size: [],
    Brand: ["Nike"],
  });

  const removeFilter = (category, filterToRemove) => {
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category].filter((filter) => filter !== filterToRemove),
    }));
    toast.success(`Removed ${filterToRemove} from ${category}`);
  };


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
        <motion.div className="flex items-center gap-2 justify-between mb-2">
          <PageHeader titlePrefix="Men's " totalResults="5" showingResults="Showing of results" />
          <motion.div className="flex items-center gap-2">
            <AppliedFilters appliedFilters={appliedFilters} onRemoveFilter={removeFilter} />
            <ProductListingHeader
              layout={layout}
              onLayoutChange={handleLayoutChange}
            />
          </motion.div>
        </motion.div>
        <motion.div className="flex gap-2 justify-between">
          <FilterBar />
          <motion.div className="w-5/6 h-fit">
            <motion.div
              className={`w-full grid gap-2 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2'} -m-[.5px]`}
            >
              {currentItems.map((product, index) => (
                <ProductCard key={product.id || index} product={product} />
              ))}
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
        </motion.div>
      </motion.div >
    </motion.div >
  );
};

const getCategoryIcon = (category, value) => {
  switch (category) {
    case "Category":
      return <Shirt className="w-4 h-4" />;
    case "Color":
      return <PaintBucket className="w-4 h-4" />;
    case "Gender":
      return value === "Men" ? <MarsStroke className="w-4 h-4" /> :
        value === "Women" ? <Venus className="w-4 h-4" /> :
          <Transgender className="w-4 h-4" />;
    case "Brand":
      return <Frame className="w-4 h-4" />;
    default:
      return null;
  }
};

const AppliedFilters = ({ appliedFilters, onRemoveFilter }) => {
  return (
    <motion.div className="flex flex-wrap gap-4 p-2 border border-border rounded-xs">
      {Object.entries(appliedFilters).map(([category, values]) =>
        values.length > 0 ? (
          <motion.div key={category} className="flex items-center gap-2 bg-muted-foreground/20 rounded-full pl-2">
            <motion.div className="text-gray-700 flex items-center gap-1 ">
              {getCategoryIcon(category, values[0])}
            </motion.div>
            <motion.div className="flex flex-wrap gap-2">
              {values.map((filter, index) => (
                <Badge
                  key={index}
                  className="flex items-center gap-2 bg-muted-foreground"
                >
                  {filter}
                  <Button
                    size="icon"
                    onClick={() => onRemoveFilter(category, filter)}
                    className="h-fit w-fit cursor-pointer"
                  >
                    <X size={14} />
                  </Button>
                </Badge>
              ))}
            </motion.div>
          </motion.div>
        ) : null
      )}
    </motion.div>
  );
};

export default CategoryPage;