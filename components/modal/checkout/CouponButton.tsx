import { Ticket, ChevronDown, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    hasEligibleCoupons,
    onOpenCoupons,
    onRemoveCoupon,
}: CouponButtonProps) {
    return (
        <div>
            {selectedCoupon ? (
                // Coupon Applied State
                <div className="flex items-center justify-between gap-2 border rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2 flex-1">
                        <Tag className="w-4 h-4 text-green-600" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">
                                    {selectedCoupon.code}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                    -{selectedCoupon.discount}
                                    {selectedCoupon.type === "percentage" ? "%" : "$"}
                                </Badge>
                            </div>
                            <p className="text-xs text-green-600">Coupon applied</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={onOpenCoupons}>
                            Change
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={onRemoveCoupon}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                // No Coupon Applied State
                <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={onOpenCoupons}
                    disabled={!hasCoupons}
                >
                    <span className="flex items-center gap-2">
                        <Tag className="w-8 h-8" />
                        {!hasCoupons ? "No coupons available" : "Apply Coupon"}
                    </span>
                </Button>
            )}
        </div>
    );
}
