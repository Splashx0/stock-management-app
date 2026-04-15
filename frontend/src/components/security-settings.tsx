"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    }, 1000);
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);

    toast({
      title: twoFactorEnabled
        ? "Two-factor authentication disabled"
        : "Two-factor authentication enabled",
      description: twoFactorEnabled
        ? "Your account is now less secure."
        : "Your account is now more secure.",
    });
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handlePasswordChange} className="space-y-6">
        <h3 className="text-lg font-medium">Change Password</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p>
              Enhance your account security by enabling two-factor
              authentication.
            </p>
            <p className="text-sm text-muted-foreground">
              We will send a verification code to your email each time you sign
              in.
            </p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleTwoFactorToggle}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sessions</h3>
        <div className="space-y-2">
          <p>You are currently signed in on this device.</p>
          <Button variant="outline" className="w-full sm:w-auto">
            Sign out from all devices
          </Button>
        </div>
      </div>
    </div>
  );
}
