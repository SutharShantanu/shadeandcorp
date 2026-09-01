"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/ProductCard";
import { cn } from "@/lib/utils";
import { IconTile } from "@/components/reui/icon-tile";

export interface CollectionItem {
  id: string;
  title: string;
  tagline: string;
  subtitle: string;
  image: string;
  itemCount?: number;
  stockStatus?: string;
  season: string;
  slug: string;
  featuredProducts?: Product[];
}

export interface CollectionCardProps {
  collection: CollectionItem;
  className?: string;
}

export interface CuratedCollectionsProps {
  collections: CollectionItem[];
  className?: string;
  gridClassName?: string;
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  return (
    <Link
      href={`/products?collection=${collection.slug}`}
      className="block w-full h-full group/card"
    >
      <Card
        className={cn(
          "w-full h-full flex flex-col justify-between overflow-hidden transition-all ease-in-out p-0 border-0 bg-card",
          className,
        )}
      >
        {/* Collection Hero Image Header */}
        <div className="relative h-88 sm:h-96 overflow-hidden">
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            className="object-cover object-center group-hover/card:scale-105 transition-transform duration-700 transform-gpu"
          />
          {/* Base subtle bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent pointer-events-none" />
          {/* Subtle extended hover gradient anchored at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-black/0 opacity-0 group-hover/card:opacity-100 origin-bottom transition-opacity duration-500 ease-out pointer-events-none" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <Badge variant="primary-outline">{collection.season}</Badge>
            <Badge variant="invert" className="font-mono">
              {collection.stockStatus || "Limited Stock"}
            </Badge>
          </div>

          <CardHeader className="absolute bottom-5 left-5 right-5 z-10 p-0 flex flex-col gap-2">
            <div className="flex items-end justify-between w-full gap-4">
              <div className="pr-2">
                <CardDescription className="text-3xs font-mono tracking-widest uppercase text-warning font-bold block mb-1">
                  {collection.tagline}
                </CardDescription>
                <CardTitle className="text-2xl font-extrabold tracking-tight text-white">
                  {collection.title}
                </CardTitle>
              </div>
              <IconTile
                variant="solid"
                size="sm"
                radius="full"
                className="opacity-0 scale-75 group-hover/card:opacity-100 group-hover/card:scale-100 transition-all ease-in-out backdrop-blur-md shrink-0"
              >
                <ArrowUpRight className="size-5" />
              </IconTile>
            </div>

            <CardDescription className="line-clamp-2 leading-relaxed text-white/80 text-xs sm:text-sm">
              {collection.subtitle}
            </CardDescription>
          </CardHeader>
        </div>
      </Card>
    </Link>
  );
}

export default function CuratedCollections({
  collections,
  className,
  gridClassName,
}: CuratedCollectionsProps) {
  return (
    <div className={cn("space-y-12", className)}>
      <div
        className={cn("grid grid-cols-1 lg:grid-cols-3 gap-2", gridClassName)}
      >
        {collections.map((col, idx) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <CollectionCard collection={col} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
