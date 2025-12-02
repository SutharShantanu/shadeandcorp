"use client";

import { useState } from "react";
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
import { Laptop, Smartphone, Tablet, Monitor, LogOut, Shield, KeyRound, Trash2, CircleX, CircleCheck } from "lucide-react";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { Spinner } from "../ui/spinner";

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
    // const [revokeProvider, setRevokeProvider] = useState<string | null>(null);
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
            return new Date(dateString).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
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
                    <div>
                        <p className="text-sm font-medium">Password</p>
                        <p className="text-xs text-muted-foreground">Last changed: Never</p>
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
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Email & Password</p>
                                <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
                            </div>
                        </div>
                        <Badge variant="outline">Primary</Badge>
                    </div>

                    {/* Google Account if connected */}
                    {/* Add other OAuth providers here */}
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
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                <DeviceIcon className="h-5 w-5" />
                                            </div>
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
                <DialogContent className="px-6 py-4">
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
                            <DialogFooter>
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
