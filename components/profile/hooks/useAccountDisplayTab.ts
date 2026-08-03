import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { setupRecaptcha } from "@/lib/infrastructure/firebaseClient";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";

export function useAccountDisplayTab(userProfile: UserProfile | null) {
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [showPhoneOTPModal, setShowPhoneOTPModal] = useState(false);
  const [phoneSessionInfo, setPhoneSessionInfo] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Check URL parameter on mount to restore modal state
  useEffect(() => {
    const isVerifyingEmail = searchParams.get("verifying-email") === "true";
    if (isVerifyingEmail && !userProfile?.isEmailVerified) {
      setShowOTPModal(true);
    }

    const isVerifyingPhone = searchParams.get("verifying-phone") === "true";
    if (isVerifyingPhone && !userProfile?.isPhoneVerified) {
      setShowPhoneOTPModal(true);
    }
  }, [
    searchParams,
    userProfile?.isEmailVerified,
    userProfile?.isPhoneVerified,
  ]);

  const handleVerifyEmail = async () => {
    setIsVerifyingEmail(true);
    const toastId = toast.loading("Sending verification email...");

    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "email" }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to send verification email", {
          id: toastId,
        });
        return;
      }

      toast.success("Verification email sent! Check your inbox.", {
        id: toastId,
      });
      // Open the OTP modal after successfully sending the email
      setShowOTPModal(true);
    } catch (error) {
      console.error("Email verification error:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleVerifyPhone = async () => {
    setIsVerifyingPhone(true);
    const toastId = toast.loading("Initializing verification...");

    try {
      // 1. Setup reCAPTCHA container if not exists
      let recaptchaContainer = document.getElementById("recaptcha-container");
      if (!recaptchaContainer) {
        recaptchaContainer = document.createElement("div");
        recaptchaContainer.id = "recaptcha-container";
        recaptchaContainer.style.display = "none";
        document.body.appendChild(recaptchaContainer);
      }

      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;

      if (!appVerifier) {
        throw new Error("reCAPTCHA failed to initialize");
      }

      // 2. Clear previous reCAPTCHA if any
      try {
        appVerifier.clear();
      } catch (e) {}

      // 3. Render reCAPTCHA and get token
      const recaptchaToken = await appVerifier.verify();

      toast.loading("Sending verification SMS...", { id: toastId });

      // 4. Call our consolidated API
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "phone",
          recaptchaToken: recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to send verification SMS", {
          id: toastId,
        });
        return;
      }

      toast.success("Verification SMS sent! Check your phone.", {
        id: toastId,
      });

      // 5. Store sessionInfo and open modal
      setPhoneSessionInfo(data.sessionInfo);
      setShowPhoneOTPModal(true);
    } catch (error: any) {
      console.error("Phone verification error:", error);
      toast.error(
        error.message || "An unexpected error occurred. Please try again.",
        { id: toastId }
      );
    } finally {
      setIsVerifyingPhone(false);
    }
  };

  return {
    isVerifyingEmail,
    showOTPModal,
    setShowOTPModal,
    isVerifyingPhone,
    showPhoneOTPModal,
    setShowPhoneOTPModal,
    phoneSessionInfo,
    setPhoneSessionInfo,
    handleVerifyEmail,
    handleVerifyPhone,
  };
}
