"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function SettingsPage() {
  const [featuredBadgeText, setFeaturedBadgeText] = useState("Featured Collection");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings?key=featuredBadgeText")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFeaturedBadgeText(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "featuredBadgeText", value: featuredBadgeText }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
          <CardDescription>Manage dynamic text and configuration for your site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Featured Collection Badge Text
            </label>
            <Input 
              value={featuredBadgeText} 
              onChange={(e) => setFeaturedBadgeText(e.target.value)} 
              placeholder="e.g. Featured Collection"
              className="max-w-md"
            />
            <p className="text-[0.8rem] text-muted-foreground">
              This text appears on the dropdown menu in the navigation bar.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
