"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/header/sectionHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { NumberInput, NumberInputButton, NumberInputField, NumberInputRoot } from "@/components/ui/number-input";

const CartSummary = ({ total }) => (
    <motion.div className="p-4 border-t bg-white rounded-md">
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
        <p className="text-sm text-muted-foreground">Use code SAVE10 to get 10% off!</p>
    </motion.div>
);

const TermsAndConditions = () => (
    <motion.div className="p-4 border bg-white rounded-md">
        <h2 className="text-lg font-semibold">Terms & Conditions</h2>
        <p className="text-sm text-muted-foreground">By proceeding, you agree to our terms and conditions.</p>
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
    <motion.div className="text-center text-muted-foreground p-6">Your cart is empty</motion.div>
);

const CartItem = ({ item }) => {
    return (
        <motion.div className="flex items-center gap-4">
            <Image src="https://image.hm.com/assets/hm/a9/4c/a94cb6af4e37b45a9e618c70bba6c017773d9e01.jpg?imwidth=657" alt="Product Image" width={60} height={60} className="object-cover rounded-md border border-border" />
            <div>
                <h2 className="text-description font-semibold">{item.name}</h2>
                <p className="text-xs text-muted-foreground">Brand: XYZ</p>
                <p className="text-xs text-muted-foreground">Size: Medium</p>
                <p className="text-xs text-muted-foreground">Color: Black</p>
                <motion.div className="flex items-center gap-2">
                    <Button className="text-destructive-default font-normal border border-border h-7 text-xs rounded-xs px-2 cursor-pointer">
                        Move to Wishlist
                        <Heart />
                    </Button>
                    <Button size="icon" className="text-destructive-default border border-border h-7 text-xs rounded-xs px-2 cursor-pointer">
                        <Trash2 />
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

const Cart = () => {
    const [cart, setCart] = useState([
        { id: 1, name: "Wireless Headphones", price: 99.99, quantity: 2, discount: 10 },
        { id: 2, name: "Smartwatch", price: 149.99, quantity: 1, discount: 0 },
        { id: 3, name: "Bluetooth Speaker", price: 79.99, quantity: 3, discount: 5 },
    ]);

    const [selectedItems, setSelectedItems] = useState([]);
    const allSelected = selectedItems.length === cart.length;
    const [value, setValue] = useState(0);
    const inputRef = useRef(null);
    const min = 0;
    const max = 100;

    const handleSelectAll = () => {
        setSelectedItems(allSelected ? [] : cart.map((item) => item.id));
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const totalPrice = (price, quantity, discount) => {
        const discountedPrice = price - (price * discount) / 100;
        return (discountedPrice * quantity).toFixed(2);
    };

    const handleQuantity = (id, value) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, value) } : item
            )
        );
    };

    const handleValueChange = (newValue) => {
        setValue(Math.min(Math.max(newValue, min), max));
    };

    const handlePointerDown = (id, diff) => (event) => {
        event.preventDefault();
        inputRef.current?.focus();

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, Math.min(item.quantity + diff, max)) }
                    : item
            )
        );
    };

    const descriptionContent = (
        <motion.div>
            {selectedItems?.length > 0 ? (
                <span>
                    <span className="font-heading mx-1 text-subheading">
                        {selectedItems?.length}
                    </span>
                    {selectedItems?.length === 1 ? "Item" : "Items"} Selected
                </span>
            ) : (
                "No Product Selected"
            )}
        </motion.div>
    );

    return (
        <motion.div className="container mx-auto py-6 min-h-screen">
            <motion.div className="flex items-center gap-2 justify-between">
                <PageHeader
                    titlePrefix="Shopping Cart"
                    containerClassName="my-2 w-[65%]"
                    descriptionPosition="right"
                    description={descriptionContent}
                />
                <PageHeader
                    titlePrefix="Billing Details"
                    containerClassName="my-2 w-[32%]"
                />
            </motion.div>
            {cart.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        <Table className="border border-border rounded-xs">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
                                    </TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Total Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.map((item) => (
                                    <TableRow key={item.id} className="border-b border-border">
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedItems.includes(item.id)}
                                                onCheckedChange={() => handleSelectItem(item.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <CartItem item={item} />
                                        </TableCell>
                                        <TableCell>
                                            <NumberInputRoot className="" onChange={handleValueChange}>
                                                <NumberInputButton onClick={handlePointerDown(item.id, -1)} disabled={item.quantity <= 1} icon="minus" />
                                                <NumberInputField
                                                    ref={inputRef}
                                                    value={item.quantity}
                                                    onInput={(newValue) => handleQuantity(item.id, newValue)}
                                                    min={min}
                                                    max={max}
                                                />
                                                <NumberInputButton onClick={handlePointerDown(item.id, 1)} disabled={value >= max} icon="plus" />
                                            </NumberInputRoot>
                                        </TableCell>
                                        <TableCell>${item.price.toFixed(2)} x {item.quantity}</TableCell>
                                        <TableCell className="text-destructive-default line-through">{item.discount}%</TableCell>
                                        <TableCell>${totalPrice(item.price, item.quantity, item.discount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="space-y-4">
                        <motion.div className="p-4 border bg-white rounded-md">
                            <h2 className="text-lg font-semibold">Total: ${cart.reduce((acc, item) => acc + (item.price - (item.price * item.discount) / 100) * item.quantity, 0).toFixed(2)}</h2>
                            <Button className="mt-4 w-full">Checkout</Button>
                        </motion.div>
                    </div>
                </div>
            ) : (
                <CartEmpty />
            )}
        </motion.div>
    );
};

export default Cart;
