"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
          render={({ field }) => {
            const [month, setMonth] = React.useState<Date>(
              field.value ? new Date(field.value) : new Date()
            );

            return (
              <FormItem className="flex flex-col">
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

