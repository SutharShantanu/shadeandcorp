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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

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

const recommendedProducts = [
  { id: "r1", name: "Related Product 1", price: 29.99 },
  { id: "r2", name: "Related Product 2", price: 29.99 },
  { id: "r3", name: "Related Product 3", price: 29.99 },
  { id: "r4", name: "Related Product 4", price: 29.99 },
];

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(cartItems.map((item) => item.id))
  );
  const [promoCode, setPromoCode] = useState("");

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

  const handleToggleFavorite = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
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

  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal - totalSavings + tax;
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

                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleToggleFavorite(item.id)}
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  item.isFavorite
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }`}
                              />
                            </Button>

                            <div className="flex items-center gap-2 border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(item.id, -1)
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="px-3 py-1 min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
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
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full opacity-50" />
                  </div>
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

