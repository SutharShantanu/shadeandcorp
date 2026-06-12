import Image from "next/image";

interface SvgIconProps {
  src: string;
  alt: string;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}

export function SvgIcon({
  src,
  alt,
  size,
  width,
  height,
  className,
}: SvgIconProps) {
  const w = width ?? size ?? 24;
  const h = height ?? size ?? 24;

  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      className={className}
    />
  );
}
