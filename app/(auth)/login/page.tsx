"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AuthImageSide from "@/components/AuthImageSide";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/app/(auth)/hook/useLogin";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
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
import { CircleQuestionMark, MailIcon } from "lucide-react";
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
      },
    );
  };

  if (!isReady) return <Loading />;

  return (
    <motion.div
      className="flex min-h-svh w-full items-center justify-center p-4 relative"
      initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="w-full max-w-5xl flex flex-col md:flex-row justify-between overflow-hidden bg-card/80 backdrop-blur-3xl p-0 z-10">
        <AuthImageSide
          title="Welcome Back"
          description="We are glad to see you again. Sign in to access your dashboard."
          keywords="shopping"
        />

        {/* Form Side */}
        <div className="w-full flex flex-col md:w-7/12 gap-y-6 justify-between">
          <CardHeader className="pt-4">
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
          <CardContent className="flex-1 flex flex-col justify-center">
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
                            <FormLabel required>Email Address</FormLabel>
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
                            <FormLabel required>Password</FormLabel>
                            <FormControl>
                              <PasswordInput
                                id="password"
                                aria-label="Password"
                                placeholder="********"
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
                          size="lg"
                          type="submit"
                          disabled={loading}
                          aria-busy={loading}
                          className="w-full transition-all active:scale-[0.98]"
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
              className="text-center flex items-center justify-center gap-1 mx-auto w-fit text-sm text-muted-foreground"
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

          <CardFooter className="bg-transparent mt-0">
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
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
