"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CategoryType = {
  id: string;
  name: string;
  image: string;
  description: string;
  link: string;
  itemsCount?: number;
  isNew?: boolean;
  isTrending?: boolean;
  discount?: string;
};

const categories: CategoryType[] = [
  {
    id: "1",
    name: "Men's Clothing",
    image: "/categories/mens-fashion.jpg",
    description: "Contemporary styles for modern men",
    link: "/category/mens",
    itemsCount: 1247,
    isTrending: true,
    discount: "UP TO 40% OFF",
  },
  {
    id: "2",
    name: "Women's Fashion",
    image: "/categories/womens-fashion.jpg",
    description: "Trend-setting pieces for every occasion",
    link: "/category/womens",
    itemsCount: 2156,
    isTrending: true,
    discount: "NEW ARRIVALS",
  },
  {
    id: "3",
    name: "Accessories",
    image: "/categories/accessories.jpg",
    description: "Complete your look with our accessories",
    link: "/category/accessories",
    itemsCount: 843,
    isNew: true,
  },
  {
    id: "4",
    name: "Footwear",
    image: "/categories/footwear.jpg",
    description: "Step out in style with our shoe collection",
    link: "/category/footwear",
    itemsCount: 692,
    discount: "FLAT 30% OFF",
  },
  {
    id: "5",
    name: "Summer Collection",
    image: "/categories/summer.jpg",
    description: "Light and breezy styles for warm days",
    link: "/collection/summer",
    itemsCount: 534,
    isNew: true,
  },
  {
    id: "6",
    name: "Winter Wear",
    image: "/categories/winter.jpg",
    description: "Stay warm and stylish",
    link: "/collection/winter",
    itemsCount: 387,
    isTrending: true,
  },
];

const CategoryCard: React.FC<{ category: CategoryType; index: number }> = ({
  category,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl bg-white">
        <Link href={category.link} className="block">
          <div className="relative aspect-[3/4] overflow-hidden">
            {/* Background Image */}
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {category.discount && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 px-3 py-1 text-xs font-bold">
                  {category.discount}
                </Badge>
              )}
              {category.isNew && (
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0 px-3 py-1 text-xs font-bold">
                  NEW
                </Badge>
              )}
              {category.isTrending && !category.discount && !category.isNew && (
                <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 px-3 py-1 text-xs font-bold">
                  TRENDING
                </Badge>
              )}
            </div>

            {/* Items Count */}
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 text-xs"
              >
                {category.itemsCount}+ items
              </Badge>
            </div>

            {/* Hover Overlay Content */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/70 backdrop-blur-sm rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 font-semibold rounded-full px-6"
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-bold text-lg mb-1 text-gray-900 group-hover:text-black transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {category.description}
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                <span>Explore collection</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
};

export default function ProductCategories() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto ">
        {/* Section Header - Inspired by Myntra/Zara */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 text-sm font-semibold border-gray-300"
          >
            EXPLORE COLLECTIONS
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Shop By Category
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover curated collections inspired by the latest trends from top
            fashion brands
          </p>
        </motion.div>

        {/* Categories Grid - H&M Style Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* View All Button - Zara Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-6 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 font-semibold text-base"
          >
            <Link href="/categories">
              View All Categories
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          </Button>
        </motion.div>

        {/* Quick Links - Myntra Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 md:gap-8 mt-12 pt-8 border-t border-gray-200"
        >
          {[
            { name: "Casual Wear", href: "/style/casual", count: "1.2k" },
            { name: "Formal Attire", href: "/style/formal", count: "856" },
            { name: "Sportswear", href: "/style/sports", count: "723" },
            { name: "Party Dresses", href: "/style/party", count: "634" },
            { name: "Ethnic Wear", href: "/style/ethnic", count: "945" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group flex items-center gap-2 text-gray-600 hover:text-black font-medium transition-colors duration-300"
            >
              <span className="border-b border-transparent group-hover:border-black pb-1">
                {link.name}
              </span>
              <Badge variant="secondary" className="text-xs bg-gray-100">
                {link.count}
              </Badge>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
