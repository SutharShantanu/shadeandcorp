import { useState, useMemo, useCallback } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { format, parseISO } from "date-fns";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { Shield, Laptop, Smartphone, Tablet, Monitor } from "lucide-react";

export interface Session {
  deviceInfo?: string;
  city?: string;
  country?: string;
  ipAddress?: string;
  loggedInAt?: string | Date;
  isCurrent?: boolean;
  originalIndex?: number;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export const parseDeviceInfo = (infoStr: string) => {
  try {
    const info = JSON.parse(infoStr);
    return info as { browser: string; os: string; device: string };
  } catch {
    return { browser: "Unknown", os: "Unknown", device: "Desktop" };
  }
};

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

export function useSecurity(
  userProfile: UserProfile | null,
  onLogoutSession?: (index: number) => Promise<{ success: boolean; message?: string; error?: string }>,
  onLogoutAllSessions?: () => Promise<{ success: boolean; message?: string; error?: string }>
) {
  const { data: session } = useSession();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [revokeProvider, setRevokeProvider] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState<"google" | "github" | null>(null);
  const [disconnectBlockedOpen, setDisconnectBlockedOpen] = useState(false);

  const parseDate = useCallback((date: string | Date | undefined) => {
    if (!date) return new Date();
    return typeof date === "string" ? parseISO(date) : date;
  }, []);

  const sortedSessions = useMemo(() => {
    if (!userProfile?.sessions) return [];

    return userProfile.sessions
      .map((session, index) => ({
        ...session,
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
  }, [userProfile?.sessions, parseDate]);

  const cp = session?.user?.connectedProviders;
  const connectedCount = [cp?.credentials, cp?.google, cp?.github].filter(Boolean).length;

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
    [cp]
  );

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
    if (info.includes("mobile") || info.includes("android") || info.includes("iphone")) {
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

  const handleLogoutSession = async (sessionIndex: number) => {
    if (onLogoutSession) {
      const result = await onLogoutSession(sessionIndex);
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

      toast.success("Password changed successfully! A confirmation email has been sent.", {
        id: toastId,
      });
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

  const handleDeleteAccount = async () => {
    toast.success("Account deletion initiated");
    setDeleteAccountOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  return {
    changePasswordOpen,
    setChangePasswordOpen,
    deleteSessionId,
    setDeleteSessionId,
    deleteAccountOpen,
    setDeleteAccountOpen,
    isChangingPassword,
    revokeProvider,
    setRevokeProvider,
    isRevoking,
    connectingProvider,
    setConnectingProvider,
    disconnectBlockedOpen,
    setDisconnectBlockedOpen,
    sortedSessions,
    connectedCount,
    connectedAccounts,
    form,
    canSubmit,
    handleRevokeProvider,
    getDeviceIcon,
    formatDate,
    handleLogoutSession,
    onSubmit,
    handleDeleteAccount,
  };
}
