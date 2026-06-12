"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import NavigateHomeButton from "@/components/NavigateHomeButton";
import { useState } from "react";
import { type Control, type FieldValues, type UseFormReturn } from "react-hook-form";
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
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { UserIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}: {
  form: SignupForm;
}) {
  const control = form.control as unknown as Control<FieldValues>;
  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name *</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <UserIcon className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  id="firstName"
                  type="text"
                  placeholder="John"
                  aria-label="First Name"
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
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name (Optional)</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <UserIcon className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  aria-label="Last Name"
                  {...field}
                  value={field.value || ""}
                />
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default function Signup() {
  const { form, loading, onSubmit } = useSignup();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isReady = true;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const firstNameError = form.formState.errors.firstName;

      if (firstNameError) {
        toast.error(firstNameError.message || "First name is required");
      } else if (emailError) {
        toast.error(emailError.message || "Please enter a valid email address");
      } else if (passwordError) {
        toast.error(passwordError.message || "Please enter a valid password");
      }
      return;
    }

    setIsSubmitting(true);
    toast.promise(
      new Promise((resolve, reject) => {
        onSubmit(form.getValues()).then((success) => {
          setIsSubmitting(false);
          if (success) resolve("Successfully signed up");
          else reject(new Error("Failed to sign up"));
        });
      }),
      {
        loading: "Creating account...",
        success: "Successfully signed up!",
        error: "Failed to create account. Please check your details.",
      }
    );
  };

  if (!isReady) return <Loading />;

  const control = form.control as unknown as Control<FieldValues>;
  const isEmailFormValid = form.formState.isValid;

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
        <div className="absolute -inset-1 bg-gradient-to-l from-primary/30 via-primary/10 to-primary/30 rounded-[2.5rem] blur-xl opacity-50 pointer-events-none" />
        <Card className="w-full flex flex-col md:flex-row overflow-hidden border-border/50 bg-background/60 backdrop-blur-2xl shadow-2xl rounded-3xl p-0 relative z-10">
          
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
                  Create an account
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Join us today and get started
                </p>
              </motion.div>
            </CardHeader>
            <CardContent className="p-0">
              <Form {...(form as unknown as UseFormReturn<FieldValues>)}>
                <form
                  onSubmit={handleEmailSubmit}
                  className="space-y-5"
                  aria-label="Signup form"
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

                        <NameFields form={form} />

                        <FormField
                          control={control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Email Address *</FormLabel>
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
                          control={control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Password *</FormLabel>
                              <FormControl>
                                <div className="transition-shadow focus-within:ring-2 focus-within:ring-primary/20 rounded-md">
                                  <PasswordInput
                                    id="password"
                                    aria-label="Password"
                                    placeholder="Create a strong password"
                                    showStrengthIndicator={!!field.value}
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="pt-2">
                          <Button
                            type="submit"
                            disabled={loading || isSubmitting || !isEmailFormValid}
                            aria-busy={loading || isSubmitting}
                            className="w-full h-11 transition-all active:scale-[0.98]"
                          >
                            {loading || isSubmitting ? (
                              <motion.div className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" />
                                <span>Creating account...</span>
                              </motion.div>
                            ) : (
                              "Create Account"
                            )}
                          </Button>
                        </div>
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
                Already have an account?
                <Link
                  href="/login"
                  className="text-foreground hover:text-primary transition-colors hover:underline underline-offset-4 font-semibold ml-1"
                >
                  Sign In
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
                By clicking continue, you agree to our{" "}
                <Link href="#" className="hover:text-foreground transition-colors hover:underline underline-offset-4 font-medium">Terms of Service</Link> and{" "}
                <Link href="#" className="hover:text-foreground transition-colors hover:underline underline-offset-4 font-medium">Privacy Policy</Link>.
              </FieldDescription>
            </motion.div>
          </div>

          {/* Image Side */}
          <div className="relative w-full md:w-5/12 h-48 md:h-auto overflow-hidden group">
            <NavigateHomeButton />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <Image
              src="https://picsum.photos/800/1200?blur=4"
              alt="Join us"
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
                <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">Join the Community</h2>
                <p className="text-white/80 text-sm drop-shadow">Unlock exclusive features and start your journey with us.</p>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
