import { Search, CheckCircle2, Ticket, X, ArrowLeft, Tag } from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Coupon {
    id: string;
    code: string;
    discount: number;
    type: "percentage" | "fixed";
    description: string;
    minAmount?: number;
    category?: string;
}

interface CouponListProps {
    eligibleCoupons: Coupon[];
    ineligibleCoupons: Coupon[];
    selectedCoupon: string;
    searchQuery: string;
    customCode: string;
    subtotal: number;
    onSearchChange: (query: string) => void;
    onCustomCodeChange: (code: string) => void;
    onApplyCustomCode: () => void;
    onSelectCoupon: (couponId: string) => void;
    onBack: () => void;
    onRemoveCoupon: () => void;
}

export function CouponList({
    eligibleCoupons,
    ineligibleCoupons,
    selectedCoupon,
    searchQuery,
    customCode,
    subtotal,
    onSearchChange,
    onCustomCodeChange,
    onApplyCustomCode,
    onSelectCoupon,
    onBack,
    onRemoveCoupon,
}: CouponListProps) {
    const selectedCouponData = [...eligibleCoupons, ...ineligibleCoupons].find(
        (c) => c.id === selectedCoupon
    );

    return (
        <div>
            {/* Sticky Search Header */}
            <div className="fixed top-18 bg-background w-full z-10 border-b px-6 py-4 left-0 right-0">
                {/* Search and Apply with Selected Coupon Badge Inside */}
                <InputGroup>
                    {selectedCouponData && (
                        <InputGroupAddon className="gap-1 pl-3">
                            <Badge variant="secondary" className="gap-1 pr-1">
                                <Tag className="h-3 w-3" />
                                <span className="text-xs">{selectedCouponData.code}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 hover:bg-transparent"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveCoupon();
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        </InputGroupAddon>
                    )}
                    <InputGroupInput
                        placeholder="Search or enter coupon code..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && searchQuery.trim()) {
                                onApplyCustomCode();
                            }
                        }}
                        className={selectedCouponData ? "pl-2" : ""}
                    />
                    <InputGroupAddon>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            onClick={onApplyCustomCode}
                            disabled={!searchQuery.trim()}
                            size="xs"
                        >
                            Apply
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* Scrollable Coupon List */}
            <div className="space-y-4 mt-8">
                {/* Eligible Coupons */}
                {eligibleCoupons.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-green-600 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Eligible Coupons ({eligibleCoupons.length})
                        </h4>
                        {eligibleCoupons.map((coupon) => (
                            <div
                                key={coupon.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedCoupon === coupon.id
                                    ? "border-green-500 bg-green-50"
                                    : ""
                                    }`}
                                onClick={() => onSelectCoupon(coupon.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Tag className="w-4 h-4" />
                                            <span className="font-bold text-sm">{coupon.code}</span>
                                            <Badge variant="secondary" className="text-xs">
                                                -{coupon.discount}
                                                {coupon.type === "percentage" ? "%" : "$"}
                                            </Badge>
                                            {"category" in coupon &&
                                                typeof coupon.category === "string" && (
                                                    <Badge
                                                        variant={
                                                            coupon.category === "card"
                                                                ? "default"
                                                                : coupon.category === "upi"
                                                                    ? "secondary"
                                                                    : "outline"
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {coupon.category.toUpperCase()}
                                                    </Badge>
                                                )}
                                        </div>
                                        <p className="text-xs text-gray-700">
                                            {coupon.description}
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                            ✓ You can use this coupon
                                        </p>
                                    </div>
                                    {selectedCoupon === coupon.id && (
                                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Ineligible Coupons */}
                {ineligibleCoupons.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-600">
                            Not Eligible ({ineligibleCoupons.length})
                        </h4>
                        {ineligibleCoupons.map((coupon) => (
                            <div
                                key={coupon.id}
                                className="p-4 border rounded-lg opacity-60 bg-gray-50"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-sm">{coupon.code}</span>
                                            <Badge variant="outline" className="text-xs">
                                                -{coupon.discount}
                                                {coupon.type === "percentage" ? "%" : "$"}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-700">
                                            {coupon.description}
                                        </p>
                                        <p className="text-xs text-red-500 mt-1">
                                            Min. purchase: ${coupon.minAmount} (Add $
                                            {(coupon.minAmount! - subtotal).toFixed(2)} more)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Coupons Found */}
                {eligibleCoupons.length === 0 && ineligibleCoupons.length === 0 && (
                    <div className="p-12 text-center">
                        <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">
                            No coupons found matching your search
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
