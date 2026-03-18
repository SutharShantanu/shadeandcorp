import { Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-sm text-foreground">
                            {selectedCoupon.code}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-emerald-600">
                            -{selectedCoupon.type === "percentage" ? `${selectedCoupon.discount}%` : `$${selectedCoupon.discount}`}
                        </span>
                        <button 
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={onRemoveCoupon}
                            aria-label="Remove coupon"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
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
