"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Search, ShoppingCart, User, Heart, Tag, Star } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSubNavbar, setShowSubNavbar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 0);
            setShowSubNavbar(scrollTop > 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <>
            <motion.div
                initial={{ backgroundColor: "white" }}
                animate={{
                    boxShadow: isScrolled ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" : "none",
                }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
            >
                <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
                    <Link href="/">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-2xl sm:text-3xl font-extrabold tracking-wide text-heading select-none"
                        >
                            Shade & Co.
                        </motion.div>
                    </Link>
                    <div className="hidden md:flex items-center w-1/3">
                        <div className="relative w-full">
                            <motion.input
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.5 }}
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="w-full py-2 px-4 text-sm text-paragraph bg-background border-b border-border focus:border-heading focus:outline-none"
                            />
                            <Search
                                className="absolute right-3 top-2.5 w-5 h-5 text-paragraph cursor-pointer"
                                onClick={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 sm:gap-x-6">
                        <Link href="/wishlist">
                            <Heart className="w-6 h-6 text-heading hover:scale-105 transition-all ease-in-out cursor-pointer" />
                        </Link>
                        <Link href="/cart">
                            <ShoppingCart className="w-6 h-6 text-heading hover:scale-105 transition-all ease-in-out cursor-pointer" />
                        </Link>
                        <Link href="/account">
                            <User className="w-6 h-6 text-heading hover:scale-105 transition-all ease-in-out cursor-pointer" />
                        </Link>
                        <Menu className="w-6 h-6 text-heading md:hidden hover:scale-105 transition-all ease-in-out cursor-pointer" />
                    </div>
                </div>
            </motion.div>
            {showSubNavbar && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-[4.2rem] left-0 w-full bg-tw-white z-40 shadow-sm py-2"
                >
                    <div className="flex flex-wrap items-center justify-center py-2 gap-x-4 sm:gap-x-8 max-w-7xl mx-auto">
                        <Link
                            href="/shop/men"
                            className="relative text-heading  font-medium group"
                        >
                            Men
                            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-tw-black scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left" />
                        </Link>
                        <Link
                            href="/shop/women"
                            className="relative text-heading  font-medium group"
                        >
                            Women
                            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-tw-black scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left" />
                        </Link>
                        <Link
                            href="/shop/accessories"
                            className="relative text-heading  font-medium group"
                        >
                            Accessories
                            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-tw-black scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left" />
                        </Link>
                        <Link
                            href="/offers"
                            className="flex items-center gap-x-2 relative group"
                        >
                            <Tag className="w-5 text-danger" />
                            <span className="text-danger font-semibold">Offers</span>
                            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-danger scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left" />
                        </Link>
                        <Link
                            href="/new-arrivals"
                            className="flex items-center gap-x-2 relative group"
                        >
                            <Star className="w-5 text-secondary" />
                            <span className="text-secondary font-semibold">New Arrivals</span>
                            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left" />
                        </Link>
                        <Link
                            href="/contact"
                            className="relative text-heading  font-medium group"
                        >
                            Contact
                            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-tw-black scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left" />
                        </Link>
                        <Link
                            href="/faq"
                            className="relative text-heading  font-medium group"
                        >
                            FAQ
                            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-tw-black scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left" />

                        </Link>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default Navbar;
