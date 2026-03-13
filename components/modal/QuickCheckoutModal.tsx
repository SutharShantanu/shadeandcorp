"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { loadRazorpay } from "@/lib/razorpay";
import { CreditCard, ArrowLeft, Truck, Package, Zap } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/ProductCard";
import { useAuthInfo } from "@/hook/useAuthInfo";
import { OrderSummary } from "@/components/modal/checkout/OrderSummary";
import { DeliveryAddress } from "@/components/modal/checkout/DeliveryAddress";
import { ShippingMethodSelector } from "@/components/modal/checkout/ShippingMethodSelector";
import { GiftOptions } from "@/components/modal/checkout/GiftOptions";
import { CouponButton } from "@/components/modal/checkout/CouponButton";
import { CouponList } from "@/components/modal/checkout/CouponList";
import { PriceBreakdown } from "@/components/modal/checkout/PriceBreakdown";
import { TrustBadges } from "@/components/modal/checkout/TrustBadges";

interface QuickCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

interface Address {
  _id?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: string;
  isDefault: boolean;
}

interface ExtendedUser {
  id: string;
  email: string;
  name: string | null;
  address?: Address[];
}

import { BankOffer, Coupon, coupons, bankOffers } from "@/lib/constants";

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  icon: typeof Truck;
}

const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 0,
    estimatedDays: "5-7 days",
    icon: Package,
  },
  {
    id: "express",
    name: "Express Shipping",
    price: 15,
    estimatedDays: "2-3 days",
    icon: Truck,
  },
  {
    id: "overnight",
    name: "Overnight Delivery",
    price: 30,
    estimatedDays: "1 day",
    icon: Zap,
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
  selectedSize: initialSize,
  selectedColor: initialColor,
  quantity: initialQuantity,
}: QuickCheckoutModalProps) {
  const { session } = useAuthInfo();
  const user = session?.user;

  // Product customization states
  const [selectedSize, setSelectedSize] = useState<string>(initialSize);
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  // Checkout states
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");
  const [customCouponCode, setCustomCouponCode] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState<string>("standard");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCouponUI, setShowCouponUI] = useState(false);
  const [couponSearch, setCouponSearch] = useState("");

  // Get user addresses
  const userAddresses: Address[] = (user as ExtendedUser)?.address || [];
  const defaultAddress = userAddresses.find((addr) => addr.isDefault);

  // Set default address on mount
  useState(() => {
    if (defaultAddress?._id) {
      setSelectedAddress(defaultAddress._id);
    }
  });

  const selectedCouponData = coupons.find(
    (coupon) => coupon.id === selectedCoupon,
  );

  const selectedShippingMethod = shippingMethods.find(
    (method) => method.id === shippingMethod,
  );

  const selectedAddressData = userAddresses.find(
    (addr) => addr._id === selectedAddress,
  );

  // Calculate totals
  const selectedVariant =
    product.variants.find(
      (v) => v.color.hex === selectedColor && v.size === selectedSize,
    ) ||
    product.variants.find((v) => v.color.hex === selectedColor) ||
    product.variants[0];

  const subtotal = (selectedVariant?.price || product.basePrice) * quantity;
  const discount = selectedCouponData
    ? selectedCouponData.type === "percentage"
      ? (subtotal * selectedCouponData.discount) / 100
      : selectedCouponData.discount
    : 0;
  const shipping =
    selectedAddressData && selectedShippingMethod
      ? selectedShippingMethod.price
      : 0;
  const giftWrapFee = isGift ? 5 : 0;
  const total = Math.max(0, subtotal - discount + shipping + giftWrapFee);

  // Quantity handlers
  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleApplyCustomCoupon = () => {
    const coupon = coupons.find(
      (c) => c.code.toLowerCase() === customCouponCode.toLowerCase(),
    );
    if (coupon) {
      if (coupon.minAmount && subtotal < coupon.minAmount) {
        toast.error(
          `This coupon requires a minimum purchase of $${coupon.minAmount}`,
        );
        return;
      }
      setSelectedCoupon(coupon.id);
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
      setCustomCouponCode("");
      setShowCouponUI(false);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon("");
    toast.info("Coupon removed");
  };

  const handleCouponSelect = (couponId: string) => {
    const coupon = coupons.find((c) => c.id === couponId);
    if (coupon) {
      setSelectedCoupon(couponId);
      setShowCouponUI(false);
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
    }
  };

  // Filter coupons based on search and eligibility
  const allCoupons = [
    ...coupons,
    ...bankOffers.map((offer) => ({
      id: offer.id,
      code: offer.code || offer.bank,
      discount: offer.discount,
      type:
        offer.type === "card" ||
        offer.type === "upi" ||
        offer.type === "netbanking"
          ? ("fixed" as const)
          : ("percentage" as const),
      description: offer.description,
      minAmount: offer.minAmount,
      category: offer.type,
    })),
  ];

  const filteredCoupons = allCoupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
      coupon.description.toLowerCase().includes(couponSearch.toLowerCase());
    return matchesSearch;
  });

  const eligibleCoupons = filteredCoupons.filter(
    (coupon) => !coupon.minAmount || subtotal >= coupon.minAmount,
  );

  const ineligibleCoupons = filteredCoupons.filter(
    (coupon) => coupon.minAmount && subtotal < coupon.minAmount,
  );

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
        "There was an error processing your payment. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {showCouponUI && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowCouponUI(false)}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-2xl">
              {showCouponUI ? "Available Coupons" : "Quick Checkout"}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="overflow-y-auto p-6">
          {!showCouponUI && (
            // Main Checkout View
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Product Details & Customization */}
              <div className="lg:col-span-2 space-y-4">
                {/* Order Summary Component */}
                <OrderSummary
                  product={product}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                  quantity={quantity}
                  onQuantityIncrease={handleIncreaseQuantity}
                  onQuantityDecrease={handleDecreaseQuantity}
                />

                {/* Delivery Address Component */}
                <DeliveryAddress
                  addresses={userAddresses}
                  selectedAddress={selectedAddress}
                  onAddressChange={setSelectedAddress}
                />

                {/* Shipping Method Component */}
                {selectedAddress && (
                  <ShippingMethodSelector
                    methods={shippingMethods}
                    selectedMethod={shippingMethod}
                    onMethodChange={setShippingMethod}
                  />
                )}

                {/* Gift Options Component */}
                <GiftOptions
                  isGift={isGift}
                  onGiftToggle={setIsGift}
                  giftMessage={giftMessage}
                  onMessageChange={setGiftMessage}
                />
              </div>

              {/* Right Column - Price Summary & Payment */}
              <div className="lg:col-span-1">
                <div className="sticky top-0 space-y-4">
                  {/* Coupon Button Component */}
                  <CouponButton
                    selectedCoupon={selectedCouponData}
                    hasCoupons={allCoupons.length > 0}
                    hasEligibleCoupons={eligibleCoupons.length > 0}
                    onOpenCoupons={() => setShowCouponUI(true)}
                    onRemoveCoupon={handleRemoveCoupon}
                  />
                  {/* Price Breakdown Component */}
                  <PriceBreakdown
                    quantity={quantity}
                    subtotal={subtotal}
                    discount={discount}
                    couponCode={selectedCouponData?.code}
                    shipping={shipping}
                    shippingMethodName={selectedShippingMethod?.name}
                    giftWrapFee={giftWrapFee}
                    total={total}
                    hasAddress={selectedAddress !== ""}
                  />

                  {/* Trust Badges Component */}
                  <TrustBadges
                    showFreeShipping={selectedAddress !== "" && shipping === 0}
                  />

                  {/* Payment Button */}
                  <DialogFooter>
                    <Button
                      className="w-full py-6 text-lg font-semibold"
                      onClick={handlePayment}
                      disabled={
                        isProcessing || !selectedSize || !selectedAddress
                      }
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : !selectedAddress ? (
                        "Add Delivery Address"
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay ${total.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </DialogFooter>

                  <p className="text-xs text-center text-gray-500">
                    By continuing, you agree to our{" "}
                    <a href="#" className="underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="overflow-y-auto px-6">
          {showCouponUI && (
            <CouponList
              searchQuery={couponSearch}
              onSearchChange={setCouponSearch}
              customCode={customCouponCode}
              onCustomCodeChange={setCustomCouponCode}
              onApplyCustomCode={handleApplyCustomCoupon}
              eligibleCoupons={eligibleCoupons}
              ineligibleCoupons={ineligibleCoupons}
              selectedCoupon={selectedCoupon}
              onSelectCoupon={handleCouponSelect}
              subtotal={subtotal}
              onBack={() => setShowCouponUI(false)}
              onRemoveCoupon={handleRemoveCoupon}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
