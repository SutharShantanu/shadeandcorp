"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import NavigateHomeButton from "@/components/NavigateHomeButton";
import { cn } from "@/lib/utils";

interface AuthImageSideProps {
  title: string;
  description: string;
  keywords?: string;
  className?: string;
}

export default function AuthImageSide({
  title,
  description,
  keywords = "shopping",
  className,
}: AuthImageSideProps) {
  const imageUrl = `https://picsum.photos/seed/${keywords}/800/1200`;

  return (
    <div className={cn("relative w-full md:w-5/12 h-40 md:h-auto overflow-hidden group", className)}>
      <NavigateHomeButton />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />
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
          <h2 className="text-2xl font-bold drop-shadow-md mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm drop-shadow">
            {description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
