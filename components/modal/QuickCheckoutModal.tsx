"use client";

import React, { useState, useEffect, Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { loadRazorpay } from "@/lib/razorpay";
import {
  CreditCard,
  ArrowLeft,
  Truck,
  Package,
  Zap,
  Check,
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
import Link from "next/link";

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

const checkoutSteps = [
  { id: "address", label: "Address" },
  { id: "shipping", label: "Delivery" },
  { id: "gift", label: "Options" },
];

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
  const [currentStep, setCurrentStep] = useState<string>("address");

  // Get user addresses
  const userAddresses: Address[] = (user as ExtendedUser)?.address || [];

  const [localAddresses, setLocalAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (userAddresses.length > 0 && localAddresses.length === 0) {
      setLocalAddresses(userAddresses);
    }
  }, [userAddresses]);

  const displayAddresses =
    localAddresses.length > 0 ? localAddresses : userAddresses;
  const defaultAddress = displayAddresses.find((addr) => addr.isDefault);

  // Set default address on mount
  useEffect(() => {
    if (defaultAddress?._id && !selectedAddress) {
      setSelectedAddress(defaultAddress._id);
    }
  }, [defaultAddress, selectedAddress]);

  const handleAddNewAddress = (data: any) => {
    const newAddress: Address = {
      ...data,
      _id: `temp-${Date.now()}`,
    };
    setLocalAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress._id!);
    toast.success("Address added successfully");
  };

  const selectedCouponData = coupons.find(
    (coupon) => coupon.id === selectedCoupon,
  );

  const selectedShippingMethod = shippingMethods.find(
    (method) => method.id === shippingMethod,
  );

  const selectedAddressData = displayAddresses.find(
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
      await loadRazorpay();

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

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Your Store Name",
        description: `Purchase: ${product.title}`,
        order_id: orderData.order.id,
        handler: async function (response: RazorpayResponse) {
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
          name: user?.name || "Customer Name",
          email: user?.email || "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#0F172A",
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

  const getStepIndex = (stepId: string) =>
    checkoutSteps.findIndex((s) => s.id === stepId);
  const currentStepIndex = getStepIndex(currentStep);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl overflow-hidden flex flex-col max-h-[95vh] lg:max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {showCouponUI && (
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowCouponUI(false)}
                className="shrink-0 -ml-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <DialogTitle>
              {showCouponUI ? "Available Coupons" : "Secure Checkout"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Left Column - Checkout Steps */}
          {!showCouponUI && (
            <div className="flex-1 p-4 lg:p-6 lg:w-3/5 overflow-y-auto custom-scrollbar">
              {/* Stepper Header */}
              <div className="mb-10 flex w-full justify-between items-center px-4">
                {checkoutSteps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isPast = index < currentStepIndex;
                  const isClickable =
                    isPast ||
                    (index === 1 && selectedAddress) ||
                    (index === 2 && selectedAddress);

                  return (
                    <Fragment key={step.id}>
                      <div className="flex flex-col items-center shrink-0 relative">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ring-4 ring-background z-10 transition-all duration-300",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                              : isPast
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground opacity-60",
                          )}
                        >
                          {isPast ? (
                            <Check className="size-5 stroke-3" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span
                          className={cn(
                            "absolute top-12 mt-2 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < checkoutSteps.length - 1 && (
                        <div
                          data-slot="field-separator"
                          className="relative -my-2 h-5 text-sm flex-1 mx-2"
                        >
                          <Separator className="absolute inset-x-0 top-1/2" />
                        </div>
                      )}
                    </Fragment>
                  );
                })}
              </div>

              {/* Step Content */}
              <div className="min-h-[300px]">
                {currentStep === "address" && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <DeliveryAddress
                      addresses={displayAddresses}
                      selectedAddress={selectedAddress}
                      onAddressChange={(id) => {
                        setSelectedAddress(id);
                      }}
                      onAddAddress={handleAddNewAddress}
                    />
                    {selectedAddress && (
                      <div className="mt-8 flex justify-end">
                        <Button
                          size="lg"
                          className="px-8 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/10"
                          onClick={() => setCurrentStep("shipping")}
                        >
                          Continue to Delivery
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === "shipping" && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Delivery Method</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep("address")}
                        className="text-muted-foreground"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                    </div>
                    <ShippingMethodSelector
                      methods={shippingMethods}
                      selectedMethod={shippingMethod}
                      onMethodChange={(id) => {
                        setShippingMethod(id);
                      }}
                    />
                    {shippingMethod && (
                      <div className="mt-8 flex justify-end">
                        <Button
                          size="lg"
                          className="px-8 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/10"
                          onClick={() => setCurrentStep("gift")}
                        >
                          Continue to Options
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === "gift" && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">
                        Gift Options{" "}
                        <span className="text-muted-foreground font-normal text-sm ml-2">
                          (Optional)
                        </span>
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep("shipping")}
                        className="text-muted-foreground"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                    </div>
                    <GiftOptions
                      isGift={isGift}
                      onGiftToggle={setIsGift}
                      giftMessage={giftMessage}
                      onMessageChange={setGiftMessage}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Coupon Selection UI */}
          {showCouponUI && (
            <div className="p-4 lg:p-6 w-full lg:w-3/5 mx-auto overflow-y-auto custom-scrollbar">
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
            </div>
          )}

          {/* Right Column - Order Summary Sidebar */}
          <div className="w-full lg:w-2/5 bg-muted/30 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l overflow-y-auto custom-scrollbar shrink-0">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 tracking-tight">
                Order Summary
              </h3>

              <OrderSummary
                product={product}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                quantity={quantity}
                onQuantityIncrease={handleIncreaseQuantity}
                onQuantityDecrease={handleDecreaseQuantity}
              />
            </div>

            <CouponButton
              selectedCoupon={selectedCouponData}
              hasCoupons={allCoupons.length > 0}
              hasEligibleCoupons={eligibleCoupons.length > 0}
              onOpenCoupons={() => setShowCouponUI(true)}
              onRemoveCoupon={handleRemoveCoupon}
            />

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

            <Button
              className="w-full h-14 text-lg font-medium shadow-md transition-all hover:-translate-y-px active:translate-y-px"
              onClick={handlePayment}
              disabled={isProcessing || !selectedSize || !selectedAddress}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : !selectedAddress ? (
                "Add Delivery Address"
              ) : (
                <>Pay ${total.toFixed(2)}</>
              )}
            </Button>

            <TrustBadges
              showFreeShipping={selectedAddress !== "" && shipping === 0}
            />

            <p className="text-xs text-center text-muted-foreground">
              By completing this purchase you agree to our{" "}
              <Link
                href="#"
                className="underline hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="underline hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
