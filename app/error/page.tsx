"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RotateCcw, HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const ERROR_MAP = {
  AccessDenied: {
    title: "Access Denied",
    summary: "You don’t have permission to sign in.",
    details: [
      "Your account may be suspended or restricted",
      "You previously signed up using a different provider",
      "The authentication provider rejected the request",
    ],
  },
  Verification: {
    title: "Verification Failed",
    summary: "This verification link is no longer valid.",
    details: [
      "The link may have expired",
      "The link may have already been used",
    ],
  },
  Configuration: {
    title: "Server Configuration Error",
    summary: "We ran into a system issue while signing you in.",
    details: [
      "This is a server-side issue",
      "Please try again later or contact support",
    ],
  },
  OAuthAccountNotLinked: {
    title: "Account Not Linked",
    summary: "This email is already associated with another sign-in method.",
    details: ["Use the same provider you originally signed up with"],
  },
  OAuthCreateError: {
    title: "Account Creation Failed",
    summary: "We couldn't create your account automatically.",
    details: [
      "Your social profile might be missing required information",
      "Try signing up with email and password instead",
    ],
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorData =
    (error && ERROR_MAP[error as keyof typeof ERROR_MAP]) || null;

  return (
    <motion.div
      className="flex min-h-svh items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className="w-full max-w-md border-muted/40 shadow-xl">
        <CardHeader className="text-center space-y-3">
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>

          <CardTitle className="text-2xl">
            {errorData?.title ?? "Authentication Error"}
          </CardTitle>

          <CardDescription className="text-base">
            {errorData?.summary ??
              "Something went wrong while trying to sign you in."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorData?.details && (
            <ul className="space-y-2 rounded-lg border bg-muted/40 p-4 text-sm">
              {errorData.details.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {error && !ERROR_MAP[error as keyof typeof ERROR_MAP] && (
            <>
              <Separator />
              <div className="rounded-md bg-muted/50 px-3 py-2 text-center text-xs font-mono text-muted-foreground">
                Error Code: {error}
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="w-full sm:w-auto min-w-1/2">
            <Link href="/login">
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto min-w-1/2"
          >
            <Link href="/">
              <Home className=" h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </CardFooter>

        {/* Support hint */}
        <div className="pb-5 text-center text-xs text-muted-foreground">
          Still stuck?{" "}
          <Link href="/contact" className="underline underline-offset-4">
            Contact support
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
          Loading error details…
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
