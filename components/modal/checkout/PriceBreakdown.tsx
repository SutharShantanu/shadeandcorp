import { Separator } from "@/components/ui/separator";

interface PriceBreakdownProps {
    subtotal: number;
    quantity: number;
    discount: number;
    couponCode?: string;
    shipping: number;
    shippingMethodName?: string;
    giftWrapFee: number;
    total: number;
    hasAddress: boolean;
}

export function PriceBreakdown({
    subtotal,
    quantity,
    discount,
    couponCode,
    shipping,
    shippingMethodName,
    giftWrapFee,
    total,
    hasAddress,
}: PriceBreakdownProps) {
    return (
        <div className="space-y-3 text-sm pt-4">
            <div className="flex justify-between text-muted-foreground">
                <span>
                    Subtotal ({quantity} {quantity > 1 ? "items" : "item"})
                </span>
                <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && couponCode && (
                <div className="flex justify-between text-emerald-600">
                    <span>Discount ({couponCode})</span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
            )}
            {hasAddress ? (
                <div className="flex justify-between text-muted-foreground">
                    <span>Shipping {shippingMethodName ? `(${shippingMethodName})` : ''}</span>
                    <span className="font-medium text-foreground">
                        {shipping === 0 ? (
                            <span className="text-emerald-600">Free</span>
                        ) : (
                            `$${shipping.toFixed(2)}`
                        )}
                    </span>
                </div>
            ) : (
                <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-xs text-muted-foreground">Calculated next step</span>
                </div>
            )}
            {giftWrapFee > 0 && (
                <div className="flex justify-between text-muted-foreground">
                    <span>Gift Wrap</span>
                    <span className="font-medium text-foreground">${giftWrapFee.toFixed(2)}</span>
                </div>
            )}
            <Separator className="my-4" />
            <div className="flex justify-between items-center pb-2">
                <span className="text-base font-semibold text-foreground">Total to pay</span>
                <span className="text-xl font-bold text-foreground">${total.toFixed(2)}</span>
            </div>
        </div>
    );
}
