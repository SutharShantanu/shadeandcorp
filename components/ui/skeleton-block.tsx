"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton as ShadcnSkeleton } from "@/components/ui/skeleton";

type BaseProps = {
  className?: string;
};

type SizeProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
};

function Root({
  children,
  className,
}: React.PropsWithChildren<BaseProps>) {
  return (
    <div className={cn("space-y-3", className)}>
      {children}
    </div>
  );
}

function Container({
  children,
  className,
}: React.PropsWithChildren<BaseProps>) {
  return (
    <div
      className={cn(
        "space-y-3 rounded-xl border p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

function Row({
  children,
  className,
}: React.PropsWithChildren<BaseProps>) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}

function Block({
  width = "100%",
  height = 20,
  className,
}: SizeProps) {
  return (
    <ShadcnSkeleton
      style={{ width, height }}
      className={className}
    />
  );
}

function Line({
  width = "100%",
  height = 4,
  className,
}: SizeProps) {
  return (
    <ShadcnSkeleton
      style={{ width, height }}
      className={className}
    />
  );
}

function Title({
  width = "50%",
  className,
}: Omit<SizeProps, "height">) {
  return (
    <ShadcnSkeleton
      style={{ width }}
      className={cn("h-7", className)}
    />
  );
}

function Text({
  width = "100%",
  className,
}: Omit<SizeProps, "height">) {
  return (
    <ShadcnSkeleton
      style={{ width }}
      className={cn("h-4", className)}
    />
  );
}

function Paragraph({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <ShadcnSkeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1
              ? "w-2/3"
              : "w-full",
            className
          )}
        />
      ))}
    </div>
  );
}

function Avatar({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <ShadcnSkeleton
      style={{
        width: size,
        height: size,
      }}
      className={cn(
        "shrink-0 rounded-full",
        className
      )}
    />
  );
}

function Circle({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <ShadcnSkeleton
      style={{
        width: size,
        height: size,
      }}
      className={cn(
        "shrink-0 rounded-full",
        className
      )}
    />
  );
}

function Icon({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <ShadcnSkeleton
      style={{
        width: size,
        height: size,
      }}
      className={cn(
        "shrink-0 rounded-md",
        className
      )}
    />
  );
}

function Button({
  width = 100,
  height = 40,
  className,
}: SizeProps) {
  return (
    <ShadcnSkeleton
      style={{
        width,
        height,
      }}
      className={cn(
        "rounded-md",
        className
      )}
    />
  );
}

function Input({
  height = 40,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <ShadcnSkeleton
      style={{ height }}
      className={cn(
        "w-full rounded-md",
        className
      )}
    />
  );
}

function Badge({
  width = 80,
  height = 24,
  className,
}: SizeProps) {
  return (
    <ShadcnSkeleton
      style={{
        width,
        height,
      }}
      className={cn(
        "rounded-full",
        className
      )}
    />
  );
}

export const Skeleton = {
  Root,
  Container,
  Row,

  Block,
  Line,

  Title,
  Text,
  Paragraph,

  Avatar,
  Circle,
  Icon,

  Button,
  Input,
  Badge,
};
