"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import ProfilePictureModal from "@/components/profile/shared/ProfilePictureModal";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { ProfileForm, UserProfile } from "@/app/(auth)/hook/useProfile";

interface ProfileTabProps {
  form: ProfileForm;
  loading: boolean;
  showErrors: boolean;
  onSubmit: (e: React.FormEvent) => void;
  userProfile: UserProfile | null;
}

export default function ProfileTab({
  form,
  loading,
  showErrors,
  onSubmit,
  userProfile,
}: ProfileTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePictureSelect = (imageUrl: string) => {
    form.setValue("profilePicture", imageUrl);
  };

  const displayName = userProfile
    ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() || userProfile.firstName || "User"
    : form.watch("firstName") || "User";

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-24">
              <AvatarImage
                src={form.watch("profilePicture") || userProfile?.profilePicture}
                alt={displayName}
              />
              <AvatarFallback className="text-2xl">
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full size-8"
              onClick={() => setIsModalOpen(true)}
            >
              <Camera className="size-4" />
            </Button>
          </div>
          <div>
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground mb-2">
              Click the camera icon to update your profile picture
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              Change Picture
            </Button>
          </div>
        </div>

        {/* First and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                {showErrors && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                {showErrors && <FormMessage />}
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <Select
                value={field.value || userProfile?.email || ""}
                onValueChange={field.onChange}
                disabled
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={field.value || userProfile?.email || ""}>
                    {field.value || userProfile?.email || "N/A"}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your email settings.
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
              "Update profile"
            )}
          </Button>
        </div>

        {/* Profile Picture Modal */}
        <ProfilePictureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentPicture={form.watch("profilePicture") || userProfile?.profilePicture}
          onSelect={handlePictureSelect}
          displayName={displayName}
        />
      </form>
    </Form>
  );
}
