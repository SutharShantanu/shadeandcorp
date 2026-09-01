"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Frame, FrameHeader, FramePanel } from "@/components/ui/frame";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert";
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
  Phone,
  Mail,
  Gift,
  ShieldAlert,
  History,
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

import ProfileDisplayTab from "@/components/profile/view/ProfileDisplayTab";
import AccountDisplayTab from "@/components/profile/view/AccountDisplayTab";
import BillingTab from "@/components/profile/edit/BillingTab";
import NotificationsTab from "@/components/profile/edit/NotificationsTab";
import OrdersTab from "@/components/profile/view/OrdersTab";
import AddressesTab from "@/components/profile/edit/AddressesTab";
import SecurityTab from "@/components/profile/edit/SecurityTab";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Dot } from "@/components/ui/dot";
import { cn } from "@/lib/utils";

import { VALID_TABS, PROFILE_TABS } from "@/components/profile/shared/profile-tabs";

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
  const activeTab =
    tabFromUrl && VALID_TABS.includes(tabFromUrl as (typeof VALID_TABS)[number])
      ? tabFromUrl
      : actionFromUrl === "add"
        ? "addresses"
        : "profile";
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldOpenModal, setShouldOpenModal] = useState(
    actionFromUrl === "add",
  );

  // Check for missing profile information
  const missingInfo = useMemo(() => {
    const missing = [];
    if (!userProfile?.addresses || userProfile.addresses.length === 0) {
      missing.push({
        label: "shipping address",
        tab: "addresses",
        icon: MapPin,
      });
    }
    if (
      !userProfile?.paymentMethods ||
      userProfile.paymentMethods.length === 0
    ) {
      missing.push({
        label: "payment method",
        tab: "billing",
        icon: CreditCard,
      });
    }
    if (!userProfile?.phone) {
      missing.push({ label: "phone number", tab: "account", icon: Phone });
    } else if (!userProfile?.isPhoneVerified) {
      missing.push({
        label: "phone verification",
        tab: "account",
        icon: ShieldAlert,
      });
    }
    if (!userProfile?.isEmailVerified) {
      missing.push({ label: "email verification", tab: "account", icon: Mail });
    }
    if (!userProfile?.birthday) {
      missing.push({ label: "birthday", tab: "account", icon: Gift });
    }
    return missing;
  }, [userProfile]);

  const hasMissingInfo = (tabName: string) =>
    missingInfo.some((info) => info.tab === tabName);

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

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const newUrl = `/profile?tab=${value}`;
    router.replace(newUrl, { scroll: false });
  };

  // Redirect to login if unauthenticated (using useEffect to avoid render-time navigation)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
        <Frame>
          {missingInfo.length > 0 && (
            <FrameHeader>
              <Alert variant="warning">
                <Info />
                <AlertTitle className="flex items-center justify-between gap-2">
                  Complete your profile
                  <Badge variant="warning-outline">
                    {Math.round(((5 - missingInfo.length) / 5) * 100)}%
                    Completed
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  <div className="space-y-4 mt-2">
                    <p>
                      You&apos;re missing {missingInfo.length}{" "}
                      {missingInfo.length === 1 ? "item" : "items"}. Adding them
                      helps secure your account and improve your experience.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {missingInfo.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Badge
                            key={index}
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/edit-profile?tab=${item.tab}&action=add`,
                              )
                            }
                            className="cursor-pointer capitalize flex items-start gap-1"
                          >
                            <Icon className="h-3 w-3" />
                            Add {item.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </FrameHeader>
          )}

          <FramePanel>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold">Profile</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-muted-foreground">
                  <p>Manage your account settings and preferences.</p>
                  {lastUpdated && (
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <History className="size-3 text-muted-foreground" />
                      <span>Updated {lastUpdated}</span>
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
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
                >
                  <PencilLine className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              </div>
            </div>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              orientation="vertical"
              className="flex flex-col md:flex-row w-full border rounded-xl overflow-hidden"
            >
              <div className="w-full md:w-64 ">
                <div className="sticky top-0 h-full">
                  <TabsList className="flex flex-col p-4 justify-normal h-full! w-full gap-1 items-start">
                    {PROFILE_TABS.map((group, index) => (
                      <div key={group.heading} className="w-full">
                        <div
                          className={cn(
                            "px-3 py-1.5 text-tiny font-bold text-muted-foreground uppercase tracking-wider mb-1",
                            index > 0 && "mt-2",
                          )}
                        >
                          {group.heading}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <TabsTrigger key={item.value} value={item.value}>
                                <Icon className="size-4 shrink-0" />
                                <span className="flex-1 text-left">
                                  {item.label}
                                </span>
                                {hasMissingInfo(item.value) && (
                                  <Dot variant="warning" />
                                )}
                              </TabsTrigger>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </TabsList>
                </div>
              </div>

              <div className="flex-1 p-4 md:p-6">
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
              </div>
            </Tabs>
          </FramePanel>
        </Frame>

        {/* Search Command Dialog */}
        <CommandDialog
          open={searchOpen}
          onOpenChange={setSearchOpen}
          className="max-w-4xl sm:max-w-4xl"
        >
          <CommandInput
            placeholder="Search settings..."
            value={searchQuery}
            onValueChange={setSearchQuery}
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
