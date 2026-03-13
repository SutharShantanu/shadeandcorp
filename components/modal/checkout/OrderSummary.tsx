import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Product } from "@/types/ProductCard";
import { Badge } from "@/components/ui/badge";

interface OrderSummaryProps {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onQuantityIncrease: () => void;
  onQuantityDecrease: () => void;
}

export function OrderSummary({
  product,
  selectedSize,
  selectedColor,
  quantity,
  onSizeChange,
  onColorChange,
  onQuantityIncrease,
  onQuantityDecrease,
}: OrderSummaryProps) {
  const defaultImageSrc =
    product.assets?.find((a) => a.role === "thumbnail")?.url ||
    product.assets?.[0]?.url ||
    "https://placehold.co/600x600/f0f0f0/333333/png?text=Placeholder";
  const availableSizes = Array.from(
    new Set(product.variants?.map((v) => v.size) || []),
  );
  const availableColors = Array.from(
    new Set(product.variants?.map((v) => JSON.stringify(v.color)) || []),
  ).map((s) => JSON.parse(s));

  const selectedVariant =
    product.variants?.find(
      (v) => v.color.hex === selectedColor && v.size === selectedSize,
    ) ||
    product.variants?.find((v) => v.color.hex === selectedColor) ||
    product.variants?.[0];

  const price = selectedVariant?.price || product.basePrice;
  const originalPrice = selectedVariant?.originalPrice;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-4">Order Summary</h3>
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
          <Image
            src={defaultImageSrc}
            alt={product.title}
            className="w-full h-full object-cover"
            width={96}
            height={96}
          />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-medium">{product.title}</h4>
            <p className="text-sm text-gray-600">{product.brand}</p>
          </div>

          {/* Size Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Size</Label>
            <Select value={selectedSize} onValueChange={onSizeChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {availableSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color Selection */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Color</Label>
            <RadioGroup
              value={selectedColor}
              onValueChange={onColorChange}
              className="flex gap-2 items-center"
            >
              {availableColors.map((color: { hex: string; name: string }) => (
                <RadioGroupItem
                  key={color.hex}
                  value={color.hex}
                  id={`color-${product.id}-${color.hex}`}
                  aria-label={color.name}
                  className="h-8 w-8 cursor-pointer rounded-full border-2 transition-all data-[state=checked]:border-black data-[state=checked]:scale-110"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </RadioGroup>
          </div>

          {/* Quantity Controls */}
          <div className="">
            <Label className="text-xs font-medium">Quantity</Label>
            <ButtonGroup className="mt-1">
              <Button
                variant={quantity === 1 ? "destructive" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={onQuantityDecrease}
              >
                {quantity === 1 ? (
                  <Trash2 className="h-4 w-4" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-16 pointer-events-none"
              >
                <span className="font-medium text-center">{quantity}</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={onQuantityIncrease}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-lg font-semibold">${price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
