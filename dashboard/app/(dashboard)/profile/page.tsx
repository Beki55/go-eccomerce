"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { LoadingCard } from "@/components/ui/loading";

export default function ProfilePage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [energySaving, setEnergySaving] = useState(false);

  if (!user) {
    return <LoadingCard message="Loading profile..." />;
  }

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <h1 className="text-balance text-2xl font-semibold text-foreground">
        Profile
      </h1>
      <p className="mt-2 text-muted-foreground">
        Manage your profile, preferences, and account.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <h3 className="mb-3 font-medium text-foreground">
            Account Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span className="text-foreground font-mono">
                {user.id.slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="text-foreground capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-600">Active</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <h3 className="mb-3 font-medium text-foreground">Preferences</h3>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground">Notifications</span>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground">Energy-saving mode</span>
            <Switch checked={energySaving} onCheckedChange={setEnergySaving} />
          </div>
        </div>
      </div>
    </section>
  );
}
