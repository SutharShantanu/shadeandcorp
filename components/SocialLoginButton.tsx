"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { BrandIcon } from "./BrandIcon";
import { Spinner } from "./ui/spinner";

const SocialLoginButtons = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<"google" | "github" | null>(null);

  const handleSocialLogin = async (provider: "google" | "github") => {
    setLoading(provider);
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        console.error(`${provider} sign in error:`, result.error);
        // You can add toast notification here if needed
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <ButtonGroup className="w-full">
      <Button
        type="button"
        variant="outline"
        className="w-1/2"
        onClick={() => handleSocialLogin("google")}
        disabled={loading !== null}
        aria-busy={loading === "google"}
      >
        {loading === "google" ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <BrandIcon
            name="google"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        )}
        <span>Continue with Google</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-1/2"
        onClick={() => handleSocialLogin("github")}
        disabled={loading !== null}
        aria-busy={loading === "github"}
      >
        {loading === "github" ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <BrandIcon
            name="github"
            variant="dark"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        )}
        <span>Continue with GitHub</span>
      </Button>
    </ButtonGroup>
  );
};
export default SocialLoginButtons;
