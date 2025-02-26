"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";

const CartItem = ({ item }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between p-4 border rounded-xs bg-white"
    >
        <div>
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500">${item.price} x {item.quantity}</p>
        </div>
        <p className="text-lg font-semibold">${item.price * item.quantity}</p>
    </motion.div>
);

const CartSummary = ({ total }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="p-4 border-t mt-4 bg-white rounded-xs"
    >
        <h2 className="text-lg font-semibold">Total: ${total}</h2>
        <Button className="mt-4 w-full">Checkout</Button>
    </motion.div>
);

const CartEmpty = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-gray-500 p-6"
    >
        Your cart is empty
    </motion.div>
);

const Cart = () => {
    // Dummy cart data
    const [cart, setCart] = useState([
        { id: 1, name: "Wireless Headphones", price: 99.99, quantity: 2 },
        { id: 2, name: "Smartwatch", price: 149.99, quantity: 1 },
        { id: 3, name: "Bluetooth Speaker", price: 79.99, quantity: 3 },
    ]);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-6 min-h-screen"
        >
            {cart.length > 0 ? (
                <div className="flex justify-between gap-6">
                    <div>
                    {cart.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                    </div>
                    <CartSummary total={total.toFixed(2)} />
                </div>
            ) : (
                <CartEmpty />
            )}
        </motion.div>
    );
};

export default Cart;
