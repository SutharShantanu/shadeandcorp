"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format, isToday, isYesterday, differenceInDays, differenceInMonths } from "date-fns";
import { 
  ArrowLeft, 
  Search, 
  LogOut, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Monitor,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Frame, FrameHeader, FramePanel } from "@/components/ui/frame";
import { Filters, Filter, FilterFieldConfig } from "@/components/ui/filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Loading from "@/components/ui/loading";
import { useProfile } from "@/app/(auth)/hook/useProfile";
import { cn } from "@/lib/utils";

// Interface for Session
interface Session {
  ipAddress?: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  org?: string;
  latitude?: number;
  longitude?: number;
  deviceInfo?: string;
  loggedInAt?: string | Date;
  isCurrent?: boolean;
  originalIndex?: number;
}

const parseDeviceInfo = (deviceInfoStr: string) => {
  try {
    return JSON.parse(deviceInfoStr);
  } catch {
    return { browser: "Unknown", os: "Unknown", device: "Unknown" };
  }
};

const getDeviceIcon = (deviceInfo: string) => {
  const info = deviceInfo.toLowerCase();
  if (info.includes("mobile") || info.includes("android") || info.includes("iphone")) {
    return Smartphone;
  } else if (info.includes("tablet") || info.includes("ipad")) {
    return Tablet;
  } else if (info.includes("laptop")) {
    return Laptop;
  }
  return Monitor;
};

export default function SessionsPage() {
  const router = useRouter();
  const { data: sessionAuth, status } = useSession();
  const { userProfile, deleteSession, deleteAllOtherSessions, fetching, loading } = useProfile();

  const [sessionSearch, setSessionSearch] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);
  const [logoutAllConfirmOpen, setLogoutAllConfirmOpen] = useState(false);

  const filterFields = useMemo<FilterFieldConfig[]>(() => [
    {
      key: "location",
      label: "Location",
      type: "text",
    },
    {
      key: "ipAddress",
      label: "IP Address",
      type: "text",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "current", label: "Current Device" },
        { value: "other", label: "Other Devices" },
      ]
    },
    {
      key: "device",
      label: "Device Type",
      type: "multiselect",
      options: [
        { value: "mobile", label: "Mobile" },
        { value: "tablet", label: "Tablet" },
        { value: "desktop", label: "Desktop" },
      ]
    }
  ], []);

  const parseDate = useCallback((date: string | Date | undefined) => {
    if (!date) return new Date();
    try {
      return new Date(date);
    } catch {
      return new Date();
    }
  }, []);

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Not available";
    try {
      return format(new Date(dateString), "MMM d, yyyy • p");
    } catch {
      return "Invalid date";
    }
  };

  const sortedSessions = useMemo(() => {
    if (!userProfile?.sessions) return [];
    return [...userProfile.sessions]
      .map((s, index) => ({
        ...s,
        isCurrent: index === userProfile.sessions!.length - 1,
        originalIndex: index,
      }))
      .sort((a, b) => {
        if (a.isCurrent) return -1;
        if (b.isCurrent) return 1;
        const dateA = parseDate(a.loggedInAt);
        const dateB = parseDate(b.loggedInAt);
        return dateB.getTime() - dateA.getTime();
      });
  }, [userProfile, parseDate]);

  const groupedSessions = useMemo(() => {
    const groups: { title: string; sessions: Session[] }[] = [];
    const groupMap: Record<string, Session[]> = {};
    const groupOrder = [
      "Today",
      "Yesterday",
      "This Week",
      "Last Week",
      "This Month",
      "Last Month",
      "3 Months Ago",
      "6 Months Ago",
      "Older",
    ];

    const filtered = sortedSessions.filter((s) => {
      const searchLower = sessionSearch.toLowerCase();
      const matchesSearch =
        !sessionSearch ||
        (s.city || "").toLowerCase().includes(searchLower) ||
        (s.country || "").toLowerCase().includes(searchLower) ||
        (s.ipAddress || "").toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      for (const filter of filters) {
        if (!filter.values || filter.values.length === 0) continue;
        
        if (filter.field === "location") {
          const loc = [s.city, s.country].filter(Boolean).join(", ").toLowerCase();
          const val = String(filter.values[0]).toLowerCase();
          if (filter.operator === "contains" && !loc.includes(val)) return false;
          if (filter.operator === "not_contains" && loc.includes(val)) return false;
          if (filter.operator === "is" && loc !== val) return false;
        }
        
        if (filter.field === "ipAddress") {
          const ip = (s.ipAddress || "").toLowerCase();
          const val = String(filter.values[0]).toLowerCase();
          if (filter.operator === "contains" && !ip.includes(val)) return false;
          if (filter.operator === "not_contains" && ip.includes(val)) return false;
          if (filter.operator === "is" && ip !== val) return false;
        }

        if (filter.field === "status") {
          const isCurrent = !!s.isCurrent;
          const statusVal = filter.values[0] === "current";
          if (filter.operator === "is" && isCurrent !== statusVal) return false;
          if (filter.operator === "is_not" && isCurrent === statusVal) return false;
        }

        if (filter.field === "device") {
          const deviceInfo = s.deviceInfo || "";
          let type = "desktop";
          const infoLower = deviceInfo.toLowerCase();
          if (infoLower.includes("mobile") || infoLower.includes("android") || infoLower.includes("iphone")) {
            type = "mobile";
          } else if (infoLower.includes("tablet") || infoLower.includes("ipad")) {
            type = "tablet";
          } else if (infoLower.includes("laptop") || infoLower.includes("mac") || infoLower.includes("windows")) {
            type = "desktop";
          }
          
          if (filter.operator === "is_any_of" && !filter.values.includes(type)) return false;
          if (filter.operator === "is_not_any_of" && filter.values.includes(type)) return false;
        }
      }

      return true;
    });

    filtered.forEach((s) => {
      const date = parseDate(s.loggedInAt);
      let group = "Older";

      if (isToday(date)) group = "Today";
      else if (isYesterday(date)) group = "Yesterday";
      else if (differenceInDays(new Date(), date) < 7) group = "This Week";
      else if (differenceInDays(new Date(), date) < 14) group = "Last Week";
      else if (differenceInMonths(new Date(), date) < 1) group = "This Month";
      else if (differenceInMonths(new Date(), date) < 2) group = "Last Month";
      else if (differenceInMonths(new Date(), date) < 3) group = "3 Months Ago";
      else if (differenceInMonths(new Date(), date) < 6) group = "6 Months Ago";

      if (!groupMap[group]) groupMap[group] = [];
      groupMap[group].push(s);
    });

    groupOrder.forEach((key) => {
      if (groupMap[key]) {
        groups.push({ title: key, sessions: groupMap[key] });
      }
    });

    return { groups, totalCount: filtered.length };
  }, [sortedSessions, sessionSearch, filters, parseDate]);

  if (status === "loading" || fetching) {
    return <Loading />;
  }

  if (status === "unauthenticated" || !sessionAuth) {
    router.push("/login");
    return null;
  }

  const handleLogoutAllSessions = async () => {
    if (deleteAllOtherSessions) {
      const result = await deleteAllOtherSessions();
      if (result.success) {
        toast.success(result.message || "All other sessions logged out successfully");
      } else {
        toast.error(result.error || "Failed to log out all other sessions");
      }
    } else {
      toast.success("All other sessions logged out successfully");
    }
    setLogoutAllConfirmOpen(false);
  };

  const handleLogoutSession = async (sessionIndex: number) => {
    if (deleteSession) {
      const result = await deleteSession(sessionIndex);
      if (result.success) {
        toast.success(result.message || "Session logged out successfully");
      } else {
        toast.error(result.error || "Failed to log out session");
      }
    } else {
      toast.success("Session logged out successfully");
    }
    setDeleteSessionId(null);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              Active Sessions
            </h1>
            <p className="text-muted-foreground">
              Manage devices currently logged into your account.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/edit-profile?tab=security`)}
          >
            <ArrowLeft className="size-4 mr-1.5" />
            Back to Security
          </Button>
        </div>

        <Frame className="w-full shadow-sm ring-1 ring-border/50" spacing="default">
          <FrameHeader className="border-b bg-muted/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by city, country, or IP..."
                  className="pl-9 bg-background shadow-sm"
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                />
              </div>
              
              <Button
                variant="destructive"
                className="w-full md:w-auto shrink-0 group shadow-sm"
                onClick={() => setLogoutAllConfirmOpen(true)}
                disabled={sortedSessions.length <= 1}
              >
                <LogOut className="h-4 w-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
                Sign out of all other devices
              </Button>
            </div>
            
            <div className="mt-4">
              <Filters 
                fields={filterFields} 
                filters={filters} 
                onChange={setFilters} 
                enableShortcut 
              />
            </div>
          </FrameHeader>

          <FramePanel className="bg-background">
            <div className="">
              {groupedSessions.groups.length > 0 ? (
                <div className="space-y-10">
                  {groupedSessions.groups.map((group) => (
                    <div key={group.title} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <h5 className="text-sm font-semibold text-foreground bg-background py-1">
                          {group.title}
                        </h5>
                        <Separator className="flex-1" />
                      </div>
                      
                      <div className="space-y-4">
                        {group.sessions.map((s, idx) => {
                          const parsedDevice = parseDeviceInfo(s.deviceInfo || "");
                          const DeviceIcon = getDeviceIcon(s.deviceInfo || "");
                          const location =
                            [s.city, s.country].filter(Boolean).join(", ") ||
                            "Unknown Location";

                          return (
                            <div
                              key={`${group.title}-${idx}`}
                              className={cn(
                                "flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-xl transition-all gap-5",
                                s.isCurrent
                                  ? "bg-primary/5 border-primary/20 shadow-sm"
                                  : "bg-card hover:border-border/80 shadow-sm hover:shadow-md",
                              )}
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className={cn(
                                    "p-3 rounded-full ring-1 ring-inset shrink-0 mt-0.5 shadow-sm",
                                    s.isCurrent
                                      ? "bg-background ring-primary/20 text-primary"
                                      : "bg-muted ring-border/50 text-muted-foreground",
                                  )}
                                >
                                  <DeviceIcon className="h-6 w-6" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <p className="text-base font-semibold text-foreground">
                                      {parsedDevice.browser !== "Unknown" ? `${parsedDevice.browser} on ${parsedDevice.os}` : location}
                                    </p>
                                    {s.isCurrent && (
                                      <Badge
                                        variant="secondary"
                                        className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 px-2 py-0 h-5 gap-1.5 font-medium"
                                      >
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Current Device
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                                    <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/30"></span>
                                    {parsedDevice.browser !== "Unknown" ? location : parsedDevice.os}
                                  </p>
                                  <div className="text-xs text-muted-foreground/80 flex items-center flex-wrap gap-x-2 gap-y-1 bg-muted/30 px-2.5 py-1.5 rounded-md w-fit border border-border/40">
                                    <span className="font-medium text-muted-foreground">{s.ipAddress}</span>
                                    <span>•</span>
                                    <span>{formatDate(s.loggedInAt)}</span>
                                    {s.timezone && <span>({s.timezone})</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 self-end sm:self-auto w-full sm:w-auto">
                                {s.latitude && s.longitude && (
                                  <div className="w-24 h-20 rounded-lg overflow-hidden bg-muted/20 border hidden sm:block shrink-0 relative shadow-sm ring-1 ring-border/30">
                                    <iframe 
                                      src={`https://maps.google.com/maps?q=${s.latitude},${s.longitude}&z=10&output=embed`}
                                      className="w-[200%] h-[200%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                      style={{ border: 0 }}
                                      loading="lazy"
                                      tabIndex={-1}
                                      title="Location Map"
                                    />
                                  </div>
                                )}
                                {!s.isCurrent && (
                                  <Button
                                    variant="outline"
                                    className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/40 transition-colors shadow-sm"
                                    onClick={() => {
                                      if (s.originalIndex !== undefined) {
                                        setDeleteSessionId(s.originalIndex);
                                      }
                                    }}
                                  >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center flex flex-col items-center border rounded-xl bg-muted/10 border-dashed">
                  <div className="h-16 w-16 rounded-full bg-background ring-1 ring-border shadow-sm flex items-center justify-center mb-6 text-muted-foreground">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No sessions found</h3>
                  <p className="text-base text-muted-foreground max-w-md">
                    We couldn&apos;t find any sessions matching &quot;
                    <span className="text-foreground font-medium">{sessionSearch}</span>&quot;.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => setSessionSearch("")}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </FramePanel>
        </Frame>

        <AlertDialog
          open={deleteSessionId !== null}
          onOpenChange={() => setDeleteSessionId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Logout this session?</AlertDialogTitle>
              <AlertDialogDescription>
                This will log out the device from your account. You&apos;ll need
                to log in again on that device.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  deleteSessionId !== null && handleLogoutSession(deleteSessionId)
                }
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Logout Session
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={logoutAllConfirmOpen}
          onOpenChange={setLogoutAllConfirmOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out of all other devices?</AlertDialogTitle>
              <AlertDialogDescription>
                This will log you out of {sortedSessions.length - 1} other active{" "}
                {sortedSessions.length - 1 === 1 ? "session" : "sessions"} across
                all your devices. You will stay logged in on this current device.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogoutAllSessions}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sign Out All Others
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}
