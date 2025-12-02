"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogClose,
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

    // Sync URL parameter with modal state
    useEffect(() => {
        if (open) {
            const url = new URL(window.location.href);
            url.searchParams.set('verifying-email', 'true');
            window.history.pushState({}, '', url);
        } else {
            const url = new URL(window.location.href);
            url.searchParams.delete('verifying-email');
            window.history.pushState({}, '', url);
        }
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
                setOtp(""); // Clear OTP on error for retry
                return;
            }

            toast.success("Email verified successfully!", { id: toastId });

            // Remove URL parameter before closing
            const url = new URL(window.location.href);
            url.searchParams.delete('verifying-email');
            window.history.pushState({}, '', url);

            onOpenChange(false);
            setOtp("");

            // Call the success callback to refresh user data
            if (onVerificationSuccess) {
                onVerificationSuccess();
            }

            // Update the session to reflect the new isEmailVerified status
            await update();

            // Reload page after a short delay to update the UI
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("OTP verification error:", error);
            toast.error("An unexpected error occurred. Please try again.", { id: toastId });
            setOtp(""); // Clear OTP on error for retry
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

            toast.success("Verification email resent! Check your inbox.", { id: toastId });
            setOtp(""); // Clear the OTP input
        } catch (error) {
            console.error("Resend OTP error:", error);
            toast.error("An unexpected error occurred. Please try again.", { id: toastId });
        }
    };

    const handleCloseAttempt = (shouldClose: boolean) => {
        if (shouldClose) {
            setShowCloseWarning(true);
        }
    };

    const handleConfirmClose = () => {
        setShowCloseWarning(false);
        onOpenChange(false);
        setOtp("");
    };

    return (
        <>
            <AlertDialog open={showCloseWarning} onOpenChange={setShowCloseWarning}>
                <AlertDialogContent className="max-w-sm">
                    <AlertDialogHeader>
                        <div className="flex items-center justify-center">
                            <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-3">
                                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                            </div>
                        </div>
                        <AlertDialogTitle className="text-center">Cancel Email Verification?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            You haven&apos;t verified your email yet. If you close this now, you&apos;ll need to request a new verification code.
                            Are you sure you want to cancel?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row justify-center gap-2 sm:gap-2">
                        <AlertDialogCancel >
                            <CircleX className="h-4 w-4" />
                            Continue Verifying
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmClose}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            <CheckCircle2 className="h-4 w-4" />

                            Yes, Cancel
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={open} onOpenChange={handleCloseAttempt} modal>
                <DialogContent
                    className="sm:max-w-sm px-6 py-4"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    showCloseButton={false}
                >
                    {/* Close button with warning */}
                    <DialogClose
                        onClick={(e) => {
                            e.preventDefault();
                            setShowCloseWarning(true);
                        }}
                        className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 z-50 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
                        disabled={isVerifying}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogClose>

                    <DialogHeader className="p-0 border-0">
                        <div className="flex items-center justify-center mb-4">
                            <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/20 p-3">
                                <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                            </div>
                        </div>
                        <DialogTitle className="text-center">Verify Your Email</DialogTitle>
                        <DialogDescription className="text-center">
                            We&apos;ve sent a 6-digit verification code to
                            <br />
                            <span className="font-semibold text-foreground">{email}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={setOtp}
                                disabled={isVerifying}
                                autoFocus
                            >
                                <InputOTPGroup className="">
                                    <InputOTPSlot index={0} className="w-12 h-12 text-xl font-semibold" />
                                    <InputOTPSlot index={1} className="w-12 h-12 text-xl font-semibold" />
                                    <InputOTPSlot index={2} className="w-12 h-12 text-xl font-semibold" />
                                    <InputOTPSlot index={3} className="w-12 h-12 text-xl font-semibold" />
                                    <InputOTPSlot index={4} className="w-12 h-12 text-xl font-semibold" />
                                    <InputOTPSlot index={5} className="w-12 h-12 text-xl font-semibold" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <div className="text-center text-xs text-muted-foreground">
                            Didn&apos;t receive the code?{" "}
                            <Button
                                variant="link"
                                className="p-0 h-auto text-xs font-semibold text-muted-foreground"
                                onClick={handleResendOTP}
                                disabled={isVerifying}
                            >
                                Resend
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="flex-row justify-center gap-2 sm:gap-2">
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
                                    Verifying...</>
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
