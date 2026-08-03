import { useState } from "react";
import { toast } from "sonner";
import { setupRecaptcha } from "@/lib/infrastructure/firebaseClient";
import type { AccountForm, UserProfile } from "@/app/(auth)/hook/useProfile";

export function useAccountTab(form: AccountForm, userProfile: UserProfile | null) {
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [showPhoneOTPModal, setShowPhoneOTPModal] = useState(false);
  const [phoneSessionInfo, setPhoneSessionInfo] = useState<string | null>(null);

  const phoneValue = form.watch("phone");
  const isPhoneValid = phoneValue && phoneValue.length >= 10;
  const isPhoneChanged = phoneValue !== userProfile?.phone;
  const canVerify = isPhoneValid && (isPhoneChanged || !userProfile?.isPhoneVerified);

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
      } catch (e) { }

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
          // If phone changed, we need to pass the new phone number
          phone: phoneValue,
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
    isVerifyingPhone,
    showPhoneOTPModal,
    setShowPhoneOTPModal,
    phoneSessionInfo,
    setPhoneSessionInfo,
    phoneValue,
    isPhoneChanged,
    canVerify,
    handleVerifyPhone,
  };
}
