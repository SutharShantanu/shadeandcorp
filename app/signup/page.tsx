"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { useSignup } from "./hook/useSignup";
import { Control, FieldValues } from "react-hook-form";

type FormFieldWrapperProps<T extends FieldValues> = {
  control: Control<T>;
  name: keyof T;
  label: string;
  placeholder?: string;
  component?: React.ElementType;
  [x: string]: any;
};

const FormFieldWrapper = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  component: Component = Input,
  ...rest
}: FormFieldWrapperProps<T>) => (
  <FormField
    control={control}
    name={name as string}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <motion.div
            whileFocus={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Component {...field} placeholder={placeholder} {...rest} />
          </motion.div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);


const OAUTH_PROVIDERS = [
  {
    name: "Google",
    icon: "https://cdn-icons-png.flaticon.com/64/281/281764.png",
  },
  {
    name: "Github",
    icon: "https://cdn-icons-png.flaticon.com/64/2111/2111432.png",
  },
];

const Signup = () => {
  const { form, loading, countryCode, onSubmit } = useSignup();

  const FIELDS = [
    { name: "firstName", label: "First Name", placeholder: "First" },
    { name: "lastName", label: "Last Name", placeholder: "Last (Optional)" },
    {
      name: "email",
      label: "Email Address",
      placeholder: "user@example.com",
      type: "email",
    },
    {
      name: "phone",
      label: "Phone Number",
      component: PhoneInput,
      defaultCountry: countryCode,
      countryCallingCodeEditable: false,
      international: true,
      placeholder: "Enter phone number",
    },
    {
      name: "password",
      label: "Password",
      component: PasswordInput,
      placeholder: "******",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      component: PasswordInput,
      placeholder: "******",
    },
  ];

  return (
    <motion.div
      className="flex min-h-svh flex-col items-center justify-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="w-full max-w-sm md:max-w-3xl lg:max-w-6xl bg-primary-foreground rounded-xs border-border shadow-md grid md:grid-cols-2"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="overflow-hidden border-none shadow-none p-8">
          <CardContent className="p-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                {/* Title */}
                <motion.div
                  className="flex flex-col items-center text-center my-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="font-forum text-heading">Join Shade & Co.</h1>
                  <p className="text-muted-foreground">
                    Create an account to start shopping the latest fashion
                    trends
                  </p>
                </motion.div>

                <Separator />

                {/* Render Fields */}
                {/* Render Fields */}
                <div className="flex flex-col gap-y-3 justify-between">
                  {FIELDS.reduce((rows, field, index) => {
                    if (index % 2 === 0) {
                      rows.push([field, FIELDS[index + 1]]); // group pairs
                    }
                    return rows;
                  }, [] as (typeof FIELDS)[])
                    .map((pair, rowIndex) => (
                      <div key={rowIndex} className="flex gap-2">
                        {pair.map(
                          (f) =>
                            f && (
                              <FormFieldWrapper
                                key={f.name}
                                control={form.control}
                                {...f}
                              />
                            )
                        )}
                      </div>
                    ))}
                </div>

                {/* Terms Checkbox */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="space-y-0 flex flex-wrap items-center">
                      <div className="flex items-center gap-x-2 w-full">
                        <FormControl>
                          <Checkbox
                            id="terms"
                            checked={field.value || false}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="terms"
                          className="text-xs text-muted-foreground [&_a]:underline [&_a]:hover:text-primary cursor-pointer"
                        >
                          I agree to the{" "}
                          <Link href="#">Terms & Conditions</Link>
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <span>Signing Up...</span>
                      <Spinner />
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>

                {/* OAuth Divider */}
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>

                {/* OAuth Buttons */}
                <div className="flex justify-center gap-3">
                  {OAUTH_PROVIDERS.map((provider) => (
                    <Button
                      key={provider.name}
                      size="icon"
                      variant="outline"
                      className="w-1/2 flex items-center gap-2"
                    >
                      <Image
                        src={provider.icon}
                        alt={`${provider.name}-logo`}
                        width={20}
                        height={20}
                      />
                      {provider.name}
                    </Button>
                  ))}
                </div>

                {/* Login Link */}
                <div className="text-center text-small">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-2">
                    Login
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Side Image */}
        <div className="relative hidden bg-muted md:block rounded-tr-lg rounded-br-lg">
          <Image
            src="https://picsum.photos/2000/2000"
            alt="Signup illustration"
            width={500}
            height={500}
            className="absolute inset-0 h-full w-full object-cover rounded-tr-lg rounded-br-lg dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
