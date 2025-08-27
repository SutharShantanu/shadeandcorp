import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

const Pagination = ({
  className,
  ...props
}) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props} />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-3", className)}
    {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex rounded-full text-xs items-center justify-center transition-colors focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
      {
        "bg-accent-default hover:bg-accent-default/80 text-primary-foreground": isActive,
        "bg-primary-default/10 hover:text-accent-foreground": !isActive,
        "w-7 h-7": size === "icon",
        "px-3 py-1.5": size !== "icon",
      },
      className
    )}
    {...props} />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <PaginationLink
          aria-label="Go to previous page"
          size="icon"
          className={cn(" cursor-pointer bg-primary-default hover:bg-primary-default/80 rounded-xs", className)}
          {...props}>
          <ChevronLeft className="h-4 w-4 text-primary-foreground" />
        </PaginationLink>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        Previous Page
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}) => (
  <TooltipProvider>

    <Tooltip>
      <TooltipTrigger>
        <PaginationLink
          aria-label="Go to next page"
          size="icon"
          className={cn(" cursor-pointer bg-primary-default hover:bg-primary-default/80 rounded-xs", className)}
          {...props}>
          <ChevronRight className="h-4 w-4 text-primary-foreground" />
        </PaginationLink>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        Next Page
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
