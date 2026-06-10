"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "@/components/ui/password-input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  LogOut,
  Shield,
  KeyRound,
  Trash2,
  CircleX,
  CircleCheck,
  Github,
  Mail,
  BadgeCheck,
  BadgePlus,
  Unlink,
  ChevronRight,
  Search,
  ExternalLink,
} from "lucide-react";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { Spinner } from "../ui/spinner";
import Image from "next/image";
import { IconBadge } from "../ui/icon-badge";
import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  differenceInMonths,
  parseISO,
} from "date-fns";
import { Dot } from "../ui/dot";

interface Session {
  deviceInfo?: string;
  city?: string;
  country?: string;
  ipAddress?: string;
  loggedInAt?: string | Date;
  isCurrent?: boolean;
  originalIndex?: number;
}

interface SecurityTabProps {
  userProfile: UserProfile | null;
}

export default function SecurityTab({ userProfile }: SecurityTabProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [revokeProvider, setRevokeProvider] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState<
    "google" | "github" | null
  >(null);
  const [disconnectBlockedOpen, setDisconnectBlockedOpen] = useState(false);
  const [sessionsModalOpen, setSessionsModalOpen] = useState(false);
  const [sessionSearch, setSessionSearch] = useState("");
  const [logoutAllConfirmOpen, setLogoutAllConfirmOpen] = useState(false);

  // Helper for date parsing
  const parseDate = useCallback((date: string | Date | undefined) => {
    if (!date) return new Date();
    return typeof date === "string" ? parseISO(date) : date;
  }, []);

  // Process and sort sessions
  const sortedSessions = useMemo(() => {
    if (!userProfile?.sessions) return [];

    return userProfile.sessions
      .map((session, index) => ({
        ...session,
        isCurrent: index === userProfile.sessions!.length - 1,
        originalIndex: index,
      }))
      .sort((a, b) => {
        // 1. Current session always on top
        if (a.isCurrent) return -1;
        if (b.isCurrent) return 1;

        // 2. Sort by date descending
        const dateA = parseDate(a.loggedInAt);
        const dateB = parseDate(b.loggedInAt);
        return dateB.getTime() - dateA.getTime();
      });
  }, [userProfile?.sessions, parseDate]);

  // Group sessions for modal
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

    // Filter first
    const filtered = sortedSessions.filter((session) => {
      const searchLower = sessionSearch.toLowerCase();
      const matchesSearch =
        !sessionSearch ||
        (session.city || "").toLowerCase().includes(searchLower) ||
        (session.country || "").toLowerCase().includes(searchLower) ||
        (session.ipAddress || "").toLowerCase().includes(searchLower);

      return matchesSearch;
    });

    filtered.forEach((session) => {
      const date = parseDate(session.loggedInAt);
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
      groupMap[group].push(session);
    });

    // Construct ordered array
    groupOrder.forEach((key) => {
      if (groupMap[key]) {
        groups.push({ title: key, sessions: groupMap[key] });
      }
    });

    return { groups, totalCount: filtered.length };
  }, [sortedSessions, sessionSearch, parseDate]);

  // Sync modal with URL: ?action=sessions
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "sessions") {
      setSessionsModalOpen(true);
    }
  }, [searchParams]);

  const openSessionsModal = useCallback(() => {
    setSessionsModalOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("action", "sessions");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const closeSessionsModal = useCallback(() => {
    setSessionsModalOpen(false);
    setSessionSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleLogoutAllSessions = async () => {
    // Implement logout all sessions
    toast.success("All other sessions logged out successfully");
    setLogoutAllConfirmOpen(false);
  };

  const cp = session?.user?.connectedProviders;
  const connectedCount = [cp?.credentials, cp?.google, cp?.github].filter(
    Boolean,
  ).length;

  const connectedAccounts = useMemo(
    () => [
      {
        id: "credentials",
        name: "Email & Password",
        description: cp?.credentials ? "Connected" : "Not connected",
        icon: Shield,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        logoClass: "size-6",
        isConnected: cp?.credentials ?? false,
        signinUrl: null,
      },
      {
        id: "google",
        name: "Google",
        description: cp?.google ? "Connected" : "Not connected",
        logo: "https://cdn-icons-png.flaticon.com/64/281/281764.png",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        logoClass: "size-5",
        isConnected: cp?.google ?? false,
        signinUrl: "/api/auth/signin/google",
      },
      {
        id: "github",
        name: "GitHub",
        description: cp?.github ? "Connected" : "Not connected",
        logo: "https://cdn-icons-png.flaticon.com/64/2111/2111432.png",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        logoClass: "size-5",
        isConnected: cp?.github ?? false,
        signinUrl: "/api/auth/signin/github",
      },
    ],
    [cp, userProfile?.email],
  );
  // Zod schema for password validation
  const changePasswordSchema = z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z
        .string()
        .min(8, "Must be at least 8 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[a-z]/, "Must include a lowercase letter")
        .regex(/[0-9]/, "Must include a number")
        .regex(/[^A-Za-z0-9]/, "Must include a symbol"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      path: ["newPassword"],
      message: "New password must be different from current password",
    });

  const form = useForm<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const canSubmit = form.formState.isValid;

  const handleRevokeProvider = async (provider: string) => {
    setIsRevoking(true);
    try {
      const response = await fetch(`/api/auth/revoke/${provider}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to revoke provider");
      }

      toast.success(`${provider} account disconnected`);
      setRevokeProvider(null);
      // Optionally refresh the page or update state
      window.location.reload();
    } catch (error) {
      toast.error(`Failed to disconnect ${provider}`);
      console.error(error);
    } finally {
      setIsRevoking(false);
    }
  };

  const getDeviceIcon = (deviceInfo: string) => {
    const info = deviceInfo.toLowerCase();
    if (
      info.includes("mobile") ||
      info.includes("android") ||
      info.includes("iphone")
    ) {
      return Smartphone;
    } else if (info.includes("tablet") || info.includes("ipad")) {
      return Tablet;
    } else if (info.includes("laptop")) {
      return Laptop;
    }
    return Monitor;
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Not available";
    try {
      return format(new Date(dateString), "MMM d, yyyy • p");
    } catch {
      return "Invalid date";
    }
  };

  const handleLogoutSession = async (_sessionIndex: number) => {
    void _sessionIndex;
    // Implement logout specific session
    toast.success("Session logged out successfully");
    setDeleteSessionId(null);
  };

  const onSubmit = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsChangingPassword(true);
    const toastId = toast.loading("Changing password...");

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to change password", {
          id: toastId,
        });
        return;
      }

      toast.success(
        "Password changed successfully! A confirmation email has been sent.",
        { id: toastId },
      );
      setChangePasswordOpen(false);
      form.reset();
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // const handleRevokeConnection = async (provider: string) => {
  //     // Implement revoke OAuth connection
  //     toast.success(`${provider} connection revoked`);
  //     setRevokeProvider(null);
  // };

  const handleDeleteAccount = async () => {
    // Implement account deletion
    toast.success("Account deletion initiated");
    setDeleteAccountOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="space-y-8">
      {/* Password Section */}
      <div>
        <h4 className="text-sm font-semibold mb-4">
          Password & Authentication
        </h4>
        <div className="flex items-center w-fit">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Password</p>

            <div className="flex items-start gap-2 mt-1">
              <IconBadge>
                <KeyRound className="h-4 w-4 text-muted-foreground" />
              </IconBadge>
              <div className="flex items-start gap-1 flex-col">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChangePasswordOpen(true)}
                >
                  {/* <KeyRound className="h-4 w-4" /> */}
                  Change Password
                </Button>
                <p className="text-xs font-medium text-muted-foreground">
                  Last changed: Never
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Connected Accounts */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Connected Accounts</h4>
        <div className="flex items-center gap-2">
          {connectedAccounts.map((account) => (
            <Card key={account.id} className="bg-transparent p-0">
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                  <IconBadge
                    variant="default"
                    className={cn("rounded-lg", account.iconBg)}
                  >
                    {account.icon && (
                      <account.icon className={`size-6 ${account.iconColor}`} />
                    )}
                    {account.logo && (
                      <Image
                        src={account.logo}
                        alt={`${account.name}-logo`}
                        width={20}
                        height={20}
                        className={account.logoClass}
                      />
                    )}
                  </IconBadge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{account.name}</p>
                    {account.description === "Connected" ? (
                      <Badge
                        variant="secondary"
                        color="success"
                        className="text-xs"
                      >
                        <BadgeCheck className="h-3 w-3" />
                        {account.description}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        color="default"
                        className="text-xs text-muted-foreground"
                      >
                        {account.description}
                      </Badge>
                    )}
                  </div>
                  {account.isConnected ? (
                    <div className="flex items-center gap-2">
                      {account.id !== "credentials" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (connectedCount <= 1) {
                              setDisconnectBlockedOpen(true);
                            } else {
                              setRevokeProvider(account.id);
                            }
                          }}
                          disabled={isRevoking}
                        >
                          <span>Revoke</span>
                          <Unlink className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    account.signinUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => {
                          setConnectingProvider(
                            account.id as "google" | "github",
                          );
                          window.location.href = account.signinUrl!;
                        }}
                        disabled={isRevoking || connectingProvider !== null}
                      >
                        {connectingProvider === account.id ? (
                          <>
                            <Spinner className="h-4 w-4" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <BadgePlus className="h-4 w-4" />
                            Connect
                          </>
                        )}
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Recent Login Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold">Recent Login Sessions</h4>
          {sortedSessions.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground gap-1"
              onClick={openSessionsModal}
            >
              View All
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {sortedSessions.length > 0 ? (
            sortedSessions.slice(0, 3).map((s: Session, index: number) => {
              const DeviceIcon = getDeviceIcon(s.deviceInfo || "");
              const location =
                [s.city, s.country].filter(Boolean).join(", ") ||
                "Unknown Location";

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3.5 border rounded-lg transition-all",
                    s.isCurrent
                      ? "bg-primary/5 border-primary/20 shadow-sm"
                      : "hover:bg-muted/50",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-2.5 rounded-full ring-1 ring-inset",
                        s.isCurrent
                          ? "bg-background ring-primary/20 text-primary"
                          : "bg-muted ring-border text-muted-foreground",
                      )}
                    >
                      <DeviceIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {location}
                        </p>
                        {s.isCurrent && (
                          <Badge
                            variant="secondary"
                            className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 text-[10px] px-1.5 py-0 h-5 gap-1"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {s.ipAddress} • {formatDate(s.loggedInAt)}
                      </p>
                    </div>
                  </div>
                  {!s.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        s.originalIndex !== undefined &&
                        setDeleteSessionId(s.originalIndex)
                      }
                    >
                      <LogOut className="h-4 w-4 mr-1.5" />
                      Logout
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No recent sessions</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Danger Zone */}
      <div>
        <h4 className="text-sm font-semibold mb-4 text-destructive">
          Danger Zone
        </h4>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setDeleteAccountOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="px-6 py-4 max-w-xl">
          <DialogHeader className="p-0 pb-4">
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
              <div className="overflow-y-auto max-h-[60vh] space-y-4 py-2 px-1 mb-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="current-password"
                          autoComplete="current-password"
                          placeholder="••••••••"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="new-password"
                          autoComplete="new-password"
                          placeholder="Create a strong password"
                          showStrengthIndicator={true}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirm-password"
                          autoComplete="new-password"
                          placeholder="Repeat password"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setChangePasswordOpen(false)}
                  disabled={isChangingPassword}
                >
                  <CircleX className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={!canSubmit || isChangingPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <CircleCheck className="h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Logout Session Confirmation */}
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
            >
              Logout Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disconnect Provider Confirmation */}
      <AlertDialog
        open={revokeProvider !== null}
        onOpenChange={() => setRevokeProvider(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {revokeProvider}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will no longer be able to sign in with your {revokeProvider}{" "}
              account. You can reconnect it anytime from your security settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                revokeProvider && handleRevokeProvider(revokeProvider)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isRevoking}
            >
              {isRevoking ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Disconnecting...
                </>
              ) : (
                <>
                  <Unlink className="h-4 w-4" />
                  Disconnect
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disconnect Blocked Alert */}
      <AlertDialog
        open={disconnectBlockedOpen}
        onOpenChange={setDisconnectBlockedOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cannot disconnect</AlertDialogTitle>
            <AlertDialogDescription>
              This is your only sign-in method. Please connect another account
              (Email & Password or another OAuth provider) before disconnecting
              this one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Understood</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Confirmation */}
      <AlertDialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* All Sessions Modal */}
      <Dialog
        open={sessionsModalOpen}
        onOpenChange={(open) => {
          if (!open) closeSessionsModal();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Login Sessions</DialogTitle>
                <DialogDescription>
                  {groupedSessions.totalCount} total session
                  {groupedSessions.totalCount !== 1 ? "s" : ""}
                </DialogDescription>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by city, country, or IP..."
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              {sortedSessions.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setLogoutAllConfirmOpen(true)}
                >
                  <LogOut className="h-4 w-4" />
                  Logout All Others
                </Button>
              )}
            </div>
          </DialogHeader>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {groupedSessions.groups.length > 0 ? (
                groupedSessions.groups.map((group) => (
                  <div key={group.title} className="space-y-3">
                    <h5 className="text-xs font-semibold text-muted-foreground sticky top-0 bg-background py-1 z-10">
                      {group.title}
                    </h5>
                    <div className="space-y-2">
                      {group.sessions.map((s: Session, index: number) => {
                        const DeviceIcon = getDeviceIcon(s.deviceInfo || "");
                        const location =
                          [s.city, s.country].filter(Boolean).join(", ") ||
                          "Unknown Location";

                        return (
                          <div
                            key={`${group.title}-${index}`}
                            className={cn(
                              "flex items-center justify-between p-3.5 border rounded-lg transition-all",
                              s.isCurrent
                                ? "bg-primary/5 border-primary/20 shadow-sm"
                                : "hover:bg-muted/50",
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "p-2.5 rounded-full ring-1 ring-inset",
                                  s.isCurrent
                                    ? "bg-background ring-primary/20 text-primary"
                                    : "bg-muted ring-border text-muted-foreground",
                                )}
                              >
                                <DeviceIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-foreground">
                                    {location}
                                  </p>
                                  {s.isCurrent && (
                                    <Badge
                                      variant="secondary"
                                      color="success"
                                      className="text-xs px-1.5 py-0 h-5 gap-1"
                                    >
                                      <Dot variant="success" />
                                      Current
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {s.ipAddress} • {formatDate(s.loggedInAt)}
                                </p>
                              </div>
                            </div>
                            {!s.isCurrent && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() =>
                                  s.originalIndex !== undefined &&
                                  setDeleteSessionId(s.originalIndex)
                                }
                              >
                                <LogOut className="h-4 w-4 mr-1.5" />
                                Logout
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-8 w-8 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No sessions found
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout All Sessions Confirmation */}
      <AlertDialog
        open={logoutAllConfirmOpen}
        onOpenChange={setLogoutAllConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout all other sessions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will log you out of all devices except the current one.
              You&apos;ll need to log in again on those devices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutAllSessions}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <LogOut className="h-4 w-4" />
              Logout All Others
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
