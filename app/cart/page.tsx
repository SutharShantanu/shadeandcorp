"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Shield,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CouponButton } from "@/components/modal/checkout/CouponButton";
import { CouponList } from "@/components/modal/checkout/CouponList";
import { coupons, bankOffers } from "@/lib/constants";
import { toast } from "sonner";
import { SimilarProducts } from "@/components/product/SimilarProducts";
import { useAppDispatch } from "@/lib/store";
import { add as addToWishlist } from "@/features/wishlist/wishlistSlice";


interface CartItem {
  id: string;
  name: string;
  brand: string;
  details: string;
  price: number;
  originalPrice?: number;
  savings?: number;
  image: string;
  quantity: number;
  isFavorite: boolean;
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    brand: "AudioTech Pro",
    details: "Color: Midnight Black",
    price: 89.99,
    originalPrice: 119.99,
    savings: 30.0,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    quantity: 1,
    isFavorite: false,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    brand: "TechFit",
    details: "Color: Space Gray Size: 42mm",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    quantity: 1,
    isFavorite: false,
  },
  {
    id: "3",
    name: "USB-C Charging Cable",
    brand: "PowerLink",
    details: "Size: 6ft",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop",
    quantity: 2,
    isFavorite: false,
  },
];

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");
  const [customCouponCode, setCustomCouponCode] = useState<string>("");
  const [showCouponUI, setShowCouponUI] = useState(false);
  const [couponSearch, setCouponSearch] = useState("");

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

  const selectedCouponData = allCoupons.find(
    (coupon) => coupon.id === selectedCoupon,
  );

  const filteredCoupons = allCoupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
      coupon.description.toLowerCase().includes(couponSearch.toLowerCase());
    return matchesSearch;
  });

  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(cartItems.map((item) => item.id))
  );

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    }
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(itemId);
      return newSelected;
    });
  };

  const handleSaveForLater = (item: CartItem) => {
    dispatch(
      addToWishlist({
        id: item.id,
        title: item.name,
        brand: item.brand,
        description: item.details,
        basePrice: item.price,
        slug: item.name.toLowerCase().replace(/ /g, "-"),
        variants: [
          {
            id: `v-${item.id}`,
            color: { name: "Default", hex: "#000000" },
            size: "M",
            sku: `SKU-${item.id}`,
            price: item.price,
            originalPrice: item.originalPrice || item.price,
            discount: item.originalPrice
              ? Math.round(
                  ((item.originalPrice - item.price) / item.originalPrice) * 100
                )
              : 0,
            stockQuantity: 10,
            isDefault: true,
          },
        ],
        assets: [
          {
            id: `a-${item.id}`,
            type: "image",
            role: "thumbnail",
            url: item.image,
            alt: item.name,
            order: 1,
          },
        ],
      })
    );

    handleRemoveItem(item.id);

    toast.success(`Moved "${item.name}" to your wishlist!`, {
      action: {
        label: "View Wishlist",
        onClick: () => router.push("/wishlist"),
      },
    });
  };

  const handleToggleFavorite = (itemId: string) => {
    const item = cartItems.find((c) => c.id === itemId);
    if (item) {
      handleSaveForLater(item);
    }
  };

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.has(item.id)
  );

  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalSavings = selectedCartItems.reduce(
    (sum, item) => sum + (item.savings || 0) * item.quantity,
    0
  );


  const eligibleCoupons = filteredCoupons.filter(
    (coupon) => !coupon.minAmount || subtotal >= coupon.minAmount,
  );

  const ineligibleCoupons = filteredCoupons.filter(
    (coupon) => coupon.minAmount && subtotal < coupon.minAmount,
  );

  const handleApplyCustomCoupon = () => {
    const coupon = allCoupons.find(
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
    const coupon = allCoupons.find((c) => c.id === couponId);
    if (coupon) {
      setSelectedCoupon(couponId);
      setShowCouponUI(false);
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
    }
  };

  const couponDiscount = selectedCouponData
    ? selectedCouponData.type === "percentage"
      ? (subtotal * selectedCouponData.discount) / 100
      : selectedCouponData.discount
    : 0;

  const tax = Math.max(0, (subtotal - totalSavings - couponDiscount) * 0.08); // 8% tax
  const total = Math.max(0, subtotal - totalSavings - couponDiscount + tax);

  const totalItems = selectedCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleProceedToCheckout = () => {
    if (selectedItems.size === 0) {
      return;
    }
    // Store selected items in localStorage
    const selectedCartData = cartItems.filter((item) =>
      selectedItems.has(item.id)
    );
    localStorage.setItem("checkoutItems", JSON.stringify(selectedCartData));
    if (selectedCouponData) localStorage.setItem("checkoutCoupon", JSON.stringify(selectedCouponData));
    else localStorage.removeItem("checkoutCoupon");
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items in
            your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Cart Items</h2>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedItems.size === cartItems.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Select All
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const isSelected = selectedItems.has(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 pb-6 last:pb-0 border-b last:border-0"
                      >
                        <Checkbox
                          id={`item-${item.id}`}
                          checked={isSelected}
                          onCheckedChange={() => handleSelectItem(item.id)}
                          className="mt-2"
                        />

                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {item.brand}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {item.details}
                          </p>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.originalPrice && (
                              <>
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.originalPrice.toFixed(2)}
                                </span>
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Save ${item.savings?.toFixed(2)}
                                </Badge>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1 border rounded-lg bg-background">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 cursor-pointer"
                                onClick={() =>
                                  handleQuantityChange(item.id, -1)
                                }
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </Button>
                              <span className="px-2.5 py-0.5 min-w-[2.5rem] text-center text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 cursor-pointer"
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 gap-1.5 rounded-lg cursor-pointer"
                              onClick={() => handleSaveForLater(item)}
                            >
                              <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>Save for Later</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings</span>
                      <span>-${totalSavings.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <CouponButton
                    selectedCoupon={selectedCouponData}
                    hasCoupons={allCoupons.length > 0}
                    hasEligibleCoupons={eligibleCoupons.length > 0}
                    onOpenCoupons={() => setShowCouponUI(true)}
                    onRemoveCoupon={handleRemoveCoupon}
                  />
                </div>

                <Button
                  className="w-full mb-4"
                  size="lg"
                  onClick={handleProceedToCheckout}
                  disabled={selectedItems.size === 0}
                >
                  Proceed to Checkout
                </Button>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping on this order</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* You might also like Section */}
        <div className="mt-12">
          <SimilarProducts category="Men" currentSlug="" />
        </div>
      </div>

      <Dialog open={showCouponUI} onOpenChange={setShowCouponUI}>
        <DialogContent className="max-w-xl w-[95vw] h-[85vh] sm:h-[600px] p-0 gap-0 overflow-hidden flex flex-col sm:rounded-2xl">
          <DialogTitle className="sr-only">Available Coupons</DialogTitle>
          <div className="flex flex-col flex-1 overflow-hidden relative p-4 sm:p-6 pb-0">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowCouponUI(false)}
                className="shrink-0 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold">Available Coupons</h2>
            </div>
            <div className="flex-1 overflow-y-auto w-full relative sm:px-2 pb-6">
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

