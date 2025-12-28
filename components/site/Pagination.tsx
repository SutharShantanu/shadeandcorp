"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
    totalPages: number;
}

export default function ProductPagination({ totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={createPageURL(currentPage - 1)} 
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Simple pagination logic for now (show all or limited range)
            // Showing all if pages < 7, otherwise ellipsis logic could be added.
            // For simplicity in this iteration, we show start, current, end logic or just max 5.
            // Let's implement a simple version first.
            if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
                return (
                    <PaginationItem key={page}>
                        <PaginationLink href={createPageURL(page)} isActive={page === currentPage}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
            
            if (
                (page === currentPage - 2 && currentPage > 3) ||
                (page === currentPage + 2 && currentPage < totalPages - 2)
            ) {
                return (
                    <PaginationItem key={page}>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            return null;
        })}

        <PaginationItem>
          <PaginationNext 
            href={createPageURL(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
