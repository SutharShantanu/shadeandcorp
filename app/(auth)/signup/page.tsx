"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignupForm, useSignup } from "@/app/(auth)/hook/useSignup";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/password-input";
import Loading from "@/components/ui/loading";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import SocialLoginButtons from "@/components/SocialLoginButton";

// Name Fields Component
function NameFields({
  form,
  showErrors,
}: {
  form: SignupForm;
  showErrors: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name *</FormLabel>
            <FormControl>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                aria-label="First Name"
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
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name *</FormLabel>
            <FormControl>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                aria-label="Last Name"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            {showErrors && <FormMessage />}
          </FormItem>
        )}
      />
    </div>
  );
}

// Update the EmailSignupForm component:
function EmailSignupForm({
  form,
  loading,
  onSwitchToPhone,
  showErrors,
}: {
  form: SignupForm;
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
            <FormLabel>Email Address *</FormLabel>
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
            <FormLabel>Password *</FormLabel>
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
              <span>Creating account...</span>
            </motion.div>
          ) : (
            "Sign up with Email"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onSwitchToPhone}
        >
          Sign up with Phone Number
        </Button>
      </div>
    </motion.div>
  );
}

// Update the PhoneSignupForm component:
function PhoneSignupForm({
  form,
  loading,
  isSendingOtp,
  onSwitchToEmail,
  showErrors,
}: {
  form: SignupForm;
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
            <FormLabel>Phone Number *</FormLabel>
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
          Sign up with Email
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
                "Verify OTP & Sign Up"
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

export default function Signup() {
  const router = useRouter();
  const { form, loading, onSubmit, signupMethod, updateSignupMethod } =
    useSignup();
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [resendTimeLeft, setResendTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const isReady = true;

  // Update your submit handlers to show errors on submission:
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true); // Show errors after first submission attempt

    if (isSubmitting) return;

    const isValid = await form.trigger([
      "firstName",
      "lastName",
      "email",
      "password",
    ]);

    if (!isValid) {
      const emailError = form.formState.errors.email;
      const passwordError = form.formState.errors.password;

      if (emailError) {
        toast.error(emailError.message || "Please enter a valid email address");
      } else if (passwordError) {
        toast.error(passwordError.message || "Please enter a valid password");
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form.getValues());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    // Validate only the phone form fields
    const isValid = await form.trigger(["firstName", "lastName", "phone"]);
    console.log("Is phone form valid?", isValid);

    if (!isValid) {
      // Show specific error messages
      const firstNameError = form.formState.errors.firstName;
      const lastNameError = form.formState.errors.lastName;
      const phoneError = form.formState.errors.phone;

      if (firstNameError) {
        toast.error(firstNameError.message || "Please enter your first name");
      } else if (lastNameError) {
        toast.error(lastNameError.message || "Please enter your last name");
      } else if (phoneError) {
        toast.error(phoneError.message || "Please enter a valid phone number");
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
        body: JSON.stringify({
          phone: form.getValues("phone"),
          firstName: form.getValues("firstName"),
          lastName: form.getValues("lastName"),
        }),
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
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const toggleSignupMethod = () => {
    const phoneValue = form.getValues("phone");
    if (phoneValue && phoneValue.trim() !== "") {
      setShowAlertDialog(true);
    } else {
      switchToEmail();
    }
  };

  const switchToEmail = () => {
    updateSignupMethod("email");
    setShowOtpDialog(false);
    setOtp("");
    toast.success("Switched to email signup");
    setShowAlertDialog(false);
  };

  const switchToPhone = () => {
    updateSignupMethod("phone");
    toast.success("Switched to phone signup");
  };

  const handleOtpVerification = async () => {
    if (isSubmitting) return;

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: form.getValues("phone"),
          otp,
          userData: {
            firstName: form.getValues("firstName"),
            lastName: form.getValues("lastName"),
          },
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "OTP verification failed");
        return;
      }

      toast.success("OTP Verified! Account created successfully.");
      setShowOtpDialog(false);

      // Redirect to login or dashboard
      router.push("/login?message=registration-success");
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6 && !isSubmitting) {
      handleOtpVerification();
    }
  };

  const handleResendOtp = () => {
    if (!canResendOtp) return;

    setOtp("");
    setCanResendOtp(false);
    setResendTimeLeft(30);
    toast.success("OTP resent to your phone number");
  };

  const handleAlertDialogClose = (open: boolean) => {
    if (!open) {
      toast.info("Switch to email signup cancelled");
    }
    setShowAlertDialog(open);
  };

  if (!isReady) return <Loading />;

  return (
    <>
      <motion.div
        className="flex min-h-svh flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex w-full max-w-lg flex-col gap-y-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="w-full max-w-lg p-8 gap-0">
            <CardHeader>
              <motion.div
                className="text-center my-4 w-full flex flex-col items-center "
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-2xl font-semibold">
                  Create an account
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Sign up to get started
                </p>
              </motion.div>
            </CardHeader>
            <CardContent className="p-0">
              <Form {...form}>
                <form
                  onSubmit={
                    signupMethod === "phone"
                      ? handlePhoneSubmit
                      : handleEmailSubmit
                  }
                  className="space-y-4"
                  aria-label="Signup form"
                >
                  <FieldGroup>
                    <Field>
                      <SocialLoginButtons />
                      <FieldSeparator className="my-3">
                        Or continue with
                      </FieldSeparator>

                      <NameFields form={form} showErrors={showErrors} />

                      {/* Show email form by default, phone form when phone method is selected */}
                      {signupMethod === "phone" ? (
                        <PhoneSignupForm
                          form={form}
                          loading={loading || isSubmitting}
                          isSendingOtp={isSendingOtp}
                          onSwitchToEmail={toggleSignupMethod}
                          showErrors={showErrors}
                        />
                      ) : (
                        <EmailSignupForm
                          form={form}
                          loading={loading || isSubmitting}
                          onSwitchToPhone={switchToPhone}
                          showErrors={showErrors}
                        />
                      )}
                    </Field>
                  </FieldGroup>
                </form>
              </Form>

              <div className="text-center flex items-center gap-1 mx-auto w-fit mt-4 text-sm">
                Already have an account?
                <Link
                  href="/login"
                  className="hover:underline underline-offset-2 text-sm"
                >
                  Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <Link href="#">Terms of Service</Link> and{" "}
            <Link href="#">Privacy Policy</Link>.
          </FieldDescription>
        </motion.div>
      </motion.div>

      <OtpDialog
        open={showOtpDialog}
        onOpenChange={setShowOtpDialog}
        phoneNumber={form.getValues("phone") || ""}
        otp={otp}
        onOtpChange={handleOtpChange}
        loading={loading || isSubmitting}
        onVerify={handleOtpVerification}
        onResend={handleResendOtp}
        canResend={canResendOtp}
        resendTimeLeft={resendTimeLeft}
      />

      <AlertDialog open={showAlertDialog} onOpenChange={handleAlertDialogClose}>
        <AlertDialogContent>
          <AlertDialogTitle>Switch to Email Signup?</AlertDialogTitle>
          <AlertDialogDescription>
            You&apos;ll lose the phone number you entered. Are you sure you want
            to switch to email signup?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={switchToEmail}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
