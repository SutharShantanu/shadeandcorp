"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SectionCtaButtonProps {
  href?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  iconPosition?: "left" | "right";
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "xs";
  className?: string;
  containerClassName?: string;
  delay?: number;
}

export function SectionCtaButton({
  href,
  onClick,
  children,
  icon: Icon = ArrowRight,
  iconPosition = "right",
  variant = "default",
  size = "lg",
  className,
  containerClassName,
  delay = 0.3,
}: SectionCtaButtonProps) {
  const getIconSizeClass = () => {
    switch (size) {
      case "xs":
        return "size-3";
      case "sm":
        return "size-3.5";
      case "lg":
        return "size-5";
      default:
        return "size-4";
    }
  };

  const iconSizeClass = getIconSizeClass();

  const content = (
    <span className="flex items-center gap-2">
      {iconPosition === "left" && Icon && (
        <Icon className={cn(iconSizeClass, "transform group-hover:-translate-x-1 transition-transform duration-300")} />
      )}
      <span>{children}</span>
      {iconPosition === "right" && Icon && (
        <Icon className={cn(iconSizeClass, "transform group-hover:translate-x-1.5 transition-transform duration-300")} />
      )}
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={cn("text-center mt-12 md:mt-16", containerClassName)}
    >
      <Button
        asChild={!!href}
        variant={variant}
        size={size}
        onClick={onClick}
        className={cn(
          "group rounded-full px-9 py-6 font-semibold text-base shadow-xl hover:shadow-2xl active:scale-98",
          className
        )}
      >
        {href ? <Link href={href}>{content}</Link> : content}
      </Button>
    </motion.div>
  );
}

export default SectionCtaButton;
