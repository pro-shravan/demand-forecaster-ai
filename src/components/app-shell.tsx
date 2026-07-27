import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import {
  LayoutDashboard, Upload, Package, Brain, FileText, BarChart3,
  User, Settings, Sparkles, LogOut, Bell, Menu, X, Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Data", icon: Upload },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/predictions", label: "AI Prediction", icon: Brain },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

const bottomNav = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <TopBar onMenu={() => setOpen(true)} />
        <main className="flex-1 p-6 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  }

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border p-4 flex flex-col transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-3 py-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="size-9 rounded-2xl grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">Foresight</span>
          </Link>
          <button className="lg:hidden text-muted-foreground" onClick={onClose}><X className="size-5" /></button>
        </div>

        <nav className="mt-6 flex-1 space-y-1">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                  active ? "bg-sidebar-accent text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <n.icon className={cn("size-4", active && "text-primary")} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-sidebar-border space-y-1">
          {bottomNav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                  active ? "bg-sidebar-accent text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <n.icon className="size-4" /> {n.label}
              </Link>
            );
          })}
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/40">
      <div className="flex items-center gap-4 px-6 md:px-8 lg:px-10 py-4">
        <button className="lg:hidden text-muted-foreground" onClick={onMenu}><Menu className="size-5" /></button>
        <div className="flex-1 max-w-lg relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            placeholder="Search products, reports..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-card/60 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>
        <button className="relative size-10 rounded-full bg-card/60 border border-border/60 grid place-items-center hover:bg-card transition">
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}
