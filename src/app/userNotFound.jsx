"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const UserNotFound = () => {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 p-6 bg-background text-foreground"
        >
            {/* Image Section */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full md:w-1/2 flex justify-center"
            >
                <Image
                    src="https://img.freepik.com/free-vector/removing-goods-from-basket-refusing-purchase-changing-decision-item-deletion-emptying-trash-online-shopping-app-vector-isolated-concept-metaphor-illustration_335657-2843.jpg"
                    alt="Access denied"
                    width={500}
                    height={500}
                    className="max-w-full h-auto object-cover mix-blend-multiply"
                    priority
                />
            </motion.div>

            {/* Text and Button Section */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-3xl font-bold mb-4"
                >
                    Hold On There!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-lg mb-8 max-w-md"
                >
                    You need to be logged in to view this content. Please sign in to continue.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 mb-6"
                >
                    <Button
                        size="sm"
                        className="w-full bg-primary-default text-primary-foreground rounded-xs hover:bg-primary-default/80 focus:bg-primary-default/90 focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:outline-none cursor-pointer"
                        aria-label="Login"
                        onClick={() => router.push("/login")}
                    >
                        Login
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-primary-default text-primary-default rounded-xs hover:bg-primary-foreground/80 hover:text-primary-default/80  hover:border-primary-default/80 focus:bg-primary-default/90 focus:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:outline-none transition-colors cursor-pointer"
                        aria-label="Sign Up"
                        onClick={() => router.push("/signup")}
                    >
                        Sign Up
                    </Button>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    className="text-sm text-muted-foreground"
                >
                    Trouble accessing your account?{" "}
                    <span
                        className="text-primary-default cursor-pointer hover:underline"
                        onClick={() => router.push("/help")}
                    >
                        Get help
                    </span>
                </motion.p>
            </div>
        </motion.div>
    );
};

export default UserNotFound;
