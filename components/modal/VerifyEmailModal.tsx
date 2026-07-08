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
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Mail, CheckCircle2 } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { useSession } from "next-auth/react";
import { IconBadge } from "../ui/icon-badge";

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
    const [resendCooldown, setResendCooldown] = useState(0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Start cooldown when modal opens
    useEffect(() => {
        if (open) {
            setResendCooldown(60); // 60 seconds cooldown
        }
    }, [open]);

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
            setResendCooldown(60); // Reset cooldown to 60 seconds
        } catch (error) {
            console.error("Resend OTP error:", error);
            toast.error("Unexpected error", { id: toastId });
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        setOtp("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogContent
                className="max-w-sm"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-center flex items-center gap-2">
                        <IconBadge variant="success">
                            <Mail />
                        </IconBadge>
                        Verify Your Email
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription className="text-center pt-4">
                    We&apos;ve sent a 6-digit code to
                    <br />
                    <span className="font-semibold">{email}</span>
                </DialogDescription>

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
                        Didn&apos;t receive the code?{" "}
                        <Button
                            variant="link"
                            className="p-0 h-auto text-xs font-semibold"
                            onClick={handleResendOTP}
                            disabled={isVerifying || resendCooldown > 0}
                        >
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
                        </Button>
                    </div>
                </div>

                {otp.length >= 1 && (
                    <DialogFooter className="flex-row justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            size="sm"
                            disabled={isVerifying}
                        >
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
                                    Verify
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
