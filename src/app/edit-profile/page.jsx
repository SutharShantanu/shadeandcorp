"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEditProfile } from "./hook/useEditProfille";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { useAuthInfo } from "@/hook/useAuthInfo";
import { useRouter, useSearchParams } from "next/navigation";
import UserNotFound from "../userNotFound";
import Loading from "@/components/loading";
import Error from "../error";
import AnimatedTabs from "@/components/ui/animated-tabs";
import { motion } from "framer-motion";
import {
  EditProfileTabEnum,
  personalFields,
  addressFields,
  FieldInputState,
  editProfileTabs,
  personalFieldInputTypes,
  addressFieldInputTypes,
  DefaultInputTypes,
  InputState,
} from "./enums/profile.enums";
import { useProfile } from "../profile/hook/useProfile";
import { Spinner } from "@/components/ui/spinner";
import { PasswordField } from "@/components/common/password";
import { cn } from "@/lib/utils";

const RenderInputField = ({
  form,
  name,
  label,
  placeholder,
  type = DefaultInputTypes.TEXT,
  componentProps = {},
  state = InputState.DEFAULT,
}) => {
  const isReadOnly = state === InputState.READONLY;
  const isDisabled = state === InputState.DISABLED;

  let Component;
  switch (type) {
    case DefaultInputTypes.PHONE:
      Component = PhoneInput;
      break;
    case DefaultInputTypes.PASSWORD:
      Component = PasswordField;
      break;
    default:
      Component = Input;
  }

  label = name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const commonProps = {
          ...field,
          placeholder: placeholder || `Enter ${name}`,
          readOnly: isReadOnly,
          disabled: isDisabled,
          className: cn(
            "bg-primary-foreground",
            isReadOnly && "bg-gray-100 cursor-not-allowed text-gray-600",
            isDisabled && "opacity-50 cursor-not-allowed",
            componentProps.className
          ),
        };

        const phoneProps =
          type === DefaultInputTypes.PHONE
            ? {
                defaultCountry: componentProps.defaultCountry,
                countryCallingCodeEditable:
                  componentProps.countryCallingCodeEditable,
                international: componentProps.international,
              }
            : {};

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <motion.div
                whileFocus={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {type === DefaultInputTypes.PHONE ? (
                  <Component {...commonProps} {...phoneProps} />
                ) : (
                  <Component {...commonProps} />
                )}
              </motion.div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default function EditProfile() {
  const { user: authUser } = useAuthInfo();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const userId = authUser?.id;
  const {
    user: profileData,
    isLoading,
    error: profileError,
  } = useProfile(userId);
  const activeTabValue = editProfileTabs[selectedTabIndex]?.value;
  const { form, onSubmit, loading, error, countryCode } = useEditProfile(
    profileData,
    userId,
    activeTabValue
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const index = editProfileTabs.findIndex((tab) => tab.value === tabParam);

    if (index >= 0) {
      setSelectedTabIndex(index);
    } else {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("tab", editProfileTabs[0].value);
      router.push(`?${current.toString()}`, undefined, { scroll: false });
      setSelectedTabIndex(0);
    }
  }, [searchParams, router]);

  if (!authUser) return <UserNotFound />;
  if (loading || isLoading) return <Loading />;
  if (error || profileError) return <Error error={error} />;

  const handleTabChange = (index) => {
    if (!editProfileTabs[index]) return;

    setSelectedTabIndex(index);
    const newTabValue = editProfileTabs[index].value;

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("tab", newTabValue);
    router.replace(`?${current.toString()}`, { scroll: false });
  };

  const handleSubmitWithVisibleFields = (data) => {
    let fieldsToValidate = [];

    switch (editProfileTabs[selectedTabIndex]?.value) {
      case EditProfileTabEnum.PERSONAL_INFO:
        fieldsToValidate = personalFields.concat(["gender", "birthday"]);
        break;
      case EditProfileTabEnum.ADDRESSES:
        fieldsToValidate = addressFields;
        break;
      case EditProfileTabEnum.ACCOUNT_SETTINGS:
        fieldsToValidate = ["newPassword", "confirmPassword"];
        break;
      default:
        fieldsToValidate = [];
    }

    const filteredData = fieldsToValidate.reduce((acc, key) => {
      if (data[key] !== undefined) acc[key] = data[key];
      return acc;
    }, {});


    return onSubmit(filteredData);
  };

  const renderTabContent = (tab) => {
    switch (tab.value) {
      case EditProfileTabEnum.PERSONAL_INFO:
        return (
          <Form
            {...form}
            onSubmit={form.handleSubmit(handleSubmitWithVisibleFields)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalFields.map((field) => (
                <RenderInputField
                  key={field}
                  form={form}
                  name={field}
                  type={personalFieldInputTypes[field]}
                  state={FieldInputState[field]}
                  componentProps={{
                    defaultCountry: countryCode,
                    countryCallingCodeEditable: false,
                    international: true,
                  }}
                />
              ))}

              <div className="sm:grid sm:grid-cols-2 col-span-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthday</FormLabel>
                      <DatePicker
                        date={""}
                        setDate={field.onChange}
                        btnClassName="w-full justify-normal"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="border border-border bg-primary-default flex items-center gap-2 w-fit"
            >
              {loading ? (
                <motion.div className="flex items-center gap-1">
                  <Spinner className="h-4 w-4" />
                  <span>Saving...</span>
                </motion.div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </Form>
        );

      case EditProfileTabEnum.ADDRESSES:
        return (
          <Form
            {...form}
            onSubmit={form.handleSubmit(handleSubmitWithVisibleFields)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addressFields.map((field) => (
                <RenderInputField
                  key={field}
                  form={form}
                  name={field}
                  type={addressFieldInputTypes[field] || "text"}
                  state={FieldInputState[field]}
                />
              ))}
            </div>

            <Button type="submit" >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Form>
        );

      case EditProfileTabEnum.PAYMENT_METHODS:
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">Manage your Payment Methods.</p>
          </div>
        );

      case EditProfileTabEnum.LOGIN_ACTIVITY:
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">Your Login Activity:</p>
            {/* List devices + Add map here */}
          </div>
        );

      case EditProfileTabEnum.NOTIFICATIONS:
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">Notification Preferences:</p>
            {/* Notification toggles here */}
          </div>
        );

      case EditProfileTabEnum.ACCOUNT_SETTINGS:
        return (
          <Form
            {...form}
            onSubmit={form.handleSubmit(handleSubmitWithVisibleFields)}
          >
            <div className="space-y-4">
              <p className="text-lg font-medium">Account Settings:</p>
              <div className="space-y-4">
                <p className="text-lg font-medium">Change Password</p>
                <PasswordField
                  name="newPassword"
                  label="New Password"
                  control={form.control}
                  description="Use at least 8 characters with numbers and letters."
                  placeholder="Enter new password"
                  required
                />
                <PasswordField
                  name="confirmPassword"
                  label="Confirm Password"
                  control={form.control}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <Button type="submit" >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div className="py-4 sm:py-6 px-4 sm:px-0 container max-w-[95%] 2xl:max-w-[96rem] mx-auto">
      <AnimatedTabs
        tabs={editProfileTabs}
        renderTabContent={renderTabContent}
        selectedTabIndex={selectedTabIndex}
        setSelectedTab={handleTabChange}
      />
    </motion.div>
  );
}
