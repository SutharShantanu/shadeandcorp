import Image from "next/image";
import { Product } from "@/types/ProductCard";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";

interface OrderSummaryProps {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  onSizeChange?: (size: string) => void;
  onColorChange?: (color: string) => void;
  onQuantityIncrease: () => void;
  onQuantityDecrease: () => void;
}

export function OrderSummary({
  product,
  selectedSize,
  selectedColor,
  quantity,
  onQuantityIncrease,
  onQuantityDecrease,
}: OrderSummaryProps) {
  const defaultImageSrc =
    product.assets?.find((a) => a.role === "thumbnail")?.url ||
    product.assets?.[0]?.url ||
    "https://placehold.co/600x600/f0f0f0/333333/png?text=Placeholder";

  const selectedVariant =
    product.variants?.find(
      (v) => v.color.hex === selectedColor && v.size === selectedSize,
    ) ||
    product.variants?.find((v) => v.color.hex === selectedColor) ||
    product.variants?.[0];

  const price = selectedVariant?.price || product.basePrice;

  const colorName = product.variants?.find(v => v.color.hex === selectedColor)?.color.name || "Unknown";

  return (
    <div className="flex items-start gap-4 py-4 rounded-xl">
      <div className="relative h-20 w-20 rounded-lg bg-white border border-border overflow-hidden shrink-0">
        <Image
          src={defaultImageSrc}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 space-y-1 mt-1">
        <h4 className="font-medium text-sm leading-tight text-foreground">{product.title}</h4>
        <p className="text-xs text-muted-foreground">Size: {selectedSize} • Color: {colorName}</p>
        
        <div className="pt-2">
            <ButtonGroup>
              <Button
                variant={"outline"}
                size="icon"
                className={`h-7 w-8 transition-all ease-in-out ${quantity === 1 ? "text-destructive bg-destructive/10 hover:bg-destructive/20 hover:text-destructive" : ""}`}
                onClick={onQuantityDecrease}
              >
                {quantity === 1 ? (
                  <Trash2 className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-8 pointer-events-none"
              >
                <span className="text-xs font-medium text-center">{quantity}</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-8"
                onClick={onQuantityIncrease}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </ButtonGroup>
        </div>
      </div>
      <div className="text-right mt-1">
        <p className="font-medium text-sm text-foreground">${(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}
