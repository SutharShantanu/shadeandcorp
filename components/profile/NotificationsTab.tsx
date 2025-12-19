"use client";

import { Bell, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";

interface NotificationsTabProps {
  userProfile: UserProfile | null;
}

export default function NotificationsTab({ userProfile }: NotificationsTabProps) {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Preferences</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your notifications and appearance preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose what notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Notification settings will be available soon.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the application looks to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Select your preferred theme for the application.
            </p>
            <div className="flex gap-4">
              <ThemeToggle />
            </div>
          </div>
        </CardContent>
      </Card>
    </div >
  );
}

