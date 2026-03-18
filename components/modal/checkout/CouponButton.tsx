import { Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
}

interface CouponButtonProps {
  selectedCoupon?: Coupon | null;
  hasCoupons: boolean;
  hasEligibleCoupons: boolean;
  onOpenCoupons: () => void;
  onRemoveCoupon: () => void;
}

export function CouponButton({
  selectedCoupon,
  hasCoupons,
  onOpenCoupons,
  onRemoveCoupon,
}: CouponButtonProps) {
  if (!hasCoupons) return null;

  return (
    <div className="py-2">
      {selectedCoupon ? (
        // Coupon Applied State
        <Card className="flex flex-row p-1 items-center justify-between">
          {/* Left Section */}
          <CardHeader className="flex items-center gap-2 px-0">
            <Tag className="w-4 h-4 text-emerald-600" />
            <Badge variant="secondary" className="font-medium">
              {selectedCoupon.code}
            </Badge>
          </CardHeader>

          {/* Right Section */}
          <CardContent className="flex items-center gap-3 px-0">
            <Badge
              variant="outline"
              className="text-emerald-600 border-emerald-600"
            >
              -
              {selectedCoupon.type === "percentage"
                ? `${selectedCoupon.discount}%`
                : `$${selectedCoupon.discount}`}
            </Badge>

            <Button
              variant="secondary"
              size="icon"
              onClick={onRemoveCoupon}
              className="text-destructive bg-destructive/20"
              aria-label="Remove coupon"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        // No Coupon Applied State
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="w-full focus-visible:ring-0"
            onClick={onOpenCoupons}
          >
            <Tag className="size-4" />
            Add discount code
          </Button>
        </div>
      )}
    </div>
  );
}
