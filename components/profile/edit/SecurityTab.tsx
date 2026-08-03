"use client";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExpandableButton, SlidingButton } from "@/components/extended/button";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from "@/components/ui/item";
import {
  LogOut,
  KeyRound,
  Trash2,
  CircleX,
  CircleCheck,
  BadgeCheck,
  BadgePlus,
  Unlink,
} from "lucide-react";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { IconBadge } from "@/components/ui/icon-badge";
import Link from "next/link";
import {
  useSecurity,
  parseDeviceInfo,
  type Session,
} from "../hooks/useSecurity";
import { Dot } from "@/components/ui/dot";

interface SecurityTabProps {
  userProfile: UserProfile | null;
  onLogoutSession?: (
    index: number,
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  onLogoutAllSessions?: () => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
}

export default function SecurityTab({
  userProfile,
  onLogoutSession,
  onLogoutAllSessions,
}: SecurityTabProps) {
  const {
    changePasswordOpen,
    setChangePasswordOpen,
    deleteSessionId,
    setDeleteSessionId,
    deleteAccountOpen,
    setDeleteAccountOpen,
    isChangingPassword,
    revokeProvider,
    setRevokeProvider,
    isRevoking,
    connectingProvider,
    setConnectingProvider,
    disconnectBlockedOpen,
    setDisconnectBlockedOpen,
    sortedSessions,
    connectedCount,
    connectedAccounts,
    form,
    canSubmit,
    handleRevokeProvider,
    getDeviceIcon,
    formatDate,
    handleLogoutSession,
    onSubmit,
    handleDeleteAccount,
  } = useSecurity(userProfile, onLogoutSession, onLogoutAllSessions);

  return (
    <div className="space-y-8">
      {/* Password Section */}
      <div>
        <h4 className="text-sm font-semibold mb-4">
          Password & Authentication
        </h4>
        <div className="flex items-center gap-3">
          <IconBadge>
            <KeyRound className="size-4 text-muted-foreground" />
          </IconBadge>
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChangePasswordOpen(true)}
            >
              Change Password
            </Button>
            <p className="text-xs font-medium text-muted-foreground">
              Last changed: Never
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Connected Accounts */}
      <div>
        <h4 className="text-sm font-semibold mb-4">Connected Accounts</h4>
        <div className="flex items-center gap-2">
          {connectedAccounts.map((account) => (
            <Card key={account.id} className="bg-transparent p-0">
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                  <IconBadge
                    variant="default"
                    className={cn("rounded-lg", account.iconBg)}
                  >
                    {account.icon && (
                      <account.icon className={`size-6 ${account.iconColor}`} />
                    )}
                    {account.logo && (
                      <Image
                        src={account.logo}
                        alt={`${account.name}-logo`}
                        width={20}
                        height={20}
                        className={account.logoClass}
                      />
                    )}
                  </IconBadge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{account.name}</p>
                    {account.description === "Connected" ? (
                      <Badge
                        variant="secondary"
                        color="success"
                        className="text-xs"
                      >
                        <BadgeCheck className="h-3 w-3" />
                        {account.description}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        color="default"
                        className="text-xs text-muted-foreground"
                      >
                        {account.description}
                      </Badge>
                    )}
                  </div>
                  {account.isConnected ? (
                    <div className="flex items-center gap-2">
                      {account.id !== "credentials" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (connectedCount <= 1) {
                              setDisconnectBlockedOpen(true);
                            } else {
                              setRevokeProvider(account.id);
                            }
                          }}
                          disabled={isRevoking}
                        >
                          Revoke
                          <Unlink data-icon="inline-end" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    account.signinUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => {
                          setConnectingProvider(
                            account.id as "google" | "github",
                          );
                          window.location.href = account.signinUrl!;
                        }}
                        disabled={isRevoking || connectingProvider !== null}
                      >
                        {connectingProvider === account.id ? (
                          <>
                            <Spinner data-icon="inline-start" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <BadgePlus data-icon="inline-start" />
                            Connect
                          </>
                        )}
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Recent Login Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold">Recent Login Sessions</h4>
          {sortedSessions.length >= 3 && (
            <Link href="/edit-profile/sessions">
              <SlidingButton text="View All" variant="secondary" />
            </Link>
          )}
        </div>
        <ItemGroup>
          {sortedSessions.length > 0 ? (
            sortedSessions.slice(0, 3).map((s: Session, index: number) => {
              const parsedDevice = parseDeviceInfo(s.deviceInfo || "");
              const DeviceIcon = getDeviceIcon(s.deviceInfo || "");
              const location =
                [s.city, s.country].filter(Boolean).join(", ") ||
                "Unknown Location";
              const deviceLabel =
                parsedDevice.browser !== "Unknown"
                  ? `${parsedDevice.browser} on ${parsedDevice.os}`
                  : location;
              const locationLabel =
                parsedDevice.browser !== "Unknown" ? location : parsedDevice.os;

              return (
                <Item
                  key={index}
                  variant="muted"
                  className={cn(
                    "transition-all py-3",
                    s.isCurrent
                      ? "ring-1 ring-primary/20 bg-primary/5"
                      : "hover:bg-muted/50",
                  )}
                >
                  <ItemMedia
                    className={cn(
                      "p-2.5 rounded-full ring-1 ring-inset",
                      s.isCurrent
                        ? "bg-background ring-primary/30 text-primary"
                        : "bg-muted ring-border text-muted-foreground",
                    )}
                  >
                    <DeviceIcon className="size-4" />
                  </ItemMedia>

                  <ItemContent className="pr-4">
                    <ItemTitle className="flex items-center gap-2">
                      {deviceLabel}
                      {s.isCurrent && (
                        <Badge variant="success-light">
                          <Dot color="success" pulse />
                          Current
                        </Badge>
                      )}
                    </ItemTitle>
                    <ItemDescription>{locationLabel}</ItemDescription>
                    <ItemDescription className="text-tiny">
                      <span className="font-mono">{s.ipAddress}</span>
                      <span>·</span>
                      <span>{formatDate(s.loggedInAt)}</span>
                      {s.timezone && <span>({s.timezone})</span>}
                    </ItemDescription>
                  </ItemContent>

                  <ItemActions>
                    {!s.isCurrent && (
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() =>
                          s.originalIndex !== undefined &&
                          setDeleteSessionId(s.originalIndex)
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </ItemActions>
                </Item>
              );
            })
          ) : (
            <Empty className="py-6 border-none shadow-none">
              <EmptyHeader>
                <EmptyTitle>No recent sessions found.</EmptyTitle>
                <EmptyDescription>
                  You don't have any active sessions across devices.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </ItemGroup>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold mb-4 text-destructive">
          Danger Zone
        </h4>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setDeleteAccountOpen(true)}
            >
              <Trash2 data-icon="inline-start" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="px-6 py-4 max-w-xl">
          <DialogHeader className="p-0 pb-4">
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
              <div className="overflow-y-auto max-h-[60vh] space-y-4 py-2 px-1 mb-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="current-password"
                          autoComplete="current-password"
                          placeholder="••••••••"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="new-password"
                          autoComplete="new-password"
                          placeholder="Create a strong password"
                          showStrengthIndicator={true}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirm-password"
                          autoComplete="new-password"
                          placeholder="Repeat password"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setChangePasswordOpen(false)}
                  disabled={isChangingPassword}
                >
                  <CircleX data-icon="inline-start" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={!canSubmit || isChangingPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <CircleCheck data-icon="inline-start" />
                      Change Password
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Logout Session Confirmation */}
      <AlertDialog
        open={deleteSessionId !== null}
        onOpenChange={() => setDeleteSessionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout this session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will log out the device from your account. You&apos;ll need
              to log in again on that device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteSessionId !== null && handleLogoutSession(deleteSessionId)
              }
            >
              Logout Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disconnect Provider Confirmation */}
      <AlertDialog
        open={revokeProvider !== null}
        onOpenChange={() => setRevokeProvider(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {revokeProvider}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will no longer be able to sign in with your {revokeProvider}{" "}
              account. You can reconnect it anytime from your security settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                revokeProvider && handleRevokeProvider(revokeProvider)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isRevoking}
            >
              {isRevoking ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Disconnecting...
                </>
              ) : (
                <>
                  <Unlink data-icon="inline-start" />
                  Disconnect
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disconnect Blocked Alert */}
      <AlertDialog
        open={disconnectBlockedOpen}
        onOpenChange={setDisconnectBlockedOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cannot disconnect</AlertDialogTitle>
            <AlertDialogDescription>
              This is your only sign-in method. Please connect another account
              (Email & Password or another OAuth provider) before disconnecting
              this one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Understood</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Confirmation */}
      <AlertDialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
