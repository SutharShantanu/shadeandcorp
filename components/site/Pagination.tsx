"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  showFirstLast?: boolean;
}

export default function ProductPagination({ totalPages, showFirstLast = true }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentLimit = searchParams.get("limit") || "9";

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value);
    params.set("page", "1"); // Reset to first page when limit changes
    replace(`${pathname}?${params.toString()}`);
  };

  // Show only if there are enough items for multiple pages OR if the user has changed the limit from default
  if (totalPages <= 1 && currentLimit === "9") return null;

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t">
      <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
        <Select
          value={currentLimit}
          onValueChange={handleLimitChange}
        >
          <SelectTrigger className="h-8 w-fit">
            <SelectValue placeholder={currentLimit} />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem value="9">9</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
            <SelectItem value="96">96</SelectItem>
          </SelectContent>
        </Select>
        <span>Per Page</span>
      </div>

      {totalPages > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            {showFirstLast && (
              <PaginationItem>
                <PaginationFirst
                  href={createPageURL(1)}
                  aria-disabled={currentPage <= 1}
                  className={currentPage <= 1 ? "pointer-events-none" : ""}
                />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationPrevious
                href={createPageURL(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage <= 1}
                className={currentPage <= 1 ? "pointer-events-none" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
                href={createPageURL(Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage >= totalPages}
                className={currentPage >= totalPages ? "pointer-events-none" : ""}
              />
            </PaginationItem>

            {showFirstLast && (
              <PaginationItem>
                <PaginationLast
                  href={createPageURL(totalPages)}
                  aria-disabled={currentPage >= totalPages}
                  className={currentPage >= totalPages ? "pointer-events-none" : ""}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
