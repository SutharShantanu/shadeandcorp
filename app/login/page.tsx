"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLogin } from "./hook/useLogin";
import { useAuthInfo } from "@/hook/useAuthInfo";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react"; // ✅ Import signIn
import Image from "next/image";

const FormInput = ({
  name,
  label,
  type,
  placeholder,
  control,
  Component = Input,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <FormControl>
          <Component
            id={name}
            aria-label={label}
            aria-required="true"
            type={type}
            placeholder={placeholder}
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const PasswordField = ({ name, label, control }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <FormControl>
          <PasswordInput
            id={name}
            aria-label={label}
            aria-required="true"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const Login = () => {
  const { form, loading, onSubmit } = useLogin();
  const { isReady, session } = useAuthInfo();
  const router = useRouter();

  useEffect(() => {
    if (isReady && session) {
      router.push("/");
    }
  }, [isReady, session, router]);

  if (!isReady) {
    return <Loading />;
  }

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
                Login using Google or Github account
              </p>
            </motion.div>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            {/* Google Button */}
            <motion.div
              className="flex items-center flex-row gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
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
            </motion.div>

            <div className="my-5 w-full flex items-center justify-center overflow-hidden">
              <Separator />
              <span className="text-sm px-2">OR</span>
              <Separator />
            </div>

            {/* Existing Login Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
                aria-label="Login form"
              >
                <FormInput
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="user@example.com"
                  control={form.control}
                />
                <PasswordField
                  name="password"
                  label="Password"
                  control={form.control}
                />

                <div className="flex justify-end text-muted-foreground">
                  <Link
                    href="/forgot-password"
                    className="hover:underline underline-offset-2 text-sm"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  aria-label="Login"
                  className="w-full"
                >
                  {loading ? (
                    <motion.div className="flex items-center gap-1">
                      <Spinner className="h-4 w-4" />
                      <span>Logging in...</span>
                    </motion.div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center mt-4 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary-default underline">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Login;
