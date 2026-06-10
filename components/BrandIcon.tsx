import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandIconProps {
  /**
   * The name of the brand icon (e.g., "google", "github").
   * This is used to fetch the icon from thesvg.org.
   */
  name: string;
  /**
   * Optional custom alt text. Defaults to the capitalized brand name.
   */
  alt?: string;
  /**
   * The width of the icon. Defaults to 24.
   */
  width?: number;
  /**
   * The height of the icon. Defaults to 24.
   */
  height?: number;
  /**
   * The variant of the icon (e.g., "default", "dark", "light", "mono").
   * Defaults to "default".
   */
  variant?: string;
  /**
   * Additional CSS classes to apply to the Image component.
   */
  className?: string;
}

export function BrandIcon({
  name,
  alt,
  width = 24,
  height = 24,
  variant = "default",
  className,
}: BrandIconProps) {
  const formattedName = name.toLowerCase();
  const defaultAlt = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <Image
      src={`https://thesvg.org/icons/${formattedName}/${variant}.svg`}
      alt={alt || defaultAlt}
      width={width}
      height={height}
      className={cn("object-contain", className)}
    />
  );
}
