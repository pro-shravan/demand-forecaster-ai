import { createFileRoute } from "@tanstack/react-router";
import { Settings, Bell, Shield, Mail } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Foresight" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const groups = [
    { icon: Bell, title: "Notifications", items: ["Low stock alerts", "Overstock warnings", "Prediction completed", "Weekly summary email"] },
    { icon: Mail, title: "Email delivery", items: ["Send reports to team", "Include AI insights", "PDF attached"] },
    { icon: Shield, title: "Security", items: ["Two-factor authentication", "Session management", "API access"] },
  ];
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3"><Settings className="size-7 text-primary" />Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your workspace.</p>
      </div>
      {groups.map((g) => (
        <div key={g.title} className="glass-card p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><g.icon className="size-4 text-primary" />{g.title}</h3>
          <div className="space-y-3">
            {g.items.map((i) => (
              <label key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-card/60 transition cursor-pointer">
                <span className="text-sm">{i}</span>
                <input type="checkbox" defaultChecked className="size-4 accent-primary" />
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
