"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import * as z from "zod";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import NavigateHomeButton from "@/components/NavigateHomeButton";
import AuthImageSide from "@/components/AuthImageSide";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const resetSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
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
  const email = params.get("email");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resetSchema>) => {
    if (!email) {
      toast.error("Missing email address.");
      return;
    }
    setSubmitting(true);
    try {
      // Simulated API call (replace with your actual endpoint)
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: values.otp,
          newPassword: values.password,
        }),
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
      className="flex min-h-svh w-full items-center justify-center p-4 relative"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="w-full max-w-5xl flex flex-col md:flex-row justify-between overflow-hidden p-0 z-10">
        {/* Image Side */}
        <AuthImageSide
          title="Reset Password"
          description="Secure your account with a strong new password."
          keywords="lock"
        />
        {/* Form Side */}
        <div className="w-full flex flex-col md:w-7/12 gap-y-6 justify-between">
          <CardHeader className="pt-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="w-full flex flex-col"
            >
              <CardTitle className="text-3xl font-bold tracking-tight mb-2">
                Reset Your Password
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Enter the 6-digit OTP sent to your email and create a new
                password.
              </p>
            </motion.div>
          </CardHeader>
          {done ? (
            <div className="flex flex-col justify-center flex-1 py-10">
              <Alert variant="success">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Password successfully reset. Redirecting…
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <CardContent className="flex flex-col justify-center">
              {!email && (
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Missing Email</AlertTitle>
                  <AlertDescription>
                    This page requires your email address. Please start from the
                    <Link href="/forgot-password" className="underline ml-1">
                      forgot password
                    </Link>{" "}
                    page.
                  </AlertDescription>
                </Alert>
              )}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                  aria-label="Reset password form"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FieldGroup>
                      <Field>
                        <FormField
                          control={form.control}
                          name="otp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>
                                One-Time Password (OTP)
                              </FormLabel>
                              <FormControl>
                                <div className="flex justify-center w-full">
                                  <InputOTP
                                    maxLength={6}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={!email}
                                    placeholder="------"
                                    pattern={REGEXP_ONLY_DIGITS}
                                  >
                                    <InputOTPGroup>
                                      <InputOTPSlot index={0} />
                                      <InputOTPSlot index={1} />
                                      <InputOTPSlot index={2} />
                                      <InputOTPSlot index={3} />
                                      <InputOTPSlot index={4} />
                                      <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                  </InputOTP>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>New Password</FormLabel>
                              <FormControl>
                                <PasswordInput
                                  id="password"
                                  autoComplete="new-password"
                                  placeholder="Enter Your Password"
                                  required
                                  showStrengthIndicator={true}
                                  disabled={!email}
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
                          name="confirm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Confirm Password</FormLabel>
                              <FormControl>
                                <PasswordInput
                                  id="confirm"
                                  autoComplete="new-password"
                                  placeholder="Enter Your Password"
                                  required
                                  disabled={!email}
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="pt-2">
                          <Button
                            size="lg"
                            type="submit"
                            disabled={submitting || !email}
                            aria-busy={submitting}
                            className="w-full transition-all active:scale-[0.98]"
                          >
                            {submitting ? (
                              <motion.div className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" />
                                <span>Updating...</span>
                              </motion.div>
                            ) : (
                              "Reset Password"
                            )}
                          </Button>
                        </div>

                        {form.formState.errors.root && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="text-sm text-destructive mt-2"
                          >
                            {form.formState.errors.root.message}
                          </motion.div>
                        )}
                      </Field>
                    </FieldGroup>
                  </motion.div>
                </form>
              </Form>
              <motion.div
                className="text-center flex items-center justify-center gap-1 mx-auto w-fit text-sm text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Remembered your password?{" "}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </motion.div>
            </CardContent>
          )}
          <CardFooter className="bg-transparent mt-0">
            <FieldDescription className="text-center text-xs text-muted-foreground">
              By resetting, you agree to our{" "}
              <Link
                href="#"
                className="hover:text-foreground transition-colors hover:underline underline-offset-4 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="hover:text-foreground transition-colors hover:underline underline-offset-4 font-medium"
              >
                Privacy Policy
              </Link>
              .
            </FieldDescription>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
