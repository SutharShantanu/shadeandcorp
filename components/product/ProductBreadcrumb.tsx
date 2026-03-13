"use client";

import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function ProductBreadcrumb({
  category,
  title,
  slug,
}: {
  category: string;
  title: string;
  slug: string;
}) {
  return (
    <div className="inline-flex items-center bg-muted/60 border border-border/50 rounded-full px-2 py-1 pr-1 backdrop-blur-sm">
      <Breadcrumb>
        <BreadcrumbList className="gap-1 sm:gap-1.5 text-xs flex-nowrap">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-foreground font-semibold transition-colors"
              >
                <Home className="w-3 h-3" />
                <span>Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-3 h-3" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
                className="capitalize hover:text-foreground font-semibold transition-colors"
              >
                {category}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-3 h-3" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-full truncate font-semibold max-w-[140px] sm:max-w-[200px]">
              {title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
