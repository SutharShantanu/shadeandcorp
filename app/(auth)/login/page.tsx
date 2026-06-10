"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import Loading from "@/components/ui/loading";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import Image from "next/image";
import { CircleQuestionMark, MailIcon } from "lucide-react";
import NavigateHomeButton from "@/components/NavigateHomeButton";
import SocialLoginButtons from "@/components/SocialLoginButton";

export default function Login() {
  const router = useRouter();
  const { form, loading, onSubmit } = useLogin();

  const isReady = true;
  const session = null;

  useEffect(() => {
    if (isReady && session) router.push("/");
  }, [isReady, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      new Promise((resolve, reject) => {
        onSubmit(form.getValues()).then((success) => {
          if (success) resolve("Successfully signed in");
          else reject(new Error("Failed to sign in"));
        });
      }),
      {
        loading: "Signing in...",
        success: "Successfully signed in!",
        error: "Failed to sign in. Please check your credentials.",
      }
    );
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
          {/* Image Side */}
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

          {/* Form Side */}
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
                        Or continue with email
                      </FieldSeparator>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <InputGroup>
                                <InputGroupAddon align="inline-start">
                                  <MailIcon className="h-4 w-4 text-muted-foreground" />
                                </InputGroupAddon>
                                <InputGroupInput
                                  id="email"
                                  type="email"
                                  placeholder="you@example.com"
                                  aria-label="Email Address"
                                  autoComplete="username"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </InputGroup>
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <PasswordInput
                                id="password"
                                aria-label="Password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between mt-2">
                        <FormField
                          control={form.control}
                          name="rememberMe"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-1 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal text-muted-foreground cursor-pointer">
                                  Remember me
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <Link
                          href="/forgot-password"
                          className="hover:underline underline-offset-2 text-sm text-muted-foreground flex items-center gap-1"
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
                            "Login"
                          )}
                        </Button>
                      </div>

                      {form.formState.errors.root && (
                        <div className="text-sm text-destructive mt-2">
                          {form.formState.errors.root.message}
                        </div>
                      )}
                    </Field>
                  </FieldGroup>
                </form>
              </Form>

              <div className="text-center flex items-center justify-center gap-1 mx-auto w-fit mt-4 text-sm">
                Don&apos;t have an account?
                <Link
                  href="/signup"
                  className="hover:underline underline-offset-2 text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </CardContent>

            <FieldDescription className="text-center text-xs text-muted-foreground px-6 mt-4">
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
