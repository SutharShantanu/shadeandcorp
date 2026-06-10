"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
            <Form {...(form as unknown as UseFormReturn<FieldValues>)}>
              <form
                onSubmit={handleEmailSubmit}
                className="space-y-4"
                aria-label="Signup form"
              >
                <FieldGroup>
                  <Field>
                    <SocialLoginButtons />
                    <FieldSeparator className="my-3">
                      Or continue with email
                    </FieldSeparator>

                    <NameFields form={form} />

                    <FormField
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <InputGroup>
                              <InputGroupAddon>
                                <MailIcon className="h-4 w-4" />
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
                          <FormLabel>Password *</FormLabel>
                          <FormControl>
                            <PasswordInput
                              id="password"
                              aria-label="Password"
                              placeholder="Enter your password"
                              showStrengthIndicator={!!field.value}
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3 mt-4">
                      <Button
                        type="submit"
                        disabled={loading || isSubmitting || !isEmailFormValid}
                        aria-busy={loading || isSubmitting}
                        className="w-full"
                      >
                        {loading || isSubmitting ? (
                          <motion.div className="flex items-center gap-1">
                            <Spinner className="h-4 w-4" />
                            <span>Creating account...</span>
                          </motion.div>
                        ) : (
                          "Sign up"
                        )}
                      </Button>
                    </div>
                  </Field>
                </FieldGroup>
              </form>
            </Form>

            <div className="text-center flex items-center justify-center gap-1 mx-auto w-fit mt-4 text-sm">
              Already have an account?
              <Link
                href="/login"
                className="hover:underline underline-offset-2 text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <Link href="#" className="hover:underline underline-offset-2 font-medium">Terms of Service</Link> and{" "}
          <Link href="#" className="hover:underline underline-offset-2 font-medium">Privacy Policy</Link>.
        </FieldDescription>
      </motion.div>
    </motion.div>
  );
}
