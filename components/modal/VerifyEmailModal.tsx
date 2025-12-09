"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

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

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Mail, CheckCircle2, CircleX, AlertTriangle, X } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { useSession } from "next-auth/react";

interface VerifyEmailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    email: string;
    onVerificationSuccess?: () => void;
}

export default function VerifyEmailModal({
    open,
    onOpenChange,
    email,
    onVerificationSuccess,
}: VerifyEmailModalProps) {
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [showCloseWarning, setShowCloseWarning] = useState(false);
    const { update } = useSession();

    // Sync URL with modal state
    useEffect(() => {
        const url = new URL(window.location.href);

        if (open) {
            url.searchParams.set("verifying-email", "true");
        } else {
            url.searchParams.delete("verifying-email");
        }
        window.history.pushState({}, "", url);
    }, [open]);

    // Auto-submit when OTP is complete
    useEffect(() => {
        if (otp.length === 6 && !isVerifying) {
            handleVerifyOTP();
        }
    }, [otp]);

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setIsVerifying(true);
        const toastId = toast.loading("Verifying OTP...");

        try {
            const response = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                toast.error(data.message || "Invalid or expired OTP", { id: toastId });
                setOtp("");
                return;
            }

            toast.success("Email verified successfully!", { id: toastId });

            // Remove URL param
            const url = new URL(window.location.href);
            url.searchParams.delete("verifying-email");
            window.history.pushState({}, "", url);

            onOpenChange(false);
            setOtp("");

            if (onVerificationSuccess) onVerificationSuccess();

            await update();

            // setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error("OTP verification error:", error);
            toast.error("An unexpected error occurred.", { id: toastId });
            setOtp("");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOTP = async () => {
        const toastId = toast.loading("Resending verification email...");

        try {
            const response = await fetch("/api/auth/send-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                toast.error(data.message || "Failed to resend verification email", { id: toastId });
                return;
            }

            toast.success("Verification email resent!", { id: toastId });
            setOtp("");
        } catch (error) {
            console.error("Resend OTP error:", error);
            toast.error("Unexpected error", { id: toastId });
        }
    };

    const handleHeaderClose = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowCloseWarning(true);
    };

    const handleConfirmClose = () => {
        setShowCloseWarning(false);
        onOpenChange(false);
        setOtp("");
    };

    return (
        <>
            {/* Warning popup before closing */}
            <AlertDialog open={showCloseWarning} onOpenChange={setShowCloseWarning}>
                <AlertDialogContent className="max-w-sm">
                    <AlertDialogHeader>
                        <div className="flex items-center justify-center">
                            <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-3">
                                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                            </div>
                        </div>

                        <AlertDialogTitle className="text-center">
                            Cancel Email Verification?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-center">
                            You haven't verified your email yet.
                            If you close this now, you will need to request a new code.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="flex-row justify-center gap-2">
                        <AlertDialogCancel>
                            <CircleX className="h-4 w-4" />
                            Continue Verifying
                        </AlertDialogCancel>

                        <AlertDialogAction onClick={handleConfirmClose} className="bg-destructive">
                            <CheckCircle2 className="h-4 w-4" />
                            Yes, Cancel
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Main modal */}
            <Dialog open={open} onOpenChange={() => setShowCloseWarning(true)} modal>
                <DialogContent
                    className="sm:max-w-sm px-6 py-4"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader className="relative pb-2 border-b">
                        {/* Close button INSIDE header */}
                        <DialogPrimitive.Close
                            onClick={handleHeaderClose}
                            className="absolute right-0 top-1 opacity-70 hover:opacity-100 transition"
                            disabled={isVerifying}
                        >
                            <X className="h-5 w-5" />
                        </DialogPrimitive.Close>

                        <div className="flex items-center justify-center mb-4">
                            <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/20 p-3">
                                <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                            </div>
                        </div>

                        <DialogTitle className="text-center">Verify Your Email</DialogTitle>

                        <DialogDescription className="text-center">
                            We've sent a 6-digit code to
                            <br />
                            <span className="font-semibold">{email}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* OTP Input */}
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={setOtp}
                                disabled={isVerifying}
                                autoFocus
                            >
                                <InputOTPGroup>
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <InputOTPSlot
                                            key={i}
                                            index={i}
                                            className="w-12 h-12 text-xl font-semibold"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <div className="text-center text-xs text-muted-foreground">
                            Didn’t receive the code?{" "}
                            <Button
                                variant="link"
                                className="p-0 h-auto text-xs font-semibold"
                                onClick={handleResendOTP}
                                disabled={isVerifying}
                            >
                                Resend
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="flex-row justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowCloseWarning(true)}
                            size="sm"
                            disabled={isVerifying}
                        >
                            <CircleX className="h-4 w-4" />
                            Cancel
                        </Button>

                        <Button
                            onClick={handleVerifyOTP}
                            size="sm"
                            disabled={isVerifying || otp.length !== 6}
                        >
                            {isVerifying ? (
                                <>
                                    <Spinner className="h-4 w-4" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Verify Email
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
