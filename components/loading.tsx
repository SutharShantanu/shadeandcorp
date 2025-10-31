"use client";

import React from "react";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

type LoadingProps = {
  message?: string;
};

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      {/* Backdrop blur + dim */}
      <div className="absolute inset-0 bg-white/30 dark:bg-slate-900/40 backdrop-blur-md" />

      {/* Subtle floating gradient to give a liquid glass feel */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 h-[60vh] w-[60vw] rounded-full bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-40 blur-3xl animate-[float_8s_ease-in-out_infinite] dark:from-slate-200/6 dark:via-slate-400/4" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.26 }}
        className="relative z-10 flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-white/30 bg-white/60 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/50"
      >
        <div className="rounded-full bg-white/40 p-3 dark:bg-slate-800/40">
          <Spinner className="h-6 w-6 text-current" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {message}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Please wait a moment
          </p>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}
