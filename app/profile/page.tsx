"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertClose, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Package,
  MapPin,
  Search,
  Lock,
  PencilLine,
  Info,
  X,
  Palette,
  UserCircle,
  Link2,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import Loading from "@/components/ui/loading";
import { useProfile } from "@/app/(auth)/hook/useProfile";

import ProfileDisplayTab from "@/components/profile/ProfileDisplayTab";
import AccountDisplayTab from "@/components/profile/AccountDisplayTab";
import BillingTab from "@/components/profile/BillingTab";
import NotificationsTab from "@/components/profile/NotificationsTab";
import OrdersTab from "@/components/profile/OrdersTab";
import AddressesTab from "@/components/profile/AddressesTab";
import SecurityTab from "@/components/profile/SecurityTab";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

const VALID_TABS = [
  "profile",
  "account",
  "security",
  "orders",
  "addresses",
  "billing",
  "notifications",
] as const;

const SEARCH_ITEMS = [
  {
    tab: "profile",
    keywords: ["name", "bio", "picture", "avatar", "personal", "info"],
    label: "Profile Information",
    icon: UserCircle,
    category: "Account",
    description: "Update your name, bio, and profile picture",
  },
  {
    tab: "account",
    keywords: ["phone", "email", "gender", "birthday", "contact"],
    label: "Account Details",
    icon: Shield,
    category: "Account",
    description: "Manage email, phone, and personal details",
  },
  {
    tab: "security",
    keywords: ["password", "login", "sessions", "security", "delete", "remove"],
    label: "Security & Password",
    icon: Lock,
    category: "Security",
    description: "Change password and manage active sessions",
  },
  {
    tab: "security",
    keywords: ["connected", "oauth", "google", "revoke", "disconnect"],
    label: "Connected Accounts",
    icon: Link2,
    category: "Security",
    description: "Manage third-party account connections",
  },
  {
    tab: "orders",
    keywords: ["orders", "purchases", "history", "buy"],
    label: "Order History",
    icon: Package,
    category: "Shopping",
    description: "View and track your orders",
  },
  {
    tab: "addresses",
    keywords: ["address", "shipping", "delivery", "location"],
    label: "Shipping Addresses",
    icon: MapPin,
    category: "Shopping",
    description: "Manage delivery addresses",
  },
  {
    tab: "billing",
    keywords: ["payment", "card", "billing", "method"],
    label: "Payment Methods",
    icon: CreditCard,
    category: "Shopping",
    description: "Add or remove payment methods",
  },
  {
    tab: "notifications",
    keywords: ["notifications", "alerts", "email", "preferences"],
    label: "Notification Settings",
    icon: Bell,
    category: "Preferences",
    description: "Configure email and push notifications",
  },
  {
    tab: "notifications",
    keywords: ["appearance", "theme", "display", "dark", "light"],
    label: "Appearance & Theme",
    icon: Palette,
    category: "Preferences",
    description: "Customize theme and display settings",
  },
] as const;

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { fetching, userProfile } = useProfile();

  // Get tab from URL query parameter, default to "profile"
  const tabFromUrl = searchParams.get("tab");
  const actionFromUrl = searchParams.get("action");
  const initialTab =
    tabFromUrl && VALID_TABS.includes(tabFromUrl as (typeof VALID_TABS)[number])
      ? tabFromUrl
      : actionFromUrl === "add"
        ? "addresses"
        : "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(
    actionFromUrl === "add",
  );

  // Check for missing profile information
  const missingInfo = useMemo(() => {
    const missing = [];
    if (!userProfile?.addresses || userProfile.addresses.length === 0) {
      missing.push({ label: "shipping address", tab: "addresses" });
    }
    if (
      !userProfile?.paymentMethods ||
      userProfile.paymentMethods.length === 0
    ) {
      missing.push({ label: "payment method", tab: "billing" });
    }
    if (!userProfile?.phone) {
      missing.push({ label: "phone number", tab: "account" });
    } else if (!userProfile?.isPhoneVerified) {
      missing.push({ label: "phone verification", tab: "account" });
    }
    if (!userProfile?.isEmailVerified) {
      missing.push({ label: "email verification", tab: "account" });
    }
    if (!userProfile?.birthday) {
      missing.push({ label: "birthday", tab: "account" });
    }
    return missing;
  }, [userProfile]);

  // Search functionality with smart filtering
  const filteredSearchItems = useMemo(() => {
    if (!searchQuery.trim()) return SEARCH_ITEMS;

    const query = searchQuery.toLowerCase();
    return SEARCH_ITEMS.filter((item) => {
      return (
        item.label.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.keywords.some((keyword) => keyword.includes(query))
      );
    });
  }, [searchQuery]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, Array<(typeof SEARCH_ITEMS)[number]>> = {};
    filteredSearchItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredSearchItems]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Sync activeTab with URL parameters
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (
      currentTab &&
      VALID_TABS.includes(currentTab as (typeof VALID_TABS)[number])
    ) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  // Update URL when tab changes (state updates via useEffect)
  const handleTabChange = (value: string) => {
    const newUrl = `/profile?tab=${value}`;
    router.replace(newUrl, { scroll: false });
  };

  // Redirect to login if unauthenticated (using useEffect to avoid render-time navigation)
  useEffect(() => {
    if (status === "unauthenticated" || !session) {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading" || fetching) {
    return <Loading />;
  }

  if (status === "unauthenticated" || !session) {
    return null;
  }

  const formatLastUpdated = () => {
    if (!userProfile?.updatedAt) return null;
    try {
      const date = new Date(userProfile.updatedAt);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 30) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  const lastUpdated = formatLastUpdated();

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center gap-2 font-normal"
              >
                <Search className="h-4 w-4" />
                Search settings
                <KbdGroup className="ml-2">
                  <Kbd>Ctrl</Kbd>+<Kbd>K</Kbd>
                </KbdGroup>
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/edit-profile?tab=${activeTab}`)}
                className=""
              >
                <PencilLine className="size-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
            {lastUpdated && (
              <Badge variant="secondary" className="text-xs justify-self-end">
                Last updated: {lastUpdated}
              </Badge>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            {missingInfo.length > 0 && !alertDismissed && (
              <Alert variant="secondary" color="warning">
                <Info className="h-4 w-4" />

                <AlertDescription className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="font-medium">Complete your profile</p>

                    <p className="text-xs mb-2">
                      You&apos;re missing the following information:
                    </p>

                    <ul className="list-disc list-inside space-y-0.5">
                      {missingInfo.map((item, index) => (
                        <li key={index}>
                          <button
                            onClick={() =>
                              router.push(
                                `/edit-profile?tab=${item.tab}&action=add`,
                              )
                            }
                            className="hover:underline capitalize inline cursor-pointer"
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
                <AlertClose onClick={() => setAlertDismissed(true)} />
              </Alert>
            )}
          </CardHeader>
          <CardContent className="">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
              layout="vertical"
            >
              <TabsList className="relative z-10">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2"
                >
                  <User className="size-4" />
                  <span className="hidden lg:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="flex items-center gap-2"
                >
                  <Shield className="size-4" />
                  <span className="hidden lg:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-2"
                >
                  <Lock className="size-4" />
                  <span className="hidden lg:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="size-4" />
                  <span className="hidden lg:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger
                  value="addresses"
                  className="flex items-center gap-2"
                >
                  <MapPin className="size-4" />
                  <span className="hidden lg:inline">Addresses</span>
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="flex items-center gap-2"
                >
                  <CreditCard className="size-4" />
                  <span className="hidden lg:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex items-center gap-2"
                >
                  <Bell className="size-4" />
                  <span className="hidden lg:inline">Preferences</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <ProfileDisplayTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="account">
                <AccountDisplayTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="security">
                <SecurityTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="orders">
                <OrdersTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="addresses">
                <AddressesTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="billing">
                <BillingTab userProfile={userProfile} />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationsTab userProfile={userProfile} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Search Command Dialog */}
        <CommandDialog
          open={searchOpen}
          onOpenChange={setSearchOpen}
          className="max-w-2xl"
        >
          <CommandInput
            placeholder="Search settings..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            onClose={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          />
          <CommandList className="max-h-[90svh]">
            <CommandEmpty>
              <div className="py-6 text-center">
                <Search className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm font-medium">No results found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try searching for profile, security, orders, or billing
                </p>
              </div>
            </CommandEmpty>

            {!searchQuery && (
              <CommandGroup heading="Suggestions">
                <CommandItem
                  className="elipse "
                  onSelect={() => {
                    setActiveTab("profile");
                    handleTabChange("profile");
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    router.push(`/edit-profile?tab=${activeTab}`);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <PencilLine className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                  <CommandShortcut>⌘E</CommandShortcut>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setActiveTab("security");
                    handleTabChange("security");
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Security Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            )}

            {!searchQuery && <CommandSeparator />}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 p-2">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  <CommandGroup heading={category} className="p-0!">
                    {items.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <CommandItem
                          key={`${category}-${index}`}
                          onSelect={() => {
                            setActiveTab(item.tab);
                            handleTabChange(item.tab);
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-start gap-2 border mb-2 px-3!"
                        >
                          <Icon className="mr-2 h-4 w-4 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.description}
                            </div>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </div>
              ))}
            </div>
          </CommandList>
        </CommandDialog>
      </motion.div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileContent />
    </Suspense>
  );
}
