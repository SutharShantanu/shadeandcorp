"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation is required"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/signup", data);
      toast.success("Signup successful!");
      console.log(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div className="w-full max-w-sm md:max-w-4xl bg-primary-foreground rounded-md border-border shadow-md grid md:grid-cols-2 space-6 gap-6">
        <Card className="overflow-hidden border-none shadow-none border border-border">
          <CardContent className="">
            <Form {...form} className="p-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 space-x-3"
              >
                <div className="flex flex-col items-center text-center my-4">
                  <h1 className="font-forum text-heading">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">
                    Login to your Shade & Co. Inc account
                  </p>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} className="" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Last Name (Optional) */}
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} className="" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="user@example.com"
                          {...field}
                          className=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                          className=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                          className=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 ">
                      <FormControl>
                        <Checkbox {...field} />
                      </FormControl>
                      <FormLabel className=" text-balance text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                        I agree to the{" "}
                        <Link href="#" className="underline">
                          Terms & Conditions
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary-default text-primary-foreground rounded-md hover:bg-primary-default/80"
                >
                  Sign Up
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="relative hidden bg-muted md:block rounded-tr-lg rounded-br-lg">
          <Image
            src="https://picsum.photos/2000/2000"
            alt="Image"
            width={500}
            height={500}
            className="absolute inset-0 h-full w-full object-cover rounded-tr-lg rounded-br-lg dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
