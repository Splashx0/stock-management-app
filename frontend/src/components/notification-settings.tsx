"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: {
      orderUpdates: true,
      stockAlerts: true,
      weeklyReports: true,
      newCustomers: false,
      promotions: false,
    },
    push: {
      orderUpdates: true,
      stockAlerts: true,
      weeklyReports: false,
      newCustomers: true,
      promotions: false,
    },
  });

  const handleToggle = (type: "email" | "push", setting: string) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [setting]: !prev[type][setting as keyof (typeof prev)[typeof type]],
      },
    }));
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p>Order Updates</p>
              <p className="text-sm text-muted-foreground">
                Receive emails about your order status changes.
              </p>
            </div>
            <Switch
              checked={notifications.email.orderUpdates}
              onCheckedChange={() => handleToggle("email", "orderUpdates")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p>Stock Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified when products are low in stock or out of stock.
              </p>
            </div>
            <Switch
              checked={notifications.email.stockAlerts}
              onCheckedChange={() => handleToggle("email", "stockAlerts")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p>Weekly Reports</p>
              <p className="text-sm text-muted-foreground">
                Receive weekly summary reports of your business performance.
              </p>
            </div>
            <Switch
              checked={notifications.email.weeklyReports}
              onCheckedChange={() => handleToggle("email", "weeklyReports")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p>New Customers</p>
              <p className="text-sm text-muted-foreground">
                Get notified when new customers register.
              </p>
            </div>
            <Switch
              checked={notifications.email.newCustomers}
              onCheckedChange={() => handleToggle("email", "newCustomers")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p>Promotions and Updates</p>
              <p className="text-sm text-muted-foreground">
                Receive marketing emails and product updates.
              </p>
            </div>
            <Switch
              checked={notifications.email.promotions}
              onCheckedChange={() => handleToggle("email", "promotions")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p>Order Updates</p>
              <p className="text-sm text-muted-foreground">
                Receive push notifications about your order status changes.
              </p>
            </div>
            <Switch
              checked={notifications.push.orderUpdates}
              onCheckedChange={() => handleToggle("push", "orderUpdates")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p>Stock Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get push notifications when products are low in stock or out of
                stock.
              </p>
            </div>
            <Switch
              checked={notifications.push.stockAlerts}
              onCheckedChange={() => handleToggle("push", "stockAlerts")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p>Weekly Reports</p>
              <p className="text-sm text-muted-foreground">
                Receive push notifications for weekly summary reports.
              </p>
            </div>
            <Switch
              checked={notifications.push.weeklyReports}
              onCheckedChange={() => handleToggle("push", "weeklyReports")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p>New Customers</p>
              <p className="text-sm text-muted-foreground">
                Get push notifications when new customers register.
              </p>
            </div>
            <Switch
              checked={notifications.push.newCustomers}
              onCheckedChange={() => handleToggle("push", "newCustomers")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p>Promotions and Updates</p>
              <p className="text-sm text-muted-foreground">
                Receive push notifications for marketing and product updates.
              </p>
            </div>
            <Switch
              checked={notifications.push.promotions}
              onCheckedChange={() => handleToggle("push", "promotions")}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
