"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import NavigateHomeButton from "@/components/NavigateHomeButton";

interface AuthImageSideProps {
  title: string;
  description: string;
  keywords?: string;
}

export default function AuthImageSide({
  title,
  description,
  keywords = "nature",
}: AuthImageSideProps) {
  const imageUrl = `https://loremflickr.com/800/1200/${keywords}`;

  return (
    <div className="relative w-full md:w-5/12 h-40 md:h-auto overflow-hidden group">
      <NavigateHomeButton />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
      <Image
        src={imageUrl}
        alt={title}
        width={800}
        height={1200}
        className="object-cover w-full h-full transform transition-transform duration-1000 group-hover:scale-105"
        priority
        unoptimized
      />
      <div className="absolute bottom-8 left-8 right-8 z-20 text-balance hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">
            {title}
          </h2>
          <p className="text-white/80 text-sm drop-shadow">
            {description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
