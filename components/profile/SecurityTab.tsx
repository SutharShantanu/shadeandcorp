"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
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
import { Laptop, Smartphone, Tablet, Monitor, LogOut, Shield, KeyRound, Trash2, CircleX, CircleCheck, Github, Mail, BadgeCheck, BadgePlus } from "lucide-react";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { Spinner } from "../ui/spinner";
import Image from "next/image";
import { IconBadge } from "../ui/icon-badge";
import { format } from "date-fns";

interface Session {
    deviceInfo?: string;
    city?: string;
    country?: string;
    ipAddress?: string;
    loggedInAt?: string | Date;
}

interface ExtendedUserProfile extends UserProfile {
    sessions?: Session[];
}

interface SecurityTabProps {
    userProfile: ExtendedUserProfile | null;
}

export default function SecurityTab({ userProfile }: SecurityTabProps) {
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [revokeProvider, setRevokeProvider] = useState<string | null>(null);
    const [isRevoking, setIsRevoking] = useState(false);
    const [connectingProvider, setConnectingProvider] = useState<"google" | "github" | null>(null);

    const connectedAccounts = [
        {
            id: "credentials",
            name: "Email & Password",
            description: userProfile?.email || "Not connected",
            icon: Shield,
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
            cardBg: "bg-muted/30",
            isPrimary: true,
            isConnected: true,
            signinUrl: null,
        },
        {
            id: "google",
            name: "Google",
            description: "Connect account",
            logo: "https://cdn-icons-png.flaticon.com/64/281/281764.png",
            iconBg: "bg-white dark:bg-slate-950 border",
            logoClass: "w-5 h-5",
            cardBg: "hover:bg-muted/50 transition-colors",
            isPrimary: false,
            isConnected: false,
            signinUrl: "/api/auth/signin/google",
        },
        {
            id: "github",
            name: "GitHub",
            description: "Connect account",
            logo: "https://cdn-icons-png.flaticon.com/64/2111/2111432.png",
            iconBg: "bg-slate-950 dark:bg-slate-100",
            logoClass: "w-5 h-5 invert dark:invert-0",
            cardBg: "hover:bg-muted/50 transition-colors",
            isPrimary: false,
            isConnected: false,
            signinUrl: "/api/auth/signin/github",
        },
    ];
    // Zod schema for password validation
    const changePasswordSchema = z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Must be at least 8 characters")
            .regex(/[A-Z]/, "Must include an uppercase letter")
            .regex(/[a-z]/, "Must include a lowercase letter")
            .regex(/[0-9]/, "Must include a number")
            .regex(/[^A-Za-z0-9]/, "Must include a symbol"),
        confirmPassword: z.string(),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    }).refine((data) => data.currentPassword !== data.newPassword, {
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
                toast.error(data.message || "Failed to change password", { id: toastId });
                return;
            }

            toast.success("Password changed successfully! A confirmation email has been sent.", { id: toastId });
            setChangePasswordOpen(false);
            form.reset();
        } catch (error) {
            console.error("Password change error:", error);
            toast.error("An unexpected error occurred. Please try again.", { id: toastId });
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
                <h4 className="text-sm font-semibold mb-4">Password & Authentication</h4>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Password</p>
                        <div className="flex items-center gap-2 mt-1">
                            <IconBadge>
                                <KeyRound className="h-4 w-4 text-muted-foreground" />
                            </IconBadge>
                            <p className="text-sm font-medium">Last changed: Never</p>
                        </div>
                    </div>
                    <Button onClick={() => setChangePasswordOpen(true)}>
                        <KeyRound className="h-4 w-4" />
                        Change Password
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Connected Accounts */}
            <div>
                <h4 className="text-sm font-semibold mb-4">Connected Accounts</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {connectedAccounts.map((account) => (
                        <Card key={account.id} className={cn("bg-transparent", account.cardBg)}>
                            <CardContent className="flex flex-col gap-3 p-4">
                                <div className="flex items-center gap-3">
                                    <IconBadge variant="default" className={cn("rounded-lg", account.iconBg)}>
                                        {account.icon && <account.icon className={`h-5 w-5 ${account.iconColor}`} />}
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
                                        <p className="text-xs text-muted-foreground truncate">{account.description}</p>
                                    </div>
                                    {account.isPrimary ? (
                                        <Badge variant="secondary" color="success" className="text-xs">
                                            <BadgeCheck className="h-3 w-3" />
                                            Primary
                                        </Badge>
                                    ) : (
                                        account.signinUrl && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-fit"
                                                onClick={() => {
                                                    setConnectingProvider(account.id as "google" | "github");
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
                <h4 className="text-sm font-semibold mb-4">Recent Login Sessions</h4>
                <div className="space-y-3">
                    {(() => {
                        const sessions: Session[] = userProfile?.sessions ?? [];
                        return sessions.length > 0 ? (
                            sessions.slice(0, 5).map((session: Session, index: number) => {
                                const DeviceIcon = getDeviceIcon(session.deviceInfo || "");
                                const isCurrent = index === sessions.length - 1;

                                return (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <IconBadge>
                                                <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                                            </IconBadge>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">
                                                        {session.city || "Unknown"}, {session.country || "Unknown"}
                                                    </p>
                                                    {isCurrent && <Badge variant="default" className="text-xs">Current</Badge>}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {session.ipAddress} • {formatDate(session.loggedInAt)}
                                                </p>
                                            </div>
                                        </div>
                                        {!isCurrent && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteSessionId(index)}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </Button>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-muted-foreground">No recent sessions</p>
                        );
                    })()}
                </div>
            </div>

            <Separator />

            {/* Danger Zone */}
            <div>
                <h4 className="text-sm font-semibold mb-4 text-destructive">Danger Zone</h4>
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Delete Account</CardTitle>
                        <CardDescription>
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" onClick={() => setDeleteAccountOpen(true)}>
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
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <PasswordStrength password={field.value || ""} />
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
            <AlertDialog open={deleteSessionId !== null} onOpenChange={() => setDeleteSessionId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Logout this session?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will log out the device from your account. You&apos;ll need to log in again on that device.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteSessionId !== null && handleLogoutSession(deleteSessionId)}>
                            Logout Session
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Account Confirmation */}
            <AlertDialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
