"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  BadgeCheck,
  ShieldCheck,
  Mars,
  Venus,
  Transgender,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { DropdownDatePicker } from "@/components/ui/dropdown-date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import type { AccountForm, UserProfile } from "@/app/(auth)/hook/useProfile";

import { useAccountTab } from "../hooks/useAccountTab";

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
  const {
    isVerifyingPhone,
    showPhoneOTPModal,
    setShowPhoneOTPModal,
    phoneSessionInfo,
    setPhoneSessionInfo,
    phoneValue,
    isPhoneChanged,
    canVerify,
    handleVerifyPhone,
  } = useAccountTab(form, userProfile);

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
        <form
          onSubmit={onSubmit}
          className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
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
                        <BadgeCheck className="size-4 text-success" />
                        Verified
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="size-4 text-success" />
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
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  >
                    <FormItem className="h-fit">
                      <FieldLabel className="cursor-pointer hover:border-primary transition-all ease-in-out">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle className="flex items-center gap-2">
                              <Mars className="size-4 text-muted-foreground" />
                              Male
                            </FieldTitle>
                          </FieldContent>
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                        </Field>
                      </FieldLabel>
                    </FormItem>
                    <FormItem className="h-fit">
                      <FieldLabel className="cursor-pointer hover:border-primary transition-all ease-in-out">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle className="flex items-center gap-2">
                              <Venus className="size-4 text-muted-foreground" />
                              Female
                            </FieldTitle>
                          </FieldContent>
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                        </Field>
                      </FieldLabel>
                    </FormItem>
                    <FormItem className="h-fit">
                      <FieldLabel className="cursor-pointer hover:border-primary transition-all ease-in-out">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle className="flex items-center gap-2">
                              <Transgender className="size-4 text-muted-foreground" />
                              Other
                            </FieldTitle>
                          </FieldContent>
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                        </Field>
                      </FieldLabel>
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthday</FormLabel>
                <FormControl>
                  <DropdownDatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date: Date | undefined) =>
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }
                    maxDate={new Date()}
                  />
                </FormControl>
                <FormDescription className="mt-2">
                  Your birthday helps us personalize your experience.
                </FormDescription>
                {showErrors && <FormMessage />}
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className=" flex justify-end items-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="size-4" />
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
