"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  Heart,
  HelpCircle,
  RefreshCw,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ShoppingBag, LogOut, Settings } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const menuLinks = [
  {
    href: "/shop/men",
    label: "Men",
    icon: <User className="w-5 h-5" />,
    subcategories: [
      { label: "T-Shirts", href: "/shop/men/t-shirts" },
      { label: "Jeans", href: "/shop/men/jeans" },
      { label: "Shirts", href: "/shop/men/shirts" },
      { label: "Jackets", href: "/shop/men/jackets" },
      { label: "Footwear", href: "/shop/men/footwear" },
      { label: "Suits", href: "/shop/men/suits" },
      { label: "Activewear", href: "/shop/men/activewear" },
      { label: "Accessories", href: "/shop/men/accessories" },
    ],
  },
  {
    href: "/shop/women",
    label: "Women",
    icon: <User className="w-5 h-5" />,
    subcategories: [
      { label: "Dresses", href: "/shop/women/dresses" },
      { label: "Tops", href: "/shop/women/tops" },
      { label: "Skirts", href: "/shop/women/skirts" },
      { label: "Jeans", href: "/shop/women/jeans" },
      { label: "Shirts", href: "/shop/women/shirts" },
      { label: "Sweaters", href: "/shop/women/sweaters" },
      { label: "Footwear", href: "/shop/women/footwear" },
      { label: "Bags", href: "/shop/women/bags" },
      { label: "Jewelry", href: "/shop/women/jewelry" },
    ],
  },
  {
    href: "/shop/accessories",
    label: "Accessories",
    icon: <Heart className="w-5 h-5" />,
    subcategories: [
      { label: "Watches", href: "/shop/accessories/watches" },
      { label: "Bags", href: "/shop/accessories/bags" },
      { label: "Jewelry", href: "/shop/accessories/jewelry" },
      { label: "Sunglasses", href: "/shop/accessories/sunglasses" },
      { label: "Wallets", href: "/shop/accessories/wallets" },
      { label: "Belts", href: "/shop/accessories/belts" },
      { label: "Hats", href: "/shop/accessories/hats" },
      { label: "Caps", href: "/shop/accessories/caps" },
    ],
  },
  {
    href: "/shop/footwear",
    label: "Footwear",
    icon: <ShoppingCart className="w-5 h-5" />,
    subcategories: [
      { label: "Men's Shoes", href: "/shop/footwear/mens" },
      { label: "Women's Shoes", href: "/shop/footwear/womens" },
      { label: "Kids' Shoes", href: "/shop/footwear/kids" },
      { label: "Sports Shoes", href: "/shop/footwear/sports" },
      { label: "Boots", href: "/shop/footwear/boots" },
      { label: "Flip-flops", href: "/shop/footwear/flipflops" },
    ],
  },
  //   {
  //     href: "/offers",
  //     label: "Offers",
  //     icon: <Search className="w-5 h-5" />,
  //   },
  //   {
  //     href: "/new-arrivals",
  //     label: "New Arrivals",
  //     icon: <ShoppingCart className="w-5 h-5" />,
  //   },
  //   {
  //     href: "/contact",
  //     label: "Contact",
  //     icon: <User className="w-5 h-5" />,
  //   },
  //   {
  //     href: "/faq",
  //     label: "FAQ",
  //     icon: <Search className="w-5 h-5" />,
  //   },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false); // For mobile search bar
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
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

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "shadow-sm border-muted-foreground bg-primary-foreground"
            : "bg-transparent"
        }`}
        role="navigation"
      >
        <div className="container mx-auto flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <div className="text-title text-primary-default font-forum whitespace-nowrap">
              Shade & Co.
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex w-full">
            <NavigationMenuList className="">
              {menuLinks.map((link) => (
                <NavigationMenuItem key={link.href} className="">
                  <NavigationMenuTrigger className="">
                    {link.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-4 flex-row flex justify-between rounded-sm">
                    <Image
                      src="https://picsum.photos/200/300"
                      width={500}
                      height={500}
                      alt=""
                      className="w-[300px] max-h-[250px] object-cover rounded-md"
                    />
                    <ul className="grid grid-cols-4 gap-4 p-4">
                      {link.subcategories &&
                        link.subcategories.map((subcategory, index) => (
                          <li
                            key={index}
                            className="text-primary-default text-xs hover:border-primary-default border-b border-transparent py-1"
                          >
                            <Link href={subcategory.href}>
                              {subcategory.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Icons (Wishlist, Cart, Profile Dropdown) */}
          <div className="hidden md:flex items-center gap-x-4">
            {/* Search Bar (Desktop) */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className=" rounded-sm border-none outline-none"
              />
              <Search
                className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground cursor-pointer"
                onClick={handleSearch}
              />
            </div>

            <Link href="/wishlist">
              <Heart
                className="w-6 h-6 text-primary-default cursor-pointer"
                aria-label="Wishlist"
              />
            </Link>
            <Link href="/cart">
              <ShoppingCart
                className="w-6 h-6 text-primary-default cursor-pointer"
                aria-label="Cart"
              />
            </Link>
            <ProfileDropdown />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-x-4">
            {/* Search Icon (Mobile) */}
            <Search
              className="w-6 h-6 text-primary-default cursor-pointer"
              onClick={toggleSearch}
            />

            {/* Hamburger Menu */}
            <Drawer direction="bottom">
              <DrawerTrigger>
                <Menu
                  className="w-6 h-6 text-accent-foreground cursor-pointer"
                  aria-label="Open menu"
                />
              </DrawerTrigger>
              <DrawerContent side="left" className="bg-primary-foreground">
                <DrawerHeader>
                  <DrawerTitle className="text-primary-foreground">
                    Menu
                  </DrawerTitle>
                </DrawerHeader>
                <nav className="flex flex-col gap-y-4 mt-4">
                  {menuLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-primary-default hover:text-accent-foreground"
                    >
                      {link.icon} {link.label}
                    </Link>
                  ))}
                  <div className="mt-4">
                    <Button
                      className="absolute top-4 right-4 text-primary-foreground"
                      onClick={() => document.activeElement.blur()}
                      aria-label="Close menu"
                    >
                      ✕
                    </Button>
                  </div>
                </nav>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Mobile Search Bar (Conditional Rendering) */}
          {isSearchVisible && (
            <div className="md:hidden absolute top-16 left-0 w-full">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full rounded-full border-none outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

const menuItems = [
  { label: "Profile", icon: User, link: "/profile" },
  { label: "Orders", icon: ShoppingBag, link: "/orders" },
  { label: "Settings", icon: Settings, link: "/settings" },
  { label: "Help & Support", icon: HelpCircle, link: "/help" },
  { label: "Returns & Exchanges", icon: RefreshCw, link: "/returns" },
  { label: "Track Order", icon: MapPin, link: "/track-order" },
];

const ProfileDropdown = () => {
  return (
    <DropdownMenu className="bg-primary-foreground relative">
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 select-none bg-primary-foreground border-muted-foreground cursor-pointer">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AvatarImage
                  src="https://picsum.photos/150/150"
                  alt="User Avatar"
                />
                <AvatarFallback className="text-primary-default text-subheading">
                  U
                </AvatarFallback>
              </TooltipTrigger>
              <TooltipContent>User Name</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-primary-foreground p-0"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal rounded-md select-none mb-0">
          <div className="flex flex-row">
            <Avatar className="select-none bg-primary-foreground mr-3">
              <AvatarImage
                src="https://picsum.photos/150/150"
                alt="User Avatar"
              />
              <AvatarFallback className="text-primary-default text-subheading">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-around">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-xs leading-none text-muted-foreground">
                john.doe@example.com
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-separator mt-0" />
        {menuItems.map((item, index) => (
          <Link href={item.link} key={index}>
            <DropdownMenuItem className="flex items-center gap-x-2 p-2 hover:bg-primary-default cursor-pointer group transition-all ease-in-out m-1">
              <item.icon className="h-4 w-4 group-hover:text-primary-foreground" />
              <span className="group-hover:text-primary-foreground">
                {item.label}
              </span>
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuItem className="text-destructive-default m-1 cursor-pointer hover:bg-destructive-default group transition-all ease-in-out">
          <LogOut className="mr-2 h-4 w-4 group-hover:text-primary-foreground" />
          <span className="group-hover:text-primary-foreground">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
