"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

const Error = ({ error, reset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground"
    >
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-title font-title text-primary-default"
      >
        Oops! 🚨
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-subheading text-muted-foreground mb-6"
      >
        {error.message || "Something went wrong!"}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative w-1/2 mb-8 flex items-center justify-center"
      >
        <Image
          src="https://img.freepik.com/free-vector/funny-error-404-background-design_1167-219.jpg"
          alt="Error Illustration"
          layout="intrinsic"
          width={500}
          height={500}
          className="w-[400px] max-w-[400px] object-contain mix-blend-multiply mx-auto"
        />
      </motion.div>
      <Button
        onClick={() => reset()}
        className="bg-primary-default text-primary-foreground hover:bg-primary-default/90 rounded-md shadow-md hover:shadow-lg transition-all ease-in-out"
      >
        Try Again
      </Button>
    </motion.div>
  );
};

export default Error;