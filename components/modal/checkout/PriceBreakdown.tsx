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
        <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-4">Price Details</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="">
                        Subtotal ({quantity} {quantity > 1 ? "items" : "item"})
                    </span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && couponCode && (
                    <div className="flex justify-between text-green-600">
                        <span>Discount ({couponCode})</span>
                        <span className="font-medium">-${discount.toFixed(2)}</span>
                    </div>
                )}
                {hasAddress ? (
                    <div className="flex justify-between">
                        <span className="">Shipping ({shippingMethodName})</span>
                        <span className="font-medium">
                            {shipping === 0 ? (
                                <span className="text-green-600">FREE</span>
                            ) : (
                                `$${shipping.toFixed(2)}`
                            )}
                        </span>
                    </div>
                ) : (
                    <div className="flex justify-between  italic">
                        <span>Shipping</span>
                        <span className="text-xs">Add address</span>
                    </div>
                )}
                {giftWrapFee > 0 && (
                    <div className="flex justify-between">
                        <span className="">Gift Wrap</span>
                        <span className="font-medium">${giftWrapFee.toFixed(2)}</span>
                    </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
