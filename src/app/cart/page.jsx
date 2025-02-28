"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";

const CartItem = ({ item, setCart, cart }) => {
    const updateQuantity = (id, quantity) => {
        setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };
    return (
        <motion.div className="flex justify-between p-4 border rounded-md bg-white">
            <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">${item.price} x {item.quantity}</p>
                <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    className="border p-1 w-16"
                />
            </div>
            <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
        </motion.div>
    );
};

const CartSummary = ({ total }) => (
    <motion.div className="p-4 border-t mt-4 bg-white rounded-md">
        <h2 className="text-lg font-semibold">Total: ${total}</h2>
        <Button className="mt-4 w-full">Checkout</Button>
    </motion.div>
);

const CouponSection = () => (
    <motion.div className="p-4 border bg-white rounded-md">
        <h2 className="text-lg font-semibold">Apply Coupon</h2>
        <input type="text" placeholder="Enter coupon code" className="border p-2 w-full mt-2" />
        <Button className="mt-2 w-full">Apply</Button>
    </motion.div>
);

const OffersSection = () => (
    <motion.div className="p-4 border bg-white rounded-md">
        <h2 className="text-lg font-semibold">Available Offers</h2>
        <p className="text-sm text-gray-500">Use code SAVE10 to get 10% off!</p>
    </motion.div>
);

const TermsAndConditions = () => (
    <motion.div className="p-4 border bg-white rounded-md">
        <h2 className="text-lg font-semibold">Terms & Conditions</h2>
        <p className="text-sm text-gray-500">By proceeding, you agree to our terms and conditions.</p>
    </motion.div>
);

const CheckoutSection = () => (
    <motion.div className="p-4 border bg-white rounded-md">
        <h2 className="text-lg font-semibold">Billing Details</h2>
        <input type="text" placeholder="Full Name" className="border p-2 w-full mt-2" />
        <input type="text" placeholder="Address" className="border p-2 w-full mt-2" />
        <input type="text" placeholder="City" className="border p-2 w-full mt-2" />
        <Button className="mt-4 w-full">Proceed to Payment</Button>
    </motion.div>
);

const CartEmpty = () => (
    <motion.div className="text-center text-gray-500 p-6">Your cart is empty</motion.div>
);

const Cart = () => {
    const [cart, setCart] = useState([
        { id: 1, name: "Wireless Headphones", price: 99.99, quantity: 2 },
        { id: 2, name: "Smartwatch", price: 149.99, quantity: 1 },
        { id: 3, name: "Bluetooth Speaker", price: 79.99, quantity: 3 },
    ]);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <motion.div className="container mx-auto py-6 min-h-screen">
            {cart.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <CartItem key={item.id} item={item} setCart={setCart} cart={cart} />
                        ))}
                        <CouponSection />
                        <OffersSection />
                        <TermsAndConditions />
                    </div>
                    <div className="space-y-4">
                        <CartSummary total={total.toFixed(2)} />
                        <CheckoutSection />
                    </div>
                </div>
            ) : (
                <CartEmpty />
            )}
        </motion.div>
    );
};

export default Cart;
