"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Truck,
  CreditCard,
  Package,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type CheckoutStep = "information" | "shipping" | "payment" | "review";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Default items if none are in localStorage
const defaultOrderItems: OrderItem[] = [
  {
    id: "1",
    name: "Premium Laptop",
    price: 1299.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Wireless Mouse",
    price: 49.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
  },
];

const informationSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  subscribeToNews: z.boolean().optional(),
});

const shippingSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number is required"),
  cardName: z.string().min(1, "Cardholder name is required"),
  expiryDate: z.string().min(5, "Expiry date is required"),
  cvv: z.string().min(3, "CVV is required"),
});

type InformationFormData = z.infer<typeof informationSchema>;
type ShippingFormData = z.infer<typeof shippingSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

const steps: { id: CheckoutStep; label: string; icon: React.ReactNode }[] = [
  { id: "information", label: "Information", icon: <User className="h-5 w-5" /> },
  { id: "shipping", label: "Shipping", icon: <Truck className="h-5 w-5" /> },
  { id: "payment", label: "Payment", icon: <CreditCard className="h-5 w-5" /> },
  { id: "review", label: "Review", icon: <Package className="h-5 w-5" /> },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [orderItems, setOrderItems] = useState<OrderItem[]>(defaultOrderItems);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  useEffect(() => {
    // Load items from localStorage if available
    const storedItems = localStorage.getItem("checkoutItems");
    if (storedItems) {
      try {
        const parsed = JSON.parse(storedItems);
        // Map cart items to order items format
        const mappedItems: OrderItem[] = parsed.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));
        if (mappedItems.length > 0) {
          setOrderItems(mappedItems);
        }
      } catch (error) {
        console.error("Error parsing stored items:", error);
      }
    }
    const storedCoupon = localStorage.getItem("checkoutCoupon");
    if (storedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(storedCoupon));
      } catch (error) {}
    }
  }, []);

  const informationForm = useForm<InformationFormData>({
    resolver: zodResolver(informationSchema),
    defaultValues: {
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "+1 (555) 123-4567",
      subscribeToNews: false,
    },
  });

  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;

  const tax = Math.max(0, (subtotal - couponDiscount) * 0.08); // 8% tax
  const total = Math.max(0, subtotal - couponDiscount + tax);

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === "information") {
      isValid = await informationForm.trigger();
      if (isValid) setCurrentStep("shipping");
    } else if (currentStep === "shipping") {
      isValid = await shippingForm.trigger();
      if (isValid) setCurrentStep("payment");
    } else if (currentStep === "payment") {
      isValid = await paymentForm.trigger();
      if (isValid) setCurrentStep("review");
    } else if (currentStep === "review") {
      // Handle final submission
      console.log("Order submitted!", {
        information: informationForm.getValues(),
        shipping: shippingForm.getValues(),
        payment: paymentForm.getValues(),
        items: orderItems,
        coupon: appliedCoupon,
      });
      // Clear checkout items from localStorage
      localStorage.removeItem("checkoutItems");
      localStorage.removeItem("checkoutCoupon");
      // You can redirect to a success page or show a confirmation
      // router.push("/order-success");
    }
  };

  const handlePrevious = () => {
    if (currentStep === "shipping") {
      setCurrentStep("information");
    } else if (currentStep === "payment") {
      setCurrentStep("shipping");
    } else if (currentStep === "review") {
      setCurrentStep("payment");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "information":
        return (
          <Form {...informationForm}>
            <form className="space-y-4">
              <FormField
                control={informationForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={informationForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={informationForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={informationForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={informationForm.control}
                name="subscribeToNews"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Email me with news and offers</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );

      case "shipping":
        return (
          <Form {...shippingForm}>
            <form className="space-y-4">
              <FormField
                control={shippingForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Street address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={shippingForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={shippingForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={shippingForm.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={shippingForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        );

      case "payment":
        return (
          <Form {...paymentForm}>
            <form className="space-y-4">
              <FormField
                control={paymentForm.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Card Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={paymentForm.control}
                name="cardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={paymentForm.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Expiry Date</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="MM/YY" maxLength={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={paymentForm.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>CVV</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123" maxLength={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <p>
                  {informationForm.getValues("email")}
                </p>
                <p>
                  {informationForm.getValues("firstName")}{" "}
                  {informationForm.getValues("lastName")}
                </p>
                <p>{informationForm.getValues("phone")}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">Shipping Address</h3>
              <div className="space-y-2 text-sm">
                <p>{shippingForm.getValues("address")}</p>
                <p>
                  {shippingForm.getValues("city")},{" "}
                  {shippingForm.getValues("state")}{" "}
                  {shippingForm.getValues("zipCode")}
                </p>
                <p>{shippingForm.getValues("country")}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">Payment Method</h3>
              <div className="space-y-2 text-sm">
                <p>
                  Card ending in{" "}
                  {paymentForm.getValues("cardNumber").slice(-4)}
                </p>
                <p>{paymentForm.getValues("cardName")}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Secure Checkout</h1>
          <p className="text-muted-foreground">
            Complete your purchase in 4 easy steps
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = stepIndex > index;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isActive
                          ? "bg-gray-900 text-white border-gray-900"
                          : isCompleted
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-gray-100 text-gray-400 border-gray-300"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-4 ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  {steps[stepIndex].icon}
                  <h2 className="text-xl font-semibold">
                    {steps[stepIndex].label}
                  </h2>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-4 mt-8">
                  {stepIndex > 0 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    className="flex items-center gap-2 ml-auto"
                  >
                    {currentStep === "review" ? "Place Order" : "Continue"}
                    {currentStep !== "review" && (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount</span>
                      <span className="font-semibold">-${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

