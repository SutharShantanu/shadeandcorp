"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Laptop, Smartphone, Tablet, Monitor, LogOut, Shield, KeyRound, Trash2 } from "lucide-react";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

interface SecurityTabProps {
    userProfile: UserProfile | null;
}

export default function SecurityTab({ userProfile }: SecurityTabProps) {
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
    const [revokeProvider, setRevokeProvider] = useState<string | null>(null);

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

    const handleLogoutSession = async (sessionIndex: number) => {
        // Implement logout specific session
        toast.success("Session logged out successfully");
        setDeleteSessionId(null);
    };

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // Implement password change logic
        toast.success("Password changed successfully");
        setChangePasswordOpen(false);
    };

    const handleRevokeConnection = async (provider: string) => {
        // Implement revoke OAuth connection
        toast.success(`${provider} connection revoked`);
        setRevokeProvider(null);
    };

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
                    {userProfile?.sessions && userProfile.sessions.length > 0 ? (
                        userProfile.sessions.slice(0, 5).map((session: any, index: number) => {
                            const DeviceIcon = getDeviceIcon(session.deviceInfo || "");
                            const isCurrent = index === userProfile.sessions.length - 1;

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
                    )}
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and choose a new one.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleChangePassword}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" name="currentPassword" type="password" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" name="newPassword" type="password" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" name="confirmPassword" type="password" required />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setChangePasswordOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Change Password</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Logout Session Confirmation */}
            <AlertDialog open={deleteSessionId !== null} onOpenChange={() => setDeleteSessionId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Logout this session?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will log out the device from your account. You'll need to log in again on that device.
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
