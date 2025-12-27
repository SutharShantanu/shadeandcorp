"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import * as z from "zod";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import NavigateHomeButton from "@/components/NavigateHomeButton";

const resetSchema = z
    .object({
        password: z
            .string()
            .min(8, "Min 8 characters")
            .regex(/[A-Z]/, "Add uppercase letter")
            .regex(/[a-z]/, "Add lowercase letter")
            .regex(/[0-9]/, "Add number")
            .regex(/[^A-Za-z0-9]/, "Add symbol"),
        confirm: z.string(),
    })
    .refine((d) => d.password === d.confirm, {
        path: ["confirm"],
        message: "Passwords do not match",
    });

function ResetPasswordContent() {
    const params = useSearchParams();
    const token = params.get("token");
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const canSubmit = resetSchema.safeParse({ password, confirm }).success;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Missing or invalid reset token.");
            return;
        }
        const parse = resetSchema.safeParse({ password, confirm });
        if (!parse.success) {
            toast.error(parse.error.issues[0].message);
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });
            const data = await res.json();
            if (!data.success) {
                toast.error(data.message || "Reset failed");
                return;
            }
            toast.success("Password updated. You can now log in.");
            setDone(true);
            setTimeout(() => router.push("/login"), 1500);
        } catch (err) {
            console.error(err);
            toast.error("Unexpected error. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            className="flex flex-col min-h-svh items-center justify-center bg-linear-to-br from-background via-background to-muted/30 p-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <Card className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
                {/* Image Side */}
                <div className="relative w-full md:w-1/2 h-40 md:h-auto">
                    <NavigateHomeButton />
                    <Image
                        src="https://picsum.photos/1600/1600"
                        alt="Reset Password"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                {/* Form Side */}
                <div className="w-full md:w-1/2 p-6 flex flex-col gap-4">
                    <CardHeader className="p-0">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="space-y-2"
                        >
                            <CardTitle className="text-3xl font-bold">Reset Your Password</CardTitle>
                            <p className="text-muted-foreground text-sm">
                                Create a strong password to secure your account.
                            </p>
                        </motion.div>
                    </CardHeader>
                    {done ? (
                        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-10">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                            <p className="text-sm font-medium">Password successfully reset. Redirecting…</p>
                        </div>
                    ) : (
                        <CardContent className="p-0 space-y-5">
                            {!token && (
                                <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-700">
                                    This page requires a valid reset token. Request a new link from the
                                    <Link href="/forgot-password" className="underline ml-1">forgot password</Link> page.
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-5" aria-label="Reset password form">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium">New Password</label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="password"
                                            type={showPwd ? "text" : "password"}
                                            autoComplete="new-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="flex-1"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => setShowPwd(v => !v)}>
                                            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <PasswordStrength password={password} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="confirm" className="text-sm font-medium">Confirm Password</label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="confirm"
                                            type={showConfirm ? "text" : "password"}
                                            autoComplete="new-password"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            placeholder="Repeat password"
                                            required
                                            className="flex-1"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => setShowConfirm(v => !v)}>
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || submitting || !token}
                                    className="w-full"
                                >
                                    {submitting ? "Updating…" : "Reset Password"}
                                </Button>
                            </form>
                            <p className="text-center text-xs text-muted-foreground">
                                Remembered your password? <Link href="/login" className="underline">Login</Link>
                            </p>
                        </CardContent>
                    )}
                    <p className="text-center text-xs text-muted-foreground mt-auto">
                        By resetting, you agree to our <Link href="#" className="underline">Terms</Link> & <Link href="#" className="underline">Privacy</Link>.
                    </p>
                </div>
            </Card>
        </motion.div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-svh items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
