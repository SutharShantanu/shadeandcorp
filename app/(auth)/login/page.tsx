"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLogin } from "@/app/(auth)/hook/useLogin";

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

export default function Login() {
  const router = useRouter();
  const { form, loading, onSubmit } = useLogin();

  const isReady = true;
  const session = null;

  useEffect(() => {
    if (isReady && session) router.push("/");
  }, [isReady, session, router]);

  if (!isReady) return <Loading />;

  return (
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
                Welcome Back
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Sign in to continue
              </p>
            </motion.div>
          </CardHeader>
          <CardContent className="p-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                aria-label="Login form"
              >
                <FieldGroup>
                  <Field>
                    <div className="flex items-center gap-3">
                      <Button
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
                    <FieldSeparator className="my-3">
                      Or continue with
                    </FieldSeparator>

                    <FormField
                      control={form.control}
                      name="emailOrPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email or Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              id="emailOrPhone"
                              type="text"
                              placeholder="you@example.com or +1234567890"
                              aria-label="Email or Phone Number"
                              aria-required="true"
                              {...field}
                            />
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
                              aria-required="true"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
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

                    {form.formState.errors.root && (
                      <div className="text-sm text-destructive">
                        {form.formState.errors.root.message}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      aria-busy={loading}
                    >
                      {loading ? (
                        <motion.div className="flex items-center gap-1">
                          <Spinner className="h-4 w-4" />
                          <span>Signing in...</span>
                        </motion.div>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
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
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <Link href="#">Terms of Service</Link> and{" "}
          <Link href="#">Privacy Policy</Link>.
        </FieldDescription>
      </motion.div>
    </motion.div>
  );
}
