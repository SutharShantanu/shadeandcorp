"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Github, Mail, Link2, CheckCircle2, XCircle } from "lucide-react";
import { BrandIcon } from "@/components/BrandIcon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";

interface ConnectedAccountsTabProps {
  userProfile: UserProfile | null;
}

export default function ConnectedAccountsTab({ userProfile }: ConnectedAccountsTabProps) {
  const { data: session } = useSession();
  const [connecting, setConnecting] = useState<string | null>(null);

  const currentProvider = session?.user?.provider || "credentials";
  const isGoogleConnected = currentProvider === "google";
  const isGitHubConnected = currentProvider === "github";
  const isEmailConnected = currentProvider === "credentials";

  const handleConnect = async (provider: "google" | "github") => {
    setConnecting(provider);
    try {
      await signIn(provider, { callbackUrl: "/profile" });
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error);
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Connected Accounts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your social account connections. Connect your accounts to sign in faster.
        </p>
      </div>

      <div className="space-y-4">
        {/* Google Account */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-lg bg-white border">
                  <BrandIcon
                    name="google"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Google</h4>
                  <p className="text-sm text-muted-foreground">
                    {isGoogleConnected
                      ? `Connected as ${session?.user?.email}`
                      : "Connect your Google account"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isGoogleConnected ? (
                  <>
                    <CheckCircle2 className="size-5 text-green-600" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // In a real app, you'd implement disconnect functionality
                        alert("Disconnect functionality will be implemented");
                      }}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnect("google")}
                    disabled={connecting === "google"}
                  >
                    {connecting === "google" ? "Connecting..." : "Connect"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GitHub Account */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-lg bg-white border">
                  <BrandIcon
                    name="github"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h4 className="font-semibold">GitHub</h4>
                  <p className="text-sm text-muted-foreground">
                    {isGitHubConnected
                      ? `Connected as ${session?.user?.email}`
                      : "Connect your GitHub account"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isGitHubConnected ? (
                  <>
                    <CheckCircle2 className="size-5 text-green-600" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert("Disconnect functionality will be implemented");
                      }}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnect("github")}
                    disabled={connecting === "github"}
                  >
                    {connecting === "github" ? "Connecting..." : "Connect"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Account */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-lg bg-muted">
                  <Mail className="size-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Email & Password</h4>
                  <p className="text-sm text-muted-foreground">
                    {isEmailConnected
                      ? `Connected as ${session?.user?.email}`
                      : "Your primary email account"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isEmailConnected && (
                  <>
                    <CheckCircle2 className="size-5 text-green-600" />
                    <span className="text-sm text-muted-foreground">Primary</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Connecting multiple accounts allows you to sign in using any of them.
            Your account data will remain the same regardless of which method you use to sign in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

