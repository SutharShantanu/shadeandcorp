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

import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/password-input";
import Loading from "@/components/ui/loading";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import Image from "next/image";
import { CircleQuestionMark } from "lucide-react";

// Social Login Buttons Component
function SocialLoginButtons() {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        className="w-1/2"
        onClick={() => signIn("google")}
      >
        <Image
          src="https://cdn-icons-png.flaticon.com/64/281/281764.png"
          alt="google-logo"
          width={20}
          height={20}
        />
        <span>Continue with Google</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-1/2"
        onClick={() => signIn("github")}
      >
        <Image
          src="https://cdn-icons-png.flaticon.com/64/2111/2111432.png"
          alt="github-logo"
          width={20}
          height={20}
        />
        <span>Continue with GitHub</span>
      </Button>
    </div>
  );
}

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
  onSwitchToEmail,
  showErrors,
}: {
  form: LoginForm;
  loading: boolean;
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
            "Login with Phone"
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

export default function Login() {
  const router = useRouter();
  const { form, loading, onSubmit, loginMethod, updateLoginMethod } =
    useLogin();
  const [showErrors, setShowErrors] = useState(false);

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
    await onSubmit(form.getValues());
  };

  if (!isReady) return <Loading />;

  return (
    <motion.div
      className="flex min-h-svh flex-col items-center justify-center bg-linear-to-br from-background via-background to-muted/20 p-4"
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
          <div className="w-full md:w-1/2 h-48 md:h-auto">
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
    </motion.div>
  );
}
