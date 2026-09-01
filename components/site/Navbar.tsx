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
  CreditCard,
  MapPin,
  ArrowRight,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent } from "../ui/card";
import { Dot } from "../ui/dot";
import { MarqueeText } from "../ui/marquee-text";
import { cn } from "@/lib/utils";

const getCategoryImageUrl = (title: string) => {
  const t = title.toLowerCase();
  // Using picsum.photos with deterministic seeds — always available, no auth needed
  if (
    t.includes("topwear") ||
    t.includes("shirt") ||
    t.includes("top") ||
    t.includes("blouse") ||
    t.includes("sweater") ||
    t.includes("clothing")
  )
    return "https://picsum.photos/seed/clothing/100/100";
  if (
    t.includes("bottomwear") ||
    t.includes("jean") ||
    t.includes("trouser") ||
    t.includes("short") ||
    t.includes("skirt") ||
    t.includes("pant") ||
    t.includes("legging")
  )
    return "https://picsum.photos/seed/jeans/100/100";
  if (
    t.includes("footwear") ||
    t.includes("shoe") ||
    t.includes("boot") ||
    t.includes("sandal") ||
    t.includes("sneaker") ||
    t.includes("heel") ||
    t.includes("flat")
  )
    return "https://picsum.photos/seed/shoes/100/100";
  if (
    t.includes("accessor") ||
    t.includes("cap") ||
    t.includes("hat") ||
    t.includes("scarf")
  )
    return "https://picsum.photos/seed/accessories/100/100";
  if (t.includes("active") || t.includes("activewear") || t.includes("sport"))
    return "https://picsum.photos/seed/activewear/100/100";
  if (
    t.includes("ethnic") ||
    t.includes("indian") ||
    t.includes("kurta") ||
    t.includes("saree") ||
    t.includes("festive") ||
    t.includes("party") ||
    t.includes("lehenga")
  )
    return "https://picsum.photos/seed/festive/100/100";
  if (t.includes("dress") || t.includes("jumpsuit"))
    return "https://picsum.photos/seed/dress/100/100";
  if (
    t.includes("inner") ||
    t.includes("lounge") ||
    t.includes("lingerie") ||
    t.includes("sleep")
  )
    return "https://picsum.photos/seed/lounge/100/100";
  if (
    t.includes("winter") ||
    t.includes("snow") ||
    t.includes("jacket") ||
    t.includes("coat")
  )
    return "https://picsum.photos/seed/winter/100/100";
  if (t.includes("watch")) return "https://picsum.photos/seed/watch/100/100";
  if (
    t.includes("bag") ||
    t.includes("wallet") ||
    t.includes("backpack") ||
    t.includes("handbag")
  )
    return "https://picsum.photos/seed/bags/100/100";
  if (t.includes("glass") || t.includes("sunglass"))
    return "https://picsum.photos/seed/sunglasses/100/100";
  if (t.includes("belt")) return "https://picsum.photos/seed/belts/100/100";
  if (t.includes("jewel") || t.includes("premium"))
    return "https://picsum.photos/seed/jewelry/100/100";
  if (t.includes("boys")) return "https://picsum.photos/seed/boys/100/100";
  if (t.includes("girls")) return "https://picsum.photos/seed/girls/100/100";
  if (t.includes("kids") || t.includes("child"))
    return "https://picsum.photos/seed/kids/100/100";
  if (t.includes("baby") || t.includes("infant") || t.includes("toddler"))
    return "https://picsum.photos/seed/baby/100/100";
  if (t.includes("uniform") || t.includes("school"))
    return "https://picsum.photos/seed/school/100/100";
  if (t.includes("summer") || t.includes("sun"))
    return "https://picsum.photos/seed/summer/100/100";
  if (t.includes("suit") || t.includes("blazer") || t.includes("tailor"))
    return "https://picsum.photos/seed/suit/100/100";
  // Deterministic fallback based on first char of title for variety
  const seed = encodeURIComponent(
    t.replace(/\s+/g, "-").slice(0, 12) || "fashion",
  );
  return `https://picsum.photos/seed/${seed}/100/100`;
};

interface CategoryItem {
  title: string;
  href: string;
  image?: string;
}

interface Category {
  title: string;
  items: CategoryItem[];
  image?: string;
}

const categories: Category[] = [
  {
    title: "Men",
    items: [
      { title: "Topwear", href: "/products/men/topwear" },
      { title: "Bottomwear", href: "/products/men/bottomwear" },
      { title: "Footwear", href: "/products/men/footwear" },
      { title: "Accessories", href: "/products/men/accessories" },
      { title: "Activewear", href: "/products/men/activewear" },
      { title: "Ethnic Wear", href: "/products/men/ethnic-wear" },
      { title: "Innerwear & Loungewear", href: "/products/men/innerwear" },
      { title: "Winterwear", href: "/products/men/winterwear" },
      { title: "Suits & Tailoring", href: "/products/men/suits" },
    ],
    image: "https://picsum.photos/seed/men/800/800",
  },
  {
    title: "Women",
    items: [
      { title: "Topwear", href: "/products/women/topwear" },
      { title: "Bottomwear", href: "/products/women/bottomwear" },
      { title: "Indian & Ethnic Wear", href: "/products/women/ethnic-wear" },
      { title: "Footwear", href: "/products/women/footwear" },
      { title: "Accessories & Bags", href: "/products/women/accessories" },
      { title: "Dresses & Jumpsuits", href: "/products/women/dresses" },
      { title: "Activewear & Loungewear", href: "/products/women/activewear" },
      { title: "Lingerie & Sleepwear", href: "/products/women/lingerie" },
      { title: "Winterwear", href: "/products/women/winterwear" },
    ],
    image: "https://picsum.photos/seed/women/800/800",
  },
  {
    title: "Kids",
    items: [
      { title: "Boys Clothing", href: "/products/kids/boys" },
      { title: "Girls Clothing", href: "/products/kids/girls" },
      { title: "Infants (0-2 Yrs)", href: "/products/kids/infants" },
      { title: "Footwear", href: "/products/kids/footwear" },
      { title: "Toys & Accessories", href: "/products/kids/accessories" },
      { title: "School Uniforms", href: "/products/kids/uniforms" },
      { title: "Party Wear", href: "/products/kids/party-wear" },
      { title: "Winter Wear", href: "/products/kids/winter-wear" },
    ],
    image: "https://picsum.photos/seed/kids/800/800",
  },
  {
    title: "Collections",
    items: [
      { title: "Summer Collection", href: "/products/collections/summer" },
      { title: "Winter Essentials", href: "/products/collections/winter" },
      { title: "Activewear", href: "/products/collections/activewear" },
      { title: "Loungewear", href: "/products/collections/loungewear" },
      { title: "Festive Collection", href: "/products/collections/festive" },
      { title: "Runway Edition", href: "/products/collections/runway" },
    ],
    image: "https://picsum.photos/seed/collections/800/800",
  },
  {
    title: "Accessories",
    items: [
      { title: "Watches", href: "/products/accessories/watches" },
      { title: "Bags & Backpacks", href: "/products/accessories/bags" },
      { title: "Sunglasses", href: "/products/accessories/sunglasses" },
      { title: "Belts & Wallets", href: "/products/accessories/belts" },
      { title: "Jewelry", href: "/products/accessories/jewelry" },
      { title: "Hats, Caps & Scarves", href: "/products/accessories/hats" },
    ],
    image: "https://picsum.photos/seed/accessories/800/800",
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
      title: "Topwear",
      items: ["T-Shirts", "Tops", "Blouses", "Shirts", "Sweaters", "Jackets"],
    },
    {
      title: "Bottomwear",
      items: ["Jeans", "Trousers", "Skirts", "Leggings", "Shorts", "Jumpsuits"],
    },
    {
      title: "Indian & Ethnic Wear",
      items: [
        "Kurtas & Kurtis",
        "Sarees",
        "Lehengas",
        "Salwar Suits",
        "Dupattas",
      ],
    },
    {
      title: "Footwear & Accessories",
      items: ["Heels", "Flats", "Sneakers", "Handbags", "Jewelry", "Watches"],
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
      title: "Footwear & Accessories",
      items: ["Shoes", "Sandals", "Backpacks", "Hats & Caps", "Stationery"],
    },
  ],
};

// Image component with graceful error fallback
function CategoryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10 text-[8px] text-muted-foreground font-medium text-center px-1 leading-tight ${className}`}
      >
        {alt.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      onError={() => setErrored(true)}
    />
  );
}

interface CategoryNavigationProps {
  className?: string;
}

export function CategoryNavigation({ className }: CategoryNavigationProps) {
  const router = useRouter();
  const [featuredBadgeText, setFeaturedBadgeText] = useState(
    "Featured Collection",
  );

  useEffect(() => {
    fetch("/api/settings?key=featuredBadgeText")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFeaturedBadgeText(data.data);
        }
      })
      .catch((err) => console.error("Error fetching setting:", err));
  }, []);

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
              <NavigationMenuTrigger>{category.title}</NavigationMenuTrigger>
              <NavigationMenuContent className="p-0">
                <div className="overflow-hidden min-w-5xl w-fit">
                  <div className="grid lg:grid-cols-3">
                    {/* Left Content */}
                    <div className="p-4 lg:p-6 flex flex-col col-span-2 gap-4 space-4">
                      <Badge variant="secondary">{featuredBadgeText}</Badge>
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold tracking-tight">
                            {category.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Discover our curated selection of premium products.
                          </p>
                        </div>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/products/${category.title.toLowerCase()}`,
                            )
                          }
                        >
                          View All
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>

                      {/* Featured Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                        {category.items
                          .slice(0, 6)
                          .map((item: CategoryItem) => (
                            <Link key={item.title} href={item.href}>
                              <Card className="group h-full bg-muted ring-0">
                                <CardContent>
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      {/* Image Placeholder */}
                                      <div className="h-10 w-10 shrink-0 rounded-md bg-muted overflow-hidden relative">
                                        <CategoryImage
                                          src={
                                            item.image ||
                                            getCategoryImageUrl(item.title)
                                          }
                                          alt={item.title}
                                        />
                                      </div>
                                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                                        {item.title}
                                      </h4>
                                    </div>

                                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                      </div>

                      {hasDetailedCategories && (
                        <>
                          <div>
                            <div className="mb-4 flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="uppercase tracking-wider"
                              >
                                Shop by category
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 items-start">
                              {detailedCategories[
                                category.title.toLowerCase() as keyof typeof detailedCategories
                              ]?.map((subcat) => (
                                <div key={subcat.title} className="min-w-0 flex flex-col justify-start">
                                  <div className="h-6 mb-3 min-w-0 flex items-center">
                                    <MarqueeText
                                      text={subcat.title}
                                      textClassName="text-sm font-semibold text-foreground tracking-tight"
                                    />
                                  </div>

                                  <CardContent className="pt-0 p-0">
                                    <div className="space-y-2">
                                      {subcat.items.slice(0, 5).map((item) => (
                                        <Link
                                          key={item}
                                          href={`/products/${category.title.toLowerCase()}/${subcat.title.toLowerCase()}/${item
                                            .toLowerCase()
                                            .replace(/ /g, "-")}`}
                                          className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors min-w-0"
                                        >
                                          <Dot className="opacity-20 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 shrink-0" />
                                          <span className="truncate">
                                            {item}
                                          </span>
                                        </Link>
                                      ))}
                                    </div>
                                  </CardContent>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Promo Banner */}
                    <div className="relative border-l border-border/50">
                      <div className="relative h-full min-h-[500px] overflow-hidden">
                        <CategoryImage
                          src={
                            category.image ||
                            getCategoryImageUrl(category.title)
                          }
                          alt={category.title}
                          className="transition-transform duration-700 hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <Badge className="mb-3 w-fit">New Arrivals</Badge>

                          <h3 className="text-3xl font-bold text-white leading-tight">
                            {category.title}
                            <br />
                            Collection
                          </h3>

                          <p className="mt-3 text-sm text-white/80">
                            Premium quality products crafted for modern
                            lifestyles.
                          </p>

                          <div className="mt-6 flex gap-2">
                            <Button asChild size="sm" className="group">
                              <Link
                                href={`/products/${category.title.toLowerCase()}`}
                              >
                                Shop Collection
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </Link>
                            </Button>

                            <Button asChild variant="secondary" size="sm">
                              <Link
                                href={`/products/${category.title.toLowerCase()}`}
                              >
                                Explore
                              </Link>
                            </Button>
                          </div>

                          <div className="mt-8 grid grid-cols-3 gap-3">
                            <Card className="bg-white/10 backdrop-blur-md border-white/20">
                              <CardContent className="p-3">
                                <p className="text-lg font-bold text-white">
                                  500+
                                </p>
                                <p className="text-tiny text-white/70">
                                  Products
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="bg-white/10 backdrop-blur-md border-white/20">
                              <CardContent className="p-3">
                                <p className="text-lg font-bold text-white">
                                  4.8★
                                </p>
                                <p className="text-tiny text-white/70">
                                  Rating
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="bg-white/10 backdrop-blur-md border-white/20">
                              <CardContent className="p-3">
                                <p className="text-lg font-bold text-white">
                                  24h
                                </p>
                                <p className="text-tiny text-white/70">
                                  Dispatch
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
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
    <div className={`flex max-w-2xs w-full items-center ${className}`}>
      <InputGroup>
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
              <Button
                variant="outline"
                size="icon"
                className="relative"
                aria-label={`Wishlist (${wishlistCount})`}
              >
                <Heart
                  className="h-5 w-5 text-red-500 fill-red-500/20 hover:fill-red-500 transition-all ease-in-out"
                  aria-hidden="true"
                />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    size="xs"
                    className="absolute -top-2 -right-2 rounded-full px-1"
                    aria-hidden="true"
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
              <Button
                variant="outline"
                size="icon"
                className="relative"
                aria-label="User menu"
              >
                <ShoppingBag
                  className="h-5 w-5 text-foreground"
                  aria-hidden="true"
                />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    size="xs"
                    className="absolute -top-2 -right-2 rounded-full px-1"
                    aria-hidden="true"
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!session) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          onClick={() => router.push("/login")}
          size="sm"
          variant="outline"
        >
          Login
        </Button>
        <Button
          variant="default"
          onClick={() => router.push("/signup")}
          size="sm"
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
  const orderNotifications = getNotificationsByCategory(
    notifications,
    "orders",
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={`User Menu`}>
          <AvatarBadge />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col select-none">
            <span>{session.user?.name || "Member"}</span>
            <span className="text-xs text-muted-foreground">
              {session.user?.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=orders")}
          >
            <ShoppingBag />
            <span>Orders</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleNavigation("/wishlist")}>
            <Heart />
            <span>Wishlist</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=profile")}
          >
            <User />
            <span>Personal Details</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=addresses")}
          >
            <MapPin />
            <span>Saved Addresses</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=billing")}
          >
            <CreditCard />
            <span>Payment Methods</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleNavigation("/profile?tab=security")}
          >
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center justify-between cursor-default"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-2">
              {mounted && theme === "dark" ? (
                <Moon />
              ) : mounted && theme === "light" ? (
                <Sun />
              ) : (
                <Monitor />
              )}
              <span>Theme</span>
            </div>
            <ToggleGroup
              type="single"
              size="sm"
              variant="outline"
              spacing={0}
              value={mounted && theme ? theme : "system"}
              onValueChange={(val) => {
                if (val) setTheme(val);
              }}
            >
              <ToggleGroupItem
                value="light"
                aria-label="Light theme"
                title="Light"
              >
                <Sun className="size-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="dark"
                aria-label="Dark theme"
                title="Dark"
              >
                <Moon className="size-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="system"
                aria-label="System theme"
                title="System"
              >
                <Monitor className="size-3.5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOut />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
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
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b bg-background border-border py-4",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-0">
        {/* Left Section - Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <MobileMenu categories={categories} />

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/shadeandcorp_log.svg"
              alt="Shade & Corp"
              width={100}
              height={100}
              className="h-8 md:h-10 w-auto"
            />
          </Link>
        </div>

        {/* Center Section - Navigation & Search */}
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <CategoryNavigation />
        </nav>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center gap-2">
          <SearchBar />
          <ActionButtons wishlistCount={wishlistCount} cartCount={cartCount} />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
