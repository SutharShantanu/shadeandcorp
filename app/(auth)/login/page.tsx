"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLogin, type LoginForm } from "@/app/(auth)/hook/useLogin";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/password-input";
import Loading from "@/components/ui/loading";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import Image from "next/image";
import { CircleQuestionMark } from "lucide-react";
import NavigateHomeButton from "@/components/NavigateHomeButton";
import SocialLoginButtons from "@/components/SocialLoginButton";

// Email Login Form Component
function EmailLoginForm({
  form,
  loading,
  onSwitchToPhone,
  showErrors,
}: {
  form: LoginForm;
  loading: boolean;
  onSwitchToPhone: () => void;
  showErrors: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                aria-label="Email Address"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            {showErrors && <FormMessage />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <PasswordInput
                id="password"
                aria-label="Password"
                placeholder="Enter your password"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            {showErrors && <FormMessage />}
          </FormItem>
        )}
      />

      <div className="flex justify-end text-muted-foreground">
        <Link
          href="/forgot-password"
          className="hover:underline underline-offset-2 text-sm flex items-center gap-1"
        >
          Forgot Password
          <CircleQuestionMark size={14} className="" />
        </Link>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full"
        >
          {loading ? (
            <motion.div className="flex items-center gap-1">
              <Spinner className="h-4 w-4" />
              <span>Signing in...</span>
            </motion.div>
          ) : (
            "Login with Email"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onSwitchToPhone}
        >
          Login with Phone Number
        </Button>
      </div>
    </motion.div>
  );
}

// Phone Login Form Component
function PhoneLoginForm({
  form,
  loading,
  isSendingOtp,
  onSwitchToEmail,
  showErrors,
}: {
  form: LoginForm;
  loading: boolean;
  isSendingOtp: boolean;
  onSwitchToEmail: () => void;
  showErrors: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <PhoneInput
                id="phone"
                placeholder="Enter phone number"
                aria-label="Phone Number"
                defaultCountry="IN"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            {showErrors && <FormMessage />}
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <Button
          type="submit"
          disabled={loading || isSendingOtp}
          aria-busy={loading || isSendingOtp}
          className="w-full"
        >
          {isSendingOtp ? (
            <motion.div className="flex items-center gap-1">
              <Spinner className="h-4 w-4" />
              <span>Sending OTP...</span>
            </motion.div>
          ) : (
            "Send OTP"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onSwitchToEmail}
        >
          Login with Email
        </Button>
      </div>
    </motion.div>
  );
}

// OTP Dialog Component
function OtpDialog({
  open,
  onOpenChange,
  phoneNumber,
  otp,
  onOtpChange,
  loading,
  onVerify,
  onResend,
  canResend,
  resendTimeLeft,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  otp: string;
  onOtpChange: (value: string) => void;
  loading: boolean;
  onVerify: () => void;
  onResend: () => void;
  canResend: boolean;
  resendTimeLeft: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Verify Phone Number</DialogTitle>
          <DialogDescription className="text-center">
            Enter the 6-digit OTP sent to{" "}
            <span className="font-medium text-foreground">{phoneNumber}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={onOtpChange}>
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-12 h-12 rounded-md border"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center space-y-3">
            <Button
              onClick={onVerify}
              disabled={loading || otp.length !== 6}
              className="w-full"
            >
              {loading ? (
                <motion.div className="flex items-center gap-1">
                  <Spinner className="h-4 w-4" />
                  <span>Verifying OTP...</span>
                </motion.div>
              ) : (
                "Verify OTP & Login"
              )}
            </Button>

            <div className="text-center">
              {canResend ? (
                <Button variant="link" className="text-sm" onClick={onResend}>
                  Didn&apos;t receive OTP? Resend
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Resend OTP in {resendTimeLeft}s
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Login() {
  const router = useRouter();
  const { form, loading, onSubmit, loginMethod, updateLoginMethod } =
    useLogin();
  const [showErrors, setShowErrors] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [resendTimeLeft, setResendTimeLeft] = useState(0);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const isReady = true;
  const session = null;

  useEffect(() => {
    if (isReady && session) router.push("/");
  }, [isReady, session, router]);

  const switchToEmail = () => {
    updateLoginMethod("email");
  };

  const switchToPhone = () => {
    updateLoginMethod("phone");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    // Handle phone login with OTP
    if (loginMethod === "phone") {
      const phone = form.getValues("phone");

      // Validate phone
      const isValid = await form.trigger("phone");
      if (!isValid) {
        const phoneError = form.formState.errors.phone;
        if (phoneError) {
          toast.error(
            phoneError.message || "Please enter a valid phone number"
          );
        }
        return;
      }

      setIsSendingOtp(true);
      try {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        });

        const data = await res.json();

        if (!data.success) {
          toast.error(data.message || "Failed to send OTP");
          return;
        }

        toast.success("OTP sent to your phone!");
        setShowOtpDialog(true);
        setCanResendOtp(false);
        setResendTimeLeft(30);

        // Start countdown timer
        const interval = setInterval(() => {
          setResendTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCanResendOtp(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast.error("Failed to send OTP. Please try again.");
      } finally {
        setIsSendingOtp(false);
      }
      return;
    }

    // Handle email login with password
    await onSubmit(form.getValues());
  };

  const handleOtpVerification = async () => {
    if (isVerifyingOtp) return;

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const phone = form.getValues("phone");
      const res = await fetch("/api/auth/verify-login-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "OTP verification failed");
        return;
      }

      // Sign in using NextAuth with the verified user
      // Password is not required for phone login (OTP verified)
      const result = await signIn("credentials", {
        emailOrPhone: phone,
        password: "", // Not used for OTP login, but required by NextAuth
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || "Login failed. Please try again.");
        return;
      }

      if (result?.ok) {
        toast.success("OTP Verified! Logging in...");
        setShowOtpDialog(false);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6 && !isVerifyingOtp) {
      handleOtpVerification();
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp) return;

    const phone = form.getValues("phone");
    setOtp("");
    setCanResendOtp(false);
    setResendTimeLeft(30);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to resend OTP");
        setCanResendOtp(true);
        return;
      }

      toast.success("OTP resent to your phone number");

      // Start countdown timer
      const interval = setInterval(() => {
        setResendTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
      setCanResendOtp(true);
    }
  };

  if (!isReady) return <Loading />;

  return (
    <motion.div
      className="flex flex-col min-h-svh items-center justify-center bg-linear-to-br from-background via-background to-muted/20 p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex w-full max-w-6xl flex-col md:flex-row gap-y-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full flex flex-col md:flex-row overflow-hidden py-0">
          {/* Image Side - Full width on mobile, 50% on md and above */}
          <div className="relative w-full md:w-1/2 h-48 md:h-auto">
            <NavigateHomeButton />
            <Image
              src="https://picsum.photos/2000/2000"
              alt="Welcome back"
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {/* Form Side - Full width on mobile, 50% on md and above */}
          <div className="w-full flex flex-col md:w-1/2 py-6 px-6 gap-y-3">
            <CardHeader className="p-0 mb-6">
              <motion.div
                className="w-full flex flex-col"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-3xl font-bold mb-2">
                  Login to Your Account
                </CardTitle>
                <p className="text-muted-foreground text-base">
                  Enter your credentials to access your account and continue
                  where you left off
                </p>
              </motion.div>
            </CardHeader>
            <CardContent className="p-0">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  aria-label="Login form"
                >
                  <FieldGroup>
                    <Field>
                      <SocialLoginButtons />
                      <FieldSeparator className="my-3">
                        Or continue with
                      </FieldSeparator>

                      {/* Show email form by default, phone form when phone method is selected */}
                      {loginMethod === "phone" ? (
                        <PhoneLoginForm
                          form={form as LoginForm}
                          loading={loading}
                          isSendingOtp={isSendingOtp}
                          onSwitchToEmail={switchToEmail}
                          showErrors={showErrors}
                        />
                      ) : (
                        <EmailLoginForm
                          form={form as LoginForm}
                          loading={loading}
                          onSwitchToPhone={switchToPhone}
                          showErrors={showErrors}
                        />
                      )}

                      {form.formState.errors.root && (
                        <div className="text-sm text-destructive">
                          {form.formState.errors.root.message}
                        </div>
                      )}
                    </Field>
                  </FieldGroup>
                </form>
              </Form>

              <div className="text-center flex items-center gap-1 mx-auto w-fit mt-4 text-sm">
                Don&apos;t have an account?
                <Link
                  href="/signup"
                  className="hover:underline underline-offset-2 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            </CardContent>

            <FieldDescription className="text-center text-xs text-muted-foreground px-6">
              By signing in, you agree to our{" "}
              <Link
                href="#"
                className="hover:underline underline-offset-2 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="hover:underline underline-offset-2 font-medium"
              >
                Privacy Policy
              </Link>
              .
            </FieldDescription>
          </div>
        </Card>
      </motion.div>

      <OtpDialog
        open={showOtpDialog}
        onOpenChange={setShowOtpDialog}
        phoneNumber={form.getValues("phone") || ""}
        otp={otp}
        onOtpChange={handleOtpChange}
        loading={isVerifyingOtp}
        onVerify={handleOtpVerification}
        onResend={handleResendOtp}
        canResend={canResendOtp}
        resendTimeLeft={resendTimeLeft}
      />
    </motion.div>
  );
}
