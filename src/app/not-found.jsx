"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const NotFound = () => {
  const router = useRouter();
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
        className="text-title font-title mb-4"
      >
        404 - Oops, You Took a Wrong Turn!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-description font-description mb-8"
      >
        The page you're looking for doesn't exist. Maybe it's on vacation?
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="w-1/2 mb-8"
      >
        <Image
          src="https://img.freepik.com/free-vector/error-404-concept-illustration_114360-1811.jpg"
          alt="Not Found"
          layout="responsive"
          width={500}
          height={500}
          className="w-[600px] max-w-[600px] object-cover mix-blend-multiply mx-auto"
        />
      </motion.div>
      <Button
        onClick={() => router.push("/")}
        className=" bg-primary-default text-primary-foreground hover:bg-primary-default/90 rounded-xs shadow-md hover:shadow-lg transition-all ease-in-out"
      >
        Go to Home
      </Button>
    </motion.div>
  );
};

export default NotFound;
