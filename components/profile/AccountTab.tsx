"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, BadgeCheck, ShieldCheck, Mars, Venus, Transgender } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { setupRecaptcha } from "@/lib/firebaseClient";
import VerifyPhoneModal from "@/components/modal/VerifyPhoneModal";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import type { AccountForm, UserProfile } from "@/app/(auth)/hook/useProfile";

interface AccountTabProps {
  form: AccountForm;
  loading: boolean;
  showErrors: boolean;
  onSubmit: (e: React.FormEvent) => void;
  userProfile: UserProfile | null;
}

export default function AccountTab({
  form,
  loading,
  showErrors,
  onSubmit,
  userProfile,
}: AccountTabProps) {
  const [isVerifyingPhone, setIsVerifyingPhone] = React.useState(false);
  const [showPhoneOTPModal, setShowPhoneOTPModal] = React.useState(false);
  const [phoneSessionInfo, setPhoneSessionInfo] = React.useState<string | null>(null);

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

  return (
    <>
      <VerifyPhoneModal
        open={showPhoneOTPModal}
        onOpenChange={setShowPhoneOTPModal}
        phone={phoneValue || ""}
        sessionInfo={phoneSessionInfo}
        onSessionInfoUpdate={setPhoneSessionInfo}
      />
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <div className="flex gap-2">
                  <FormControl className="flex items-center gap-1">
                    <PhoneInput
                      placeholder="Enter phone number"
                      defaultCountry="IN"
                      className="w-full"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleVerifyPhone}
                    disabled={!canVerify || isVerifyingPhone}
                  >
                    {isVerifyingPhone ? (
                      <Spinner className="size-4" />
                    ) : userProfile?.isPhoneVerified && !isPhoneChanged ? (
                      <>
                        <BadgeCheck className="size-4" />
                        Verified
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="size-4" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
                <FormDescription>
                  Your phone number will be used for account verification and
                  security purposes.
                </FormDescription>
                {showErrors && <FormMessage />}
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-1">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-3"
                    >
                      <FormItem className="flex items-center space-x-0 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" className="sr-only" />
                        </FormControl>
                        <FormLabel className={cn(
                          "flex items-center gap-2 rounded-full border px-4 py-2 font-normal transition-all cursor-pointer hover:bg-accent/50",
                          field.value === "male"
                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                            : "border-input bg-background"
                        )}>
                          <Mars className="size-4" />
                          Male
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-0 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" className="sr-only" />
                        </FormControl>
                        <FormLabel className={cn(
                          "flex items-center gap-2 rounded-full border px-4 py-2 font-normal transition-all cursor-pointer hover:bg-accent/50",
                          field.value === "female"
                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                            : "border-input bg-background"
                        )}>
                          <Venus className="size-4" />
                          Female
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-0 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" className="sr-only" />
                        </FormControl>
                        <FormLabel className={cn(
                          "flex items-center gap-2 rounded-full border px-4 py-2 font-normal transition-all cursor-pointer hover:bg-accent/50",
                          field.value === "other"
                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                            : "border-input bg-background"
                        )}>
                          <Transgender className="size-4" />
                          Other
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  {showErrors && <FormMessage />}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => {
                const [month, setMonth] = React.useState<Date>(
                  field.value ? new Date(field.value) : new Date()
                );

                return (
                  <FormItem className="flex flex-col w-fit">
                    <FormLabel>Birthday</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                          month={month}
                          onMonthChange={setMonth}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                          startMonth={new Date(1900, 0)}
                          endMonth={new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your birthday helps us personalize your experience.
                    </FormDescription>
                    {showErrors && <FormMessage />}
                  </FormItem>
                );
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="size-4 mr-2" />
                  Updating...
                </>
              ) : (
                "Update account"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

