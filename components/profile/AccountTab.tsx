"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="Enter phone number"
                  defaultCountry="IN"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Your phone number will be used for account verification and
                security purposes.
              </FormDescription>
              {showErrors && <FormMessage />}
            </FormItem>
          )}
        />

        {/* Country Code */}
        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country Code</FormLabel>
              <Select
                value={field.value || userProfile?.countryCode || "91"}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country code" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="91">+91 (India)</SelectItem>
                  <SelectItem value="1">+1 (USA/Canada)</SelectItem>
                  <SelectItem value="44">+44 (UK)</SelectItem>
                  <SelectItem value="61">+61 (Australia)</SelectItem>
                  <SelectItem value="81">+81 (Japan)</SelectItem>
                  <SelectItem value="86">+86 (China)</SelectItem>
                  <SelectItem value="49">+49 (Germany)</SelectItem>
                  <SelectItem value="33">+33 (France)</SelectItem>
                  <SelectItem value="39">+39 (Italy)</SelectItem>
                  <SelectItem value="34">+34 (Spain)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select your country code for phone number.
              </FormDescription>
              {showErrors && <FormMessage />}
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {showErrors && <FormMessage />}
            </FormItem>
          )}
        />

        {/* Birthday */}
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Your birthday helps us personalize your experience.
              </FormDescription>
              {showErrors && <FormMessage />}
            </FormItem>
          )}
        />

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
  );
}

