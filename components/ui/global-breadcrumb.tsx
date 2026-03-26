"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItemProps {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export function GlobalBreadcrumb({ items }: { items: BreadcrumbItemProps[] }) {
  return (
    <div className="inline-flex items-center border rounded-xl px-2 py-1.5 pr-1.5">
      <Breadcrumb>
        <BreadcrumbList className="gap-1 sm:gap-2 text-xs sm:text-sm flex-nowrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="bg-primary/10 text-primary px-2.5 py-1 rounded-full truncate max-w-[140px] sm:max-w-[200px] flex items-center gap-1">
                      {item.icon}
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href || "#"}
                        className="flex items-center gap-1"
                      >
                        {item.icon}
                        <span className="capitalize">{item.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="w-4 h-4" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
