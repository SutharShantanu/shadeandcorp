"use client";

import { Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";

interface NotificationsTabProps {
  userProfile: UserProfile | null;
}

export default function NotificationsTab({ userProfile }: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your notification preferences.
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
    </div>
  );
}

