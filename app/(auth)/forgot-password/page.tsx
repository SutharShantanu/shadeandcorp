"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AuthImageSide from "@/components/AuthImageSide";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, MailIcon } from "lucide-react";

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
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: ForgotPasswordForm) => {
    setLoading(true);
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve(true), 1500);
      }),
      {
        loading: "Sending OTP...",
        success: "OTP sent to your email!",
        error: "Failed to send OTP.",
      }
    );
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    }, 1500);
  };

  return (
    <motion.div
      className="flex min-h-svh w-full items-center justify-center p-4 relative"
      initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="w-full max-w-5xl flex flex-col md:flex-row justify-between overflow-hidden bg-card/80 backdrop-blur-3xl p-0 z-10">
        
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
                Forgot Password
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Enter your email address and we'll send you a 6-digit OTP to reset your password.
              </p>
            </motion.div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5"
                aria-label="Forgot password form"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FieldGroup>
                    <Field>
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
                                  autoComplete="email"
                                  {...field}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="pt-6">
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
                              <span>Sending OTP...</span>
                            </motion.div>
                          ) : (
                            "Send OTP"
                          )}
                        </Button>
                      </div>
                    </Field>
                  </FieldGroup>
                </motion.div>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="bg-transparent mt-0 flex justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                asChild
                variant="link"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Link href="/login" className="flex items-center">
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back to login
                </Link>
              </Button>
            </motion.div>
          </CardFooter>
        </div>

        <AuthImageSide
          title="Account Recovery"
          description="We'll help you get back securely."
          keywords="password"
          className="max-h-80"
        />
      </Card>
    </motion.div>
  );
}
