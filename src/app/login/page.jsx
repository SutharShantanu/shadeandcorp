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
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLogin } from "./hook/useLogin";
import { useAuthInfo } from "@/hook/useAuthInfo";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useEffect } from "react";

const FormInput = ({ name, label, type, placeholder, control, Component = Input }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor={name}>{label}</FormLabel>
                <FormControl>
                    <motion.div whileFocus={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Component
                            id={name}
                            aria-label={label}
                            aria-required="true"
                            type={type}
                            placeholder={placeholder}
                            {...field}
                        />
                    </motion.div>
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
                    <motion.div whileFocus={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <PasswordInput
                            id={name}
                            aria-label={label}
                            aria-required="true"
                            {...field}
                        />
                    </motion.div>
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
                <Link href="#" className="self-center font-medium">
                    Shade & Co.
                </Link>
                <Card className="w-full max-w-lg p-8 rounded-xs shadow-md">
                    <CardContent className="p-0">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-3"
                                aria-label="Login form"
                            >
                                <motion.div
                                    className="text-center my-4"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h1 className="text-heading font-forum">Welcome Back</h1>
                                    <p className="text-muted-foreground">Login to your account</p>
                                </motion.div>

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
                                        className="hover:underline underline-offset-2 text-small"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    aria-busy={loading}
                                    aria-label="Login"
                                    variant="gooeyRight"
                                    className="w-full bg-primary-default text-primary-foreground rounded-xs hover:bg-primary-default/80"
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
                        <div className="text-center mt-4 text-small">
                            Don't have an account?{" "}
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
