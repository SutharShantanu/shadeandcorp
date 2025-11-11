
export type Product = {
  id: string;
  title: string;
  description?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subCategory?: string;
  sizes: string[];
  colors: { name: string; value: string }[];
  inStock: boolean;
  stockQuantity: number;
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
  sizeAvailability?: { [size: string]: boolean };
};

export interface ProductImageSectionProps {
  product: Product;
  currentImageIndex: number;
  // isImageHovered: boolean;
  isWishlisted: boolean;
  isOutOfStock: boolean;
  discountPercentage: number;
  onImageHover: () => void;
  onImageLeave: () => void;
  onAddToWishlist: () => void;
  onQuickView: () => void;
}

export interface QuickActionButtonsProps {
  isWishlisted: boolean;
  onAddToWishlist: () => void;
  onQuickView: () => void;
}
export interface ProductInfoHeaderProps {
  product: Product;
}

export interface PriceSectionProps {
  product: Product;
  savings: number;
}

export interface ColorOptionsProps {
  product: {
    colors: Array<{
      value: string;
      name: string;
    }>;
  };
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
  onQuickView?: (product: Product) => void;
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

