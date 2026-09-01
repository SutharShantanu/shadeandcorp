
export type Asset = {
  id: string;
  variantId?: string; // null if common
  type: "image" | "video";
  role: "thumbnail" | "gallery" | "zoom";
  url: string;
  alt: string;
  order: number;
  metadata?: {
    source: string;
    photographerName?: string;
    photographerUrl?: string;
  };
};

export type Variant = {
  id: string;
  color: {
    name: string;
    hex: string;
  };
  size: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stockQuantity: number;
  isDefault: boolean;
};

export type Product = {
  id: string;
  title: string;
  description?: string;
  brand: string;
  basePrice: number;
  category: string;
  subCategory?: string;
  isNew: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  rating: number;
  reviewCount: number;
  tags?: string[];
  sku: string;
  slug: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  variants: Variant[];
  assets: Asset[];
};

export interface ProductImageSectionProps {
  product: Product;
  // currentImageIndex: number;
  // isImageHovered: boolean;
  isWishlisted: boolean;
  isOutOfStock: boolean;
  discountPercentage: number;
  priceDropAmount?: number;
  onAddToWishlist: () => void;
  selectedColorName?: string;
}

export interface QuickActionButtonsProps {
  isWishlisted: boolean;
  onAddToWishlist: () => void;
}
export interface ProductInfoHeaderProps {
  product: Product;
}

export interface PriceSectionProps {
  product: Product;
  savings: number;
  priceDropAmount?: number;
}

export interface ColorOptionsProps {
  product: Product;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}
export interface SizeSelectorProps {
  product: Product;
  selectedSize: string;
  sizeError: string;
  onSizeSelect: (size: string) => void;
  isSizeAvailable: (size: string) => boolean;
}

export interface ActionButtonsProps {
  isOutOfStock: boolean;
  // selectedSize: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export interface AdditionalInfoProps {
  product: Product;
}

export interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "detailed";
  className?: string;
  onAddToCart?: (
    product: Product,
    quantity: number,
    size: string,
    color: string
  ) => void;
  onAddToWishlist?: (product: Product) => void;
}

export interface CompactProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: ProductCardProps["onAddToCart"];
  onAddToWishlist?: ProductCardProps["onAddToWishlist"];
  isWishlisted: boolean;
  isOutOfStock: boolean;
  discountPercentage: number;
  onAddToWishlistClick: () => void;
  onAddToCartClick: () => void;
  showCheckoutModal: boolean;
  setShowCheckoutModal: (show: boolean) => void;
  selectedSize: string;
  selectedColor: string;
}

