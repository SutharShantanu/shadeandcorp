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
      className="flex flex-col flex-1 items-center justify-center p-4 sm:p-8 bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex w-full max-w-5xl flex-col md:flex-row relative"
        initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute -inset-1 bg-linear-to-r from-primary/30 via-primary/10 to-primary/30 rounded-[2.5rem] blur-xl opacity-50 pointer-events-none" />
        <Card className="w-full flex flex-col md:flex-row overflow-hidden border-border/50 bg-background/60 backdrop-blur-2xl shadow-2xl rounded-3xl p-0 relative z-10">
          {/* Image Side */}
          <div className="relative w-full md:w-5/12 h-48 md:h-auto overflow-hidden group">
            <NavigateHomeButton />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />
            <Image
              src="https://loremflickr.com/800/1200/ecommerce,shopping"
              alt="Welcome back"
              width={800}
              height={1200}
              className="object-cover w-full h-full transform transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            <div className="absolute bottom-8 left-8 right-8 z-20 text-balance hidden md:block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold drop-shadow-md mb-2">Welcome Back</h2>
                <p className="text-white/80 text-sm drop-shadow">We are glad to see you again. Sign in to access your dashboard.</p>
              </motion.div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full flex flex-col md:w-7/12 py-10 px-6 sm:px-12 gap-y-6">
            <CardHeader className="p-0">
              <motion.div
                className="w-full flex flex-col"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-3xl font-bold tracking-tight mb-2">
                  Login
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Enter your credentials to access your account
                </p>
              </motion.div>
            </CardHeader>
            <CardContent className="p-0">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  aria-label="Login form"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FieldGroup>
                      <Field>
                        <SocialLoginButtons />
                        <FieldSeparator className="my-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Or continue with email
                        </FieldSeparator>

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                              <FormControl>
                                <InputGroup className="transition-shadow focus-within:ring-2 focus-within:ring-primary/20">
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
                              <FormLabel className="text-sm font-medium">Password</FormLabel>
                              <FormControl>
                                <div className="transition-shadow focus-within:ring-2 focus-within:ring-primary/20 rounded-md">
                                  <PasswordInput
                                    id="password"
                                    aria-label="Password"
                                    placeholder="********"
                                    autoComplete="current-password"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </div>
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
                              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-medium text-muted-foreground cursor-pointer">
                                    Remember me
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          <Button
                            asChild
                            variant="link"
                            className="p-0 h-auto font-normal text-muted-foreground hover:text-primary transition-colors text-sm"
                          >
                            <Link
                              href="/forgot-password"
                              className="flex items-center gap-1"
                            >
                              Forgot Password
                              <CircleQuestionMark size={14} className="" />
                            </Link>
                          </Button>
                        </div>

                        <div className="pt-2">
                          <Button
                            type="submit"
                            disabled={loading}
                            aria-busy={loading}
                            className="w-full h-11 transition-all active:scale-[0.98]"
                          >
                            {loading ? (
                              <motion.div className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" />
                                <span>Signing in...</span>
                              </motion.div>
                            ) : (
                              "Sign in to account"
                            )}
                          </Button>
                        </div>

                        {form.formState.errors.root && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }}
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
                className="text-center flex items-center justify-center gap-1 mx-auto w-fit mt-6 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Don&apos;t have an account?
                <Link
                  href="/signup"
                  className="text-foreground hover:text-primary transition-colors hover:underline underline-offset-4 font-semibold ml-1"
                >
                  Create one now
                </Link>
              </motion.div>
            </CardContent>

            <motion.div 
              className="mt-auto pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <FieldDescription className="text-center text-xs text-muted-foreground">
                By signing in, you agree to our{" "}
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
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
