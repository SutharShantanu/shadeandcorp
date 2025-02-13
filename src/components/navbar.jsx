"use client";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
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
  X,
  ChevronDown,
  ShoppingBag,
  LogOut,
  Settings,
  HomeIcon,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useEffect, useState } from "react";

const menuLinks = [
  {
    name: "Men",
    href: "/Men",
    images: ["men1.jpg", "men2.jpg", "men3.jpg"],
    categories: [
      {
        name: "Topwear",
        href: "/men/topwear",
        subcategories: [
          { name: "T-Shirts", href: "/men/topwear/t-shirts" },
          { name: "Casual Shirts", href: "/men/topwear/casual-shirts" },
          { name: "Formal Shirts", href: "/men/topwear/formal-shirts" },
          { name: "Sweatshirts", href: "/men/topwear/sweatshirts" },
          { name: "Sweaters", href: "/men/topwear/sweaters" },
          { name: "Jackets", href: "/men/topwear/jackets" },
          { name: "Blazers & Coats", href: "/men/topwear/blazers-coats" },
          { name: "Suits", href: "/men/topwear/suits" },
          { name: "Rain Jackets", href: "/men/topwear/rain-jackets" },
        ],
      },
      {
        name: "Bottomwear",
        href: "/men/bottomwear",
        subcategories: [
          { name: "Jeans", href: "/men/bottomwear/jeans" },
          { name: "Casual Trousers", href: "/men/bottomwear/casual-trousers" },
          { name: "Formal Trousers", href: "/men/bottomwear/formal-trousers" },
          { name: "Shorts", href: "/men/bottomwear/shorts" },
          {
            name: "Track Pants & Joggers",
            href: "/men/bottomwear/track-pants-joggers",
          },
        ],
      },
      {
        name: "Sportswear",
        href: "/men/sportswear",
        subcategories: [
          { name: "Activewear", href: "/men/sportswear/activewear" },
          { name: "Gym Apparel", href: "/men/sportswear/gym-apparel" },
          { name: "Sports T-Shirts", href: "/men/sportswear/sports-t-shirts" },
          { name: "Track Pants", href: "/men/sportswear/track-pants" },
          { name: "Gym Shorts", href: "/men/sportswear/gym-shorts" },
          { name: "Running Shoes", href: "/men/sportswear/running-shoes" },
        ],
      },
      {
        name: "Winterwear",
        href: "/men/winterwear",
        subcategories: [
          { name: "Jackets", href: "/men/winterwear/jackets" },
          { name: "Hoodies", href: "/men/winterwear/hoodies" },
          { name: "Sweaters", href: "/men/winterwear/sweaters" },
          { name: "Thermal Wear", href: "/men/winterwear/thermal-wear" },
          { name: "Woolen Coats", href: "/men/winterwear/woolen-coats" },
          { name: "Puffer Jackets", href: "/men/winterwear/puffer-jackets" },
          { name: "Cardigans", href: "/men/winterwear/cardigans" },
        ],
      },
      {
        name: "Swimwear",
        href: "/men/swimwear",
        subcategories: [
          { name: "Swim Trunks", href: "/men/swimwear/swim-trunks" },
          { name: "Board Shorts", href: "/men/swimwear/board-shorts" },
          { name: "Rash Guards", href: "/men/swimwear/rash-guards" },
        ],
      },
      {
        name: "Sleepwear",
        href: "/men/sleepwear",
        subcategories: [
          { name: "Pajamas", href: "/men/sleepwear/pajamas" },
          { name: "Night Suits", href: "/men/sleepwear/night-suits" },
          { name: "Sleep Shorts", href: "/men/sleepwear/sleep-shorts" },
          { name: "Lounge Pants", href: "/men/sleepwear/lounge-pants" },
        ],
      },
      {
        name: "Footwear",
        href: "/men/footwear",
        subcategories: [
          { name: "Casual Shoes", href: "/men/footwear/casual-shoes" },
          { name: "Sports Shoes", href: "/men/footwear/sports-shoes" },
          { name: "Formal Shoes", href: "/men/footwear/formal-shoes" },
          { name: "Sneakers", href: "/men/footwear/sneakers" },
          {
            name: "Sandals & Floaters",
            href: "/men/footwear/sandals-floaters",
          },
          { name: "Flip Flops", href: "/men/footwear/flip-flops" },
          { name: "Socks", href: "/men/footwear/socks" },
        ],
      },
      {
        name: "Sports Footwear",
        href: "/men/sports-footwear",
        subcategories: [
          { name: "Running Shoes", href: "/men/sports-footwear/running-shoes" },
          {
            name: "Training Shoes",
            href: "/men/sports-footwear/training-shoes",
          },
          {
            name: "Basketball Shoes",
            href: "/men/sports-footwear/basketball-shoes",
          },
          { name: "Hiking Boots", href: "/men/sports-footwear/hiking-boots" },
          {
            name: "Football Cleats",
            href: "/men/sports-footwear/football-cleats",
          },
        ],
      },
      {
        name: "Casual Footwear",
        href: "/men/casual-footwear",
        subcategories: [
          { name: "Loafers", href: "/men/casual-footwear/loafers" },
          { name: "Moccasins", href: "/men/casual-footwear/moccasins" },
          { name: "Espadrilles", href: "/men/casual-footwear/espadrilles" },
          { name: "Slip-Ons", href: "/men/casual-footwear/slip-ons" },
          { name: "Casual Boots", href: "/men/casual-footwear/casual-boots" },
          { name: "Boat Shoes", href: "/men/casual-footwear/boat-shoes" },
        ],
      },
      {
        name: "Rainwear Footwear",
        href: "/men/rainwear-footwear",
        subcategories: [
          {
            name: "Waterproof Boots",
            href: "/men/rainwear-footwear/waterproof-boots",
          },
          {
            name: "Rubber Sandals",
            href: "/men/rainwear-footwear/rubber-sandals",
          },
          { name: "Rain Shoes", href: "/men/rainwear-footwear/rain-shoes" },
        ],
      },
      {
        name: "Fragrances",
        href: "/men/fragrances",
        subcategories: [
          { name: "Perfumes", href: "/men/fragrances/perfumes" },
          { name: "Body Sprays", href: "/men/fragrances/body-sprays" },
          { name: "Deodorants", href: "/men/fragrances/deodorants" },
          { name: "Aftershave", href: "/men/fragrances/aftershave" },
          { name: "Cologne", href: "/men/fragrances/cologne" },
        ],
      },
      {
        name: "Watches",
        href: "/men/watches",
        subcategories: [
          { name: "Smart Watches", href: "/men/watches/smart-watches" },
          { name: "Analog Watches", href: "/men/watches/analog-watches" },
          { name: "Digital Watches", href: "/men/watches/digital-watches" },
        ],
      },
      {
        name: "Grooming",
        href: "/men/grooming",
        subcategories: [
          { name: "Shaving Kits", href: "/men/grooming/shaving-kits" },
          { name: "Beard Oils", href: "/men/grooming/beard-oils" },
          { name: "Beard Balms", href: "/men/grooming/beard-balms" },
          { name: "Trimmers", href: "/men/grooming/trimmers" },
          { name: "Aftershave Balms", href: "/men/grooming/aftershave-balms" },
        ],
      },
    ],
  },
  {
    name: "Women",
    href: "/Women",
    images: ["women1.jpg", "women2.jpg", "women3.jpg"],
    categories: [
      {
        name: "Topwear",
        href: "/women/topwear",
        subcategories: [
          { name: "Kurtis", href: "/women/topwear/kurtis" },
          { name: "Tops", href: "/women/topwear/tops" },
          { name: "Blouses", href: "/women/topwear/blouses" },
          { name: "Sweaters", href: "/women/topwear/sweaters" },
          { name: "Shirts", href: "/women/topwear/shirts" },
          { name: "Tunics", href: "/women/topwear/tunics" },
          { name: "Tees", href: "/women/topwear/tees" },
        ],
      },
      {
        name: "Bottomwear",
        href: "/women/bottomwear",
        subcategories: [
          { name: "Jeans", href: "/women/bottomwear/jeans" },
          { name: "Trousers", href: "/women/bottomwear/trousers" },
          { name: "Leggings", href: "/women/bottomwear/leggings" },
          { name: "Palazzos", href: "/women/bottomwear/palazzos" },
          { name: "Skirts", href: "/women/bottomwear/skirts" },
          { name: "Shorts", href: "/women/bottomwear/shorts" },
        ],
      },
      {
        name: "Activewear",
        href: "/women/activewear",
        subcategories: [
          { name: "Sports Bras", href: "/women/activewear/sports-bras" },
          { name: "Running Shoes", href: "/women/activewear/running-shoes" },
          { name: "Leggings", href: "/women/activewear/leggings" },
          { name: "Tank Tops", href: "/women/activewear/tank-tops" },
          { name: "Workout Tops", href: "/women/activewear/workout-tops" },
          { name: "Gym Shorts", href: "/women/activewear/gym-shorts" },
        ],
      },
      {
        name: "Winterwear",
        href: "/women/winterwear",
        subcategories: [
          { name: "Sweaters", href: "/women/winterwear/sweaters" },
          { name: "Cardigans", href: "/women/winterwear/cardigans" },
          { name: "Woolen Coats", href: "/women/winterwear/woolen-coats" },
          { name: "Puffer Jackets", href: "/women/winterwear/puffer-jackets" },
          { name: "Jackets", href: "/women/winterwear/jackets" },
          { name: "Fleece Wear", href: "/women/winterwear/fleece-wear" },
        ],
      },
      {
        name: "Sleepwear",
        href: "/women/sleepwear",
        subcategories: [
          { name: "Night Suits", href: "/women/sleepwear/night-suits" },
          { name: "Pajamas", href: "/women/sleepwear/pajamas" },
          { name: "Night Gowns", href: "/women/sleepwear/night-gowns" },
          { name: "Robes", href: "/women/sleepwear/robes" },
          { name: "Sleep Shorts", href: "/women/sleepwear/sleep-shorts" },
          { name: "Lingerie Sets", href: "/women/sleepwear/lingerie-sets" },
        ],
      },
      {
        name: "Swimwear",
        href: "/women/swimwear",
        subcategories: [
          { name: "Bikinis", href: "/women/swimwear/bikinis" },
          {
            name: "One-Piece Swimsuits",
            href: "/women/swimwear/one-piece-swimsuits",
          },
          { name: "Cover-Ups", href: "/women/swimwear/cover-ups" },
          { name: "Rash Guards", href: "/women/swimwear/rash-guards" },
        ],
      },
      {
        name: "Footwear",
        href: "/women/footwear",
        subcategories: [
          { name: "Casual Shoes", href: "/women/footwear/casual-shoes" },
          { name: "Flats", href: "/women/footwear/flats" },
          { name: "Heels", href: "/women/footwear/heels" },
          { name: "Boots", href: "/women/footwear/boots" },
          { name: "Sandals", href: "/women/footwear/sandals" },
          { name: "Sneakers", href: "/women/footwear/sneakers" },
        ],
      },
      {
        name: "Sports Footwear",
        href: "/women/sports-footwear",
        subcategories: [
          {
            name: "Running Shoes",
            href: "/women/sports-footwear/running-shoes",
          },
          {
            name: "Training Shoes",
            href: "/women/sports-footwear/training-shoes",
          },
          { name: "Hiking Boots", href: "/women/sports-footwear/hiking-boots" },
          {
            name: "Football Cleats",
            href: "/women/sports-footwear/football-cleats",
          },
        ],
      },
      {
        name: "Casual Footwear",
        href: "/women/casual-footwear",
        subcategories: [
          { name: "Loafers", href: "/women/casual-footwear/loafers" },
          { name: "Flats", href: "/women/casual-footwear/flats" },
          { name: "Slip-Ons", href: "/women/casual-footwear/slip-ons" },
          { name: "Espadrilles", href: "/women/casual-footwear/espadrilles" },
          { name: "Casual Boots", href: "/women/casual-footwear/casual-boots" },
        ],
      },
      {
        name: "Rainwear Footwear",
        href: "/women/rainwear-footwear",
        subcategories: [
          {
            name: "Waterproof Boots",
            href: "/women/rainwear-footwear/waterproof-boots",
          },
          { name: "Rain Shoes", href: "/women/rainwear-footwear/rain-shoes" },
          { name: "Flip Flops", href: "/women/rainwear-footwear/flip-flops" },
        ],
      },
      {
        name: "Fragrances",
        href: "/women/fragrances",
        subcategories: [
          { name: "Perfumes", href: "/women/fragrances/perfumes" },
          { name: "Body Sprays", href: "/women/fragrances/body-sprays" },
          { name: "Deodorants", href: "/women/fragrances/deodorants" },
          { name: "Cologne", href: "/women/fragrances/cologne" },
        ],
      },
      {
        name: "Watches",
        href: "/women/watches",
        subcategories: [
          { name: "Smart Watches", href: "/women/watches/smart-watches" },
          { name: "Analog Watches", href: "/women/watches/analog-watches" },
          { name: "Digital Watches", href: "/women/watches/digital-watches" },
        ],
      },
      {
        name: "Grooming",
        href: "/women/grooming",
        subcategories: [
          { name: "Makeup", href: "/women/grooming/makeup" },
          { name: "Face Creams", href: "/women/grooming/face-creams" },
          { name: "Shampoos", href: "/women/grooming/shampoos" },
          { name: "Hair Oils", href: "/women/grooming/hair-oils" },
          { name: "Conditioners", href: "/women/grooming/conditioners" },
          { name: "Face Wash", href: "/women/grooming/face-wash" },
        ],
      },
      {
        name: "Hair Accessories",
        href: "/women/hair-accessories",
        subcategories: [
          { name: "Hair Bands", href: "/women/hair-accessories/hair-bands" },
          { name: "Bobby Pins", href: "/women/hair-accessories/bobby-pins" },
          { name: "Clips", href: "/women/hair-accessories/clips" },
          { name: "Combs", href: "/women/hair-accessories/combs" },
        ],
      },
    ],
  },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-[999]"
    >
      <motion.div
        className="transition-all z-[998] ease-in-out border-b shadow-sm border-border/20 bg-transparent backdrop-blur-sm"
        role="navigation">
        <motion.div className="container mx-auto flex items-center justify-between py-2 px-4 md:px-2 lg:px-0">
          <Link href="/">
            <motion.div className="text-title text-primary-default font-forum whitespace-nowrap">
              Shade & Co.
            </motion.div>
          </Link>
          <NavigationMenu className="hidden md:flex w-full">
            <NavigationMenuList className="">
              {menuLinks.map((item) => (
                <NavigationMenuItem key={item.href} className="">
                  <NavigationMenuTrigger className="">
                    {item.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-4 flex-row flex justify-between rounded-sm">
                    <motion.div className="w-[300px] max-h-[250px]">
                      {/* {item.images &&
                        item.images.map((image, index) => (
                          <Image
                            key={`${image.href}-image-${index}`}
                            src={image}
                            width={500}
                            height={500}
                            alt={image.label}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ))} */}
                    </motion.div>
                    <ul className="grid grid-cols-6 gap-4 p-4 divide-2">
                      {item.categories &&
                        item.categories.map((items, index) => (
                          // <NavigationMenuLink asChild>
                          <li
                            key={`${items.href}-subcategory-${index}`}
                            className="text-primary-default text-xs py-1 group"
                          >
                            <NavigationMenuLink href={items.href}>
                              <span className="text-accent-default hover:underline underline-offset-2 rounded-md group-hover:bg-accent-default group-hover:text-primary-foreground transition-all ease-in-out px-2 py-1 whitespace-nowrap">
                                {items.name}
                              </span>{" "}
                              <ul className="pl-2 my-1">
                                {items.subcategories &&
                                  items.subcategories.map(
                                    (subitem, subIndex) => (
                                      <li
                                        key={subIndex}
                                        className="text-muted-foreground text-xs hover:border-muted-foreground py-1 hover:pl-2 transition-all ease-in-out"
                                      >
                                        <Link href={subitem.href}>
                                          <span className="text-muted-foreground flex items-center whitespace-nowrap">
                                            {subitem.name}
                                          </span>
                                        </Link>
                                      </li>
                                    )
                                  )}
                              </ul>
                            </NavigationMenuLink>
                          </li>
                          // </NavigationMenuLink>
                        ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <motion.div className="hidden md:flex items-center gap-x-4">
            <motion.div className="relative">
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
            </motion.div>

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
          </motion.div>
          <motion.div className="md:hidden flex items-center gap-x-4">
            <Search
              className="w-6 h-6 text-primary-default cursor-pointer"
              onClick={toggleSearch}
            />

            <Drawer direction="bottom">
              <DrawerTrigger>
                <Menu
                  className="w-6 h-6 text-accent-foreground cursor-pointer"
                  aria-label="Open menu"
                />
              </DrawerTrigger>
              <DrawerContent
                side="left"
                className="bg-primary-foreground p-4 border border-red-500"
              >
                <DrawerHeader>
                  <DrawerTitle className="text-primary-default">
                    Menu
                  </DrawerTitle>
                  <DrawerClose>
                    <Button size="icon">
                      <X />
                    </Button>
                  </DrawerClose>
                </DrawerHeader>

                <ScrollArea className="max-h-[400px] overflow-y-auto">
                  {menuLinks.map((item) => (
                    <div key={item.name} className="border-b border-gray-300">
                      <div className="flex justify-between items-center py-2">
                        <Link
                          href={item.href}
                          className="text-lg font-semibold text-primary-default"
                        >
                          {item.name}
                        </Link>
                        {item.categories && (
                          <button
                            onClick={() => toggleCategory(item.name)}
                            className="p-1 rounded-md hover:bg-gray-200 transition"
                          >
                            <ChevronDown
                              className={`w-5 h-5 transition-all ease-in-out ${openCategory === item.name
                                ? "rotate-180"
                                : "rotate-0"
                                }`}
                            />
                          </button>
                        )}
                      </div>
                      <Separator />
                      {openCategory === item.name && item.categories && (
                        <ul className="pl-4 space-y-1">
                          {item.categories.map((subItem, index) => (
                            <li
                              key={index}
                              className="text-muted-foreground text-sm py-1"
                            >
                              <Link
                                href={subItem.href}
                                className="hover:text-primary-default transition-all ease-in-out"
                              >
                                {subItem.name}
                              </Link>
                              {subItem.subcategories && (
                                <ul className="pl-4 mt-1 space-y-1">
                                  {subItem.subcategories.map(
                                    (subSubItem, subIndex) => (
                                      <li
                                        key={subIndex}
                                        className="text-xs text-muted-foreground hover:pl-2 transition-all ease-in-out"
                                      >
                                        <Link href={subSubItem.href}>
                                          {subSubItem.name}
                                        </Link>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </ScrollArea>
                <DrawerFooter className="space-y-2">
                  © {currentYear} Shade and Crop. All rights reserved.
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </motion.div>
          {isSearchVisible && (
            <motion.div className="md:hidden absolute top-16 left-0 w-full">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full rounded-full border-none outline-none"
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      <BreadCrumbs />
    </motion.div >
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


const BreadCrumbs = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathSegments = pathname?.split("/").filter(Boolean);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const capitalize = (str) => {
    return str
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      {pathSegments.length >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="transition-all ease-in-out absolute -bottom-13 left-0 right-0 -z-[1] border-border/20 border-b shadow-sm w-full backdrop-blur-sm"
        >
          <ul className="container mx-auto flex items-center justify-between py-2 px-4 md:px-2 lg:px-0 space-x-2 text-sm text-muted-foreground">
            <Breadcrumb className="flex items-center">
              {/* <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:underline flex items-center text-xs underline-offset-2">
                  <HomeIcon className="w-4 h-4 mr-1" />
                  Home
                </BreadcrumbLink>
                {pathSegments?.length > 0 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="w-4 h-4 mx-2" />
                  </BreadcrumbSeparator>
                )}
              </BreadcrumbItem> */}
              {pathSegments?.map((segment, index) => {
                const path = `/${pathSegments?.slice(0, index + 1).join("/")}`;
                const isLast = index === pathSegments.length - 1;
                return (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink asChild
                      href={path}
                      className={`hover:underline px-1 py-[2px] text-xs underline-offset-2 rounded-md ${isLast ? "bg-primary-default text-primary-foreground hover:text-primary-foreground" : " text-primary-default"}`}
                    >
                      {capitalize(segment)}
                    </BreadcrumbLink>
                    {!isLast && (
                      <BreadcrumbSeparator>
                        <ChevronRight className="w-4 h-4 mx-2" />
                      </BreadcrumbSeparator>
                    )}
                  </BreadcrumbItem>
                );
              })}
            </Breadcrumb>
          </ul>
        </motion.div>
      )}
    </>
  );
};