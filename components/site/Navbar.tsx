"use client";

import Link from "next/link";
import Image from "next/image";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Heart,
  Search,
  ShoppingBag,
  User,
  Settings,
  LogOut,
  BadgeCheck,
  CreditCard,
  MapPin,
  Bell,
  BadgeInfo,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "@/components/ui/menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AvatarBadge from "@/components/site/AvatarBadge";
import { useAppSelector } from "@/lib/store";
import { getNotificationsByCategory } from "@/lib/domain/notificationUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Dot } from "../ui/dot";
import { useDebounce } from "@/hooks/use-debounce";

const categories = [
  {
    title: "Men",
    items: [
      { title: "T-Shirts", href: "/products/men/clothing/t-shirts" },
      { title: "Casual Shirts", href: "/products/men/clothing/casual-shirts" },
      { title: "Formal Shirts", href: "/products/men/clothing/formal-shirts" },
      { title: "Jeans", href: "/products/men/clothing/jeans" },
      { title: "Casual Trousers", href: "/products/men/clothing/casual-trousers" },
      { title: "Formal Trousers", href: "/products/men/clothing/formal-trousers" },
      { title: "Shorts", href: "/products/men/clothing/shorts" },
      { title: "Jackets", href: "/products/men/clothing/jackets" },
      { title: "Blazers", href: "/products/men/clothing/blazers" },
      { title: "Sweaters", href: "/products/men/clothing/sweaters" },
      { title: "Sweatshirts", href: "/products/men/clothing/sweatshirts" },
      { title: "Activewear", href: "/products/men/clothing/activewear" },
      { title: "Loungewear", href: "/products/men/clothing/loungewear" },
      { title: "Innerwear", href: "/products/men/clothing/innerwear" },
      { title: "Nightwear", href: "/products/men/clothing/nightwear" },
      { title: "Winterwear", href: "/products/men/clothing/winterwear" },
      { title: "Suits", href: "/products/men/clothing/suits" },
      { title: "Ethnic Wear", href: "/products/men/clothing/ethnic" },
    ],
    image: "/images/menu/men.png",
  },
  {
    title: "Women",
    items: [
      { title: "Dresses", href: "/products/women/clothing/dresses" },
      { title: "Tops", href: "/products/women/clothing/tops" },
      { title: "T-Shirts", href: "/products/women/clothing/t-shirts" },
      { title: "Jeans", href: "/products/women/clothing/jeans" },
      { title: "Trousers", href: "/products/women/clothing/trousers" },
      { title: "Skirts", href: "/products/women/clothing/skirts" },
      { title: "Jumpsuits", href: "/products/women/clothing/jumpsuits" },
      { title: "Blouses", href: "/products/women/clothing/blouses" },
      { title: "Sweaters", href: "/products/women/clothing/sweaters" },
      { title: "Jackets", href: "/products/women/clothing/jackets" },
      { title: "Activewear", href: "/products/women/clothing/activewear" },
      { title: "Lingerie", href: "/products/women/clothing/lingerie" },
      { title: "Kurtas & Kurtis", href: "/products/women/clothing/kurtas" },
      { title: "Ethnic Wear", href: "/products/women/clothing/ethnic" },
      { title: "Sarees", href: "/products/women/clothing/sarees" },
      { title: "Leggings", href: "/products/women/clothing/leggings" },
      { title: "Sleepwear", href: "/products/women/clothing/sleepwear" },
      { title: "Loungewear", href: "/products/women/clothing/loungewear" },
    ],
    image: "/images/menu/women.png",
  },
  {
    title: "Kids",
    items: [
      { title: "Boys Clothing", href: "/products/kids/clothing/boys" },
      { title: "Girls Clothing", href: "/products/kids/clothing/girls" },
      { title: "Infants", href: "/products/kids/clothing/infants" },
      { title: "School Uniforms", href: "/products/kids/clothing/uniforms" },
      { title: "Party Wear", href: "/products/kids/clothing/party-wear" },
      { title: "Footwear", href: "/products/kids/clothing/footwear" },
      { title: "Accessories", href: "/products/kids/clothing/accessories" },
      { title: "Winter Wear", href: "/products/kids/clothing/winter-wear" },
    ],
    image: "/images/menu/kids.png",
  },
  {
    title: "Collections",
    items: [
      { title: "Summer 2025", href: "/products/collections/summer-2025" },
      { title: "Winter Essentials", href: "/products/collections/winter" },
      { title: "Active Wear", href: "/products/collections/active" },
      { title: "Loungewear", href: "/products/collections/lounge" },
      { title: "Festive Collection", href: "/products/collections/festive" },
      { title: "Premium Collection", href: "/products/collections/premium" },
    ],
    image: "/images/menu/collections.png",
  },
  {
    title: "Accessories",
    items: [
      { title: "Bags & Backpacks", href: "/products/accessories/bags" },
      { title: "Watches", href: "/products/accessories/watches" },
      { title: "Sunglasses", href: "/products/accessories/sunglasses" },
      { title: "Belts", href: "/products/accessories/belts" },
      { title: "Wallets", href: "/products/accessories/wallets" },
      { title: "Jewelry", href: "/products/accessories/jewelry" },
      { title: "Hats & Caps", href: "/products/accessories/hats" },
      { title: "Scarves", href: "/products/accessories/scarves" },
    ],
    image: "/images/menu/accessories.png",
  },
];

const detailedCategories = {
  men: [
    {
      title: "Topwear",
      items: [
        "T-Shirts",
        "Casual Shirts",
        "Formal Shirts",
        "Sweaters",
        "Sweatshirts",
        "Jackets",
      ],
    },
    {
      title: "Bottomwear",
      items: [
        "Jeans",
        "Casual Trousers",
        "Formal Trousers",
        "Shorts",
        "Track Pants",
      ],
    },
    {
      title: "Footwear",
      items: [
        "Casual Shoes",
        "Sports Shoes",
        "Formal Shoes",
        "Sandals",
        "Sneakers",
      ],
    },
    {
      title: "Accessories",
      items: ["Watches", "Belts", "Wallets", "Sunglasses", "Bags", "Caps"],
    },
  ],
  women: [
    {
      title: "Western Wear",
      items: ["Dresses", "Tops", "T-Shirts", "Jeans", "Trousers", "Skirts"],
    },
    {
      title: "Indian Wear",
      items: ["Kurtas", "Sarees", "Lehengas", "Salwar Suits", "Blouses"],
    },
    {
      title: "Footwear",
      items: ["Heels", "Flats", "Sandals", "Sports Shoes", "Boots"],
    },
    {
      title: "Beauty & Accessories",
      items: ["Jewelry", "Handbags", "Watches", "Sunglasses", "Scarves"],
    },
  ],
  kids: [
    {
      title: "Boys (2-16 Years)",
      items: ["T-Shirts", "Shirts", "Jeans", "Shorts", "Jackets", "Sportswear"],
    },
    {
      title: "Girls (2-16 Years)",
      items: ["Dresses", "Tops", "Skirts", "Jeans", "Leggings", "Party Wear"],
    },
    {
      title: "Infants (0-2 Years)",
      items: [
        "Rompers",
        "Bodysuits",
        "Sleepwear",
        "Winter Wear",
        "Accessories",
      ],
    },
    {
      title: "Toys & Accessories",
      items: ["Backpacks", "Shoes", "Hats", "Water Bottles", "Stationery"],
    },
  ],
};

interface CategoryNavigationProps {
  className?: string;
}

export function CategoryNavigation({ className }: CategoryNavigationProps) {
  const router = useRouter();
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {categories.map((category) => {
          const hasDetailedCategories =
            category.title === "Men" ||
            category.title === "Women" ||
            category.title === "Kids";
          return (
            <NavigationMenuItem key={category.title}>
              <NavigationMenuTrigger className="bg-transparent h-9 px-4 py-2">
                {category.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div
                  className={`p-0 ${hasDetailedCategories ? "w-3xl lg:w-6xl" : "w-xl lg:w-3xl"}`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 p-4">
                    {/* Left Side: Combined Categories */}
                    <div className="flex flex-col gap-10">
                      {/* Top Section: Quick Links */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold tracking-tight">
                            {category.title}
                          </h3>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/products/${category.title.toLowerCase()}`,
                              )
                            }
                            className="rounded-full px-4 font-semibold text-primary hover:bg-primary/5 transition-colors"
                          >
                            View All <ChevronRight size="14" className="ml-1" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-x-12 gap-y-3 w-fit pr-10">
                          {category.items.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="group flex items-center gap-3 rounded-md py-1 transition-colors min-w-[130px]"
                            >
                              <div className="h-1 w-1 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
                              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {item.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Section: Detailed Categories (Conditional) */}
                      {hasDetailedCategories && (
                        <div className="space-y-6 pt-6 border-t border-border/40">
                          <h3 className="text-xl font-bold tracking-tight">
                            Shop by Category
                          </h3>
                          <div className="grid grid-cols-4 gap-8 w-fit">
                            {detailedCategories[
                              category.title.toLowerCase() as keyof typeof detailedCategories
                            ]?.map((subcat) => (
                              <div key={subcat.title} className="space-y-4 min-w-[140px]">
                                <h5 className="text-[14px] font-bold text-foreground">
                                  {subcat.title}
                                </h5>
                                <ul className="space-y-2.5">
                                  {subcat.items.map((item) => (
                                    <li key={item}>
                                      <Link
                                        href={`/products/${category.title.toLowerCase()}/${subcat.title.toLowerCase()}/${item.toLowerCase().replace(/ /g, "-")}`}
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Side: Image Banner */}
                    <div className="relative group h-full min-h-[500px] rounded-md overflow-hidden">
                      <Image
                        width={400}
                        height={600}
                        src={category.image}
                        alt={category.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <h4 className="text-white font-bold text-3xl mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          {category.title}
                        </h4>
                        <p className="text-white/80 text-sm mb-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                          Explore our curated {category.title.toLowerCase()} collection.
                        </p>
                        <Link
                          href={`/products/${category.title.toLowerCase()}`}
                          className="w-fit inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-black hover:bg-zinc-100 transition-all transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-500 delay-150 shadow-lg"
                        >
                          Shop Collection
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, router]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key?.toLowerCase?.();
      if ((e.ctrlKey || e.metaKey) && key === "k") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={`flex w-1/3 items-center ${className}`}>
      <InputGroup className="border-transparent shadow-none">
        <InputGroupInput
          ref={inputRef}
          placeholder="Search products..."
          aria-label="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon className="cursor-pointer" onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>+<Kbd>K</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

interface ActionButtonsProps {
  wishlistCount?: number;
  cartCount?: number;
  className?: string;
}

export function ActionButtons({
  wishlistCount = 0,
  cartCount = 0,
  className,
}: ActionButtonsProps) {
  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5 fill-red-400 stroke-red-400" />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Wishlist</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Cart</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          onClick={() => router.push("/login")}
          size="sm"
          variant="outline"
          className="h-8 text-xs font-semibold px-4 border-zinc-200"
        >
          Login
        </Button>
        <Button
          variant="default"
          onClick={() => router.push("/signup")}
          size="sm"
          className="h-8 text-xs font-semibold px-4"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const notifications = session.user?.notifications || [];
  const orderNotifications = getNotificationsByCategory(notifications, "orders");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full ring-offset-background transition-all hover:bg-zinc-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden"
        >
          <AvatarBadge />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 p-1.5 shadow-xl rounded-xl border border-zinc-200"
        align="end"
        sideOffset={8}
      >
        <div className="px-3 py-2 mb-1 border-b border-zinc-100/80">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Welcome</p>
          <p className="text-sm font-bold text-zinc-900 truncate">
            {session.user?.name || "Member"}
          </p>
        </div>

        <div className="space-y-0.5">
          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=orders")}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer focus:bg-zinc-100 focus:text-zinc-900"
          >
            <ShoppingBag size={15} className="text-zinc-500" />
            <span className="text-sm font-medium">Orders</span>
            {orderNotifications.length > 0 && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/wishlist")}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer focus:bg-zinc-100 focus:text-zinc-900"
          >
            <Heart size={15} className="text-zinc-500" />
            <span className="text-sm font-medium">Wishlist</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="mx-2 my-1" />

          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=profile")}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer focus:bg-zinc-100 focus:text-zinc-900"
          >
            <User size={15} className="text-zinc-500" />
            <span className="text-sm font-medium">Personal Details</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=addresses")}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer focus:bg-zinc-100 focus:text-zinc-900"
          >
            <MapPin size={15} className="text-zinc-500" />
            <span className="text-sm font-medium">Saved Addresses</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=billing")}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer focus:bg-zinc-100 focus:text-zinc-900"
          >
            <CreditCard size={15} className="text-zinc-500" />
            <span className="text-sm font-medium">Payment Methods</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="mx-2 my-1" />

          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=security")}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer focus:bg-zinc-100 focus:text-zinc-900"
          >
            <Settings size={15} className="text-zinc-500" />
            <span className="text-sm font-medium">Edit Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            <LogOut size={15} />
            <span className="text-sm font-bold">Log out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
interface MobileMenuProps {
  categories: Array<{
    title: string;
    items: Array<{ title: string; href: string }>;
  }>;
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
          aria-label="menu"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="text-left">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Browse our collections and categories
          </SheetDescription>
        </SheetHeader>

        <nav className="mt-8">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.title} className="space-y-2">
                <h3 className="font-semibold text-lg">{category.title}</h3>
                <div className="grid grid-cols-1 gap-1 pl-4">
                  {category.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
export default function Navbar({ className }: { className?: string }) {
  const cartCount = 3;
  // Read wishlist count from Redux
  const wishlistCount = useAppSelector(
    (s: { wishlist: { items: unknown[] } }) => s.wishlist.items.length,
  );

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-sm shadow-sm ${className}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 py-4">
        {/* Left Section - Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <MobileMenu categories={categories} />

          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/shadeandcorp_log.svg" alt="Shade & Corp" width={100} height={100} className="h-8 md:h-10 w-auto" />
          </Link>
        </div>

        {/* Center Section - Navigation & Search */}
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <CategoryNavigation />
          <SearchBar />
        </nav>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center gap-2">
          <ActionButtons wishlistCount={wishlistCount} cartCount={cartCount} />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
