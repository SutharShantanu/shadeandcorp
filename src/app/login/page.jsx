"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const FormInput = ({ name, label, type, placeholder, control, Component = Input }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <motion.div
                        whileFocus={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Component type={type} placeholder={placeholder} {...field} />
                    </motion.div>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

const PasswordField = ({ name, label, control }) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <motion.div
                            whileFocus={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <PasswordInput {...field} />
                        </motion.div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const Login = () => {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post("/api/login", data);
            if (response.status === 200) {
                toast.success("Login successful!");
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="flex min-h-svh flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            <motion.div
                className="flex w-full max-w-lg flex-col gap-y-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}>
                <Link href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-xs bg-primary text-primary-foreground">
                        {/* <GalleryVerticalEnd className="size-4" /> */}
                    </div>
                    Shade & Co.
                </Link>
                <Card className="w-full max-w-lg p-8 rounded-xs overflow-hidden border-border shadow-md">
                    <CardContent className="p-0">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                <motion.div
                                    className="flex flex-col items-center text-center my-4"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h1 className="font-forum text-heading text-center">Welcome Back</h1>
                                    <p className="text-muted-foreground text-center">Login to your account</p>
                                </motion.div>
                                <div className="flex gap-4">
                                    <Button size="icon" className="w-full bg-primary-default text-primary-foreground rounded-xs hover:bg-primary-default/80">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2443" height="2500" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google">
                                            <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                            <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                            <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                                            <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                                        </svg> Google
                                    </Button>
                                    <Button size="icon" className="w-full bg-primary-default text-primary-foreground rounded-xs hover:bg-primary-default/80">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" id="facebook">
                                            <path fill="#1877f2" d="M1024,512C1024,229.23016,794.76978,0,512,0S0,229.23016,0,512c0,255.554,187.231,467.37012,432,505.77777V660H302V512H432V399.2C432,270.87982,508.43854,200,625.38922,200,681.40765,200,740,210,740,210V336H675.43713C611.83508,336,592,375.46667,592,415.95728V512H734L711.3,660H592v357.77777C836.769,979.37012,1024,767.554,1024,512Z"></path>
                                            <path fill="#fff" d="M711.3,660,734,512H592V415.95728C592,375.46667,611.83508,336,675.43713,336H740V210s-58.59235-10-114.61078-10C508.43854,200,432,270.87982,432,399.2V512H302V660H432v357.77777a517.39619,517.39619,0,0,0,160,0V660Z"></path>
                                        </svg> Facebook
                                    </Button>
                                </div>
                                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                                <FormInput name="email" label="Email Address" type="email" placeholder="User@example.com" control={form.control} />
                                <PasswordField name="password" label="Password" type="password" placeholder="******" control={form.control} Component={PasswordInput} />
                                <div className="flex justify-end text-muted-foreground">
                                    <Link href="/forgot-password" className="text-muted-foreground hover:underline underline-offset-2 text-small ">Forgot Password?</Link>
                                </div>
                                <Button type="submit" className="w-full bg-primary-default text-primary-foreground rounded-xs hover:bg-primary-default/80" disabled={loading} aria-busy={loading}>
                                    {loading ? (
                                        <>
                                            <span>Logging in...</span>
                                            <Spinner />
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </form>
                        </Form>
                        <div className="text-center mt-4 text-small">
                            Don't have an account? <Link href="/signup" className="text-primary-default underline underline-offset-2">Sign Up</Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default Login;
