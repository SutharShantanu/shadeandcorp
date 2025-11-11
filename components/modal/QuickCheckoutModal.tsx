"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { loadRazorpay } from "@/lib/razorpay";
import {
  CreditCard,
  Ticket,
  Shield,
  Truck,
  RotateCcw,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Product } from "../site/ProductCard";

interface QuickCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
  minAmount?: number;
}

const coupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME10",
    discount: 10,
    type: "percentage",
    description: "Get 10% off on your first order",
    minAmount: 1000,
  },
  {
    id: "2",
    code: "FLAT500",
    discount: 500,
    type: "fixed",
    description: "Get ₹500 off on orders above ₹2000",
  },
  {
    id: "3",
    code: "STYLECAST15",
    discount: 15,
    type: "percentage",
    description: "Extra 15% off on StyleCast products",
  },
];

// Razorpay types
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export default function QuickCheckoutModal({
  open,
  onOpenChange,
  product,
  selectedSize,
  selectedColor,
  quantity,
}: QuickCheckoutModalProps) {
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedCouponData = coupons.find(
    (coupon) => coupon.id === selectedCoupon
  );

  // Calculate totals
  const subtotal = product.price * quantity;
  const discount = selectedCouponData
    ? selectedCouponData.type === "percentage"
      ? (subtotal * selectedCouponData.discount) / 100
      : selectedCouponData.discount
    : 0;
  const shipping = 40; // Fixed shipping cost
  const total = Math.max(0, subtotal - discount + shipping);

  const handlePayment = async () => {
    if (!selectedSize) {
      toast.error("Please select a size before proceeding.");
      return;
    }

    setIsProcessing(true);

    try {
      // Load Razorpay script
      await loadRazorpay();

      // Create order on your backend
      const orderResponse = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total * 100, // Convert to paise
          currency: "INR",
          product: {
            id: product.id,
            name: product.title,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity,
          },
          coupon: selectedCouponData,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Initialize Razorpay checkout
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Your Store Name",
        description: `Purchase: ${product.title}`,
        order_id: orderData.order.id,
        handler: async function (response: RazorpayResponse) {
          // Verify payment on your backend
          const verificationResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verificationData = await verificationResponse.json();

          if (verificationData.success) {
            toast.success("Your order has been placed successfully.");
            onOpenChange(false);
          } else {
            throw new Error("Payment verification failed");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        "There was an error processing your payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Quick Checkout</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  width={80}
                  height={80}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{product.title}</h4>
                <p className="text-xs text-gray-600">{product.brand}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                  <span>Size: {selectedSize}</span>
                  <span>
                    Color:{" "}
                    {
                      product.colors.find(
                        (c: { value: string; name: string }) =>
                          c.value === selectedColor
                      )?.name
                    }
                  </span>
                  <span>Qty: {quantity}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Selection */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              Apply Coupon
            </h3>
            <RadioGroup
              value={selectedCoupon}
              onValueChange={setSelectedCoupon}
            >
              <div className="space-y-2">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={coupon.id}
                      id={`coupon-${coupon.id}`}
                    />
                    <Label
                      htmlFor={`coupon-${coupon.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{coupon.code}</span>
                          <span className="text-xs text-green-600 ml-2">
                            -{coupon.discount}
                            {coupon.type === "percentage" ? "%" : "₹"}
                          </span>
                        </div>
                        {selectedCoupon === coupon.id && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        {coupon.description}
                      </p>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Price Breakdown */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Price Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {selectedCouponData && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount ({selectedCouponData.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center text-xs">
              <Shield className="w-6 h-6 text-green-600 mb-1" />
              <span>100% Secure</span>
            </div>
            <div className="flex flex-col items-center text-xs">
              <Truck className="w-6 h-6 text-green-600 mb-1" />
              <span>Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-xs">
              <RotateCcw className="w-6 h-6 text-green-600 mb-1" />
              <span>Easy Returns</span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            className="w-full py-3 text-lg font-semibold"
            onClick={handlePayment}
            disabled={isProcessing || !selectedSize}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </Button>

          <p className="text-xs text-center text-gray-600">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
