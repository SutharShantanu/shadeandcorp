"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Copy } from "lucide-react";

const Error = ({ error, reset, originPath }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(error.message || "Something went wrong!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        className="text-title font-forum text-primary-default my-4"
      >
        Oops! 🚨
      </motion.h1>

      <div className="flex flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 bg-primary-foreground border- shadow-md px-4 py-3 rounded-md my-2 max-w-[80vw]"
        >
          <span className="text-destructive-default text-title p-3">
            {error.message || "Something went wrong!"}
          </span>
          {originPath && (
            <span className="text-xs text-muted-foreground">
              Error originated from:{" "}
              <span className="font-medium text-foreground">{originPath}</span>
            </span>
          )}
        </motion.div>

        <Button
          onClick={handleCopy}
          as={motion.button}
          initial={{ width: "40px" }}
          animate={{ width: copied ? "110px" : "40px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center justify-center p-4 rounded-full bg-primary-default hover:bg-primary-default/80 hover:scale-105 transition-all ease-in-out shadow-md"
        >
          {copied ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium text-primary-foreground"
            >
              Copied ✅
            </motion.span>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Copy className="w-4 h-4 text-primary-foreground transition-all ease-in-out" />
            </motion.div>
          )}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative w-1/2 flex items-center justify-center"
      >
        <Image
          src="https://img.freepik.com/free-vector/tiny-people-examining-operating-system-error-warning-web-page-isolated-flat-illustration_74855-11104.jpg"
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
