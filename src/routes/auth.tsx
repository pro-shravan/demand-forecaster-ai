import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2, Truck, ShoppingBag, Shield } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup", "forgot"]).optional(),
  role: z.enum(["driver", "customer"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Sign in — Foresight" }, { name: "description", content: "Sign in to your Foresight dashboard." }] }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const mode: "signin" | "signup" | "forgot" = search.mode ?? "signin";
  const selectedRole = search.role;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const role = selectedRole || "customer";
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin + "/auth",
            data: { full_name: name, role, phone },
          },
        });
        if (error) throw error;
        toast.success("Account created! Redirecting...");
        navigate({ to: "/dashboard" });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        toast.success("Password reset link sent — check your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // Show role selection for signup if no role selected
  if (mode === "signup" && !selectedRole) {
    return <RoleSelection />;
  }

  const titles: Record<"signin" | "signup" | "forgot", { h: string; s: string }> = {
    signin: { h: "Welcome back", s: "Sign in to your Foresight dashboard" },
    signup: {
      h: selectedRole === "driver" ? "Join as a Driver" : "Create your account",
      s: selectedRole === "driver" ? "Start delivering and earning today" : "Start using demand forecasting",
    },
    forgot: { h: "Reset password", s: "We'll email you a reset link" },
  };
  const { h, s } = titles[mode];

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-4 py-12">
      <div className="glow-orb absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px]" />
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
        <ArrowLeft className="size-4" /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card p-8 md:p-10"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="size-9 rounded-2xl grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-semibold">Foresight</span>
        </div>

        {mode === "signup" && selectedRole && (
          <div className="mb-4 flex items-center gap-2">
            <div className={`size-8 rounded-xl grid place-items-center ${selectedRole === "driver" ? "bg-blue-500/20" : "bg-green-500/20"}`}>
              {selectedRole === "driver" ? <Truck className="size-4 text-blue-400" /> : <ShoppingBag className="size-4 text-green-400" />}
            </div>
            <span className="text-sm text-muted-foreground capitalize">{selectedRole} Account</span>
          </div>
        )}

        <h1 className="text-2xl font-bold tracking-tight">{h}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{s}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name" className="text-xs">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5 h-11 rounded-xl bg-card/50 border-border/60" />
            </div>
          )}
          <div>
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5 h-11 rounded-xl bg-card/50 border-border/60" />
          </div>
          {mode === "signup" && selectedRole === "driver" && (
            <div>
              <Label htmlFor="phone" className="text-xs">Phone number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1.5 h-11 rounded-xl bg-card/50 border-border/60" placeholder="+91 XXXXX XXXXX" />
            </div>
          )}
          {mode !== "forgot" && (
            <div>
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1.5 h-11 rounded-xl bg-card/50 border-border/60" />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-full font-medium text-white flex items-center justify-center gap-2 transition disabled:opacity-60 hover:scale-[1.01]"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-muted-foreground space-y-2">
          {mode === "signin" && (
            <>
              <div>
                <Link to="/auth" search={{ mode: "forgot" }} className="hover:text-foreground">Forgot password?</Link>
              </div>
              <div>
                No account?{" "}
                <Link to="/auth" search={{ mode: "signup" }} className="text-primary font-medium">Sign up</Link>
              </div>
            </>
          )}
          {mode === "signup" && (
            <div>
              Already have one?{" "}
              <Link to="/auth" search={{ mode: "signin" }} className="text-primary font-medium">Sign in</Link>
            </div>
          )}
          {mode === "forgot" && (
            <div>
              <Link to="/auth" search={{ mode: "signin" }} className="text-primary font-medium">Back to sign in</Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function RoleSelection() {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-4 py-12">
      <div className="glow-orb absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px]" />
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
        <ArrowLeft className="size-4" /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg glass-card p-8 md:p-10"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="size-9 rounded-2xl grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-semibold">Foresight</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Choose your role</h1>
        <p className="mt-1 text-sm text-muted-foreground">Select how you want to use Foresight</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/auth"
            search={{ mode: "signup", role: "driver" }}
            className="group glass-card p-6 hover:border-blue-500/40 transition cursor-pointer block"
          >
            <div className="size-14 rounded-2xl grid place-items-center bg-blue-500/10 mb-4 group-hover:bg-blue-500/20 transition">
              <Truck className="size-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg">Driver</h3>
            <p className="mt-2 text-sm text-muted-foreground">Deliver goods, track routes, and manage your deliveries efficiently.</p>
          </Link>

          <Link
            to="/auth"
            search={{ mode: "signup", role: "customer" }}
            className="group glass-card p-6 hover:border-green-500/40 transition cursor-pointer block"
          >
            <div className="size-14 rounded-2xl grid place-items-center bg-green-500/10 mb-4 group-hover:bg-green-500/20 transition">
              <ShoppingBag className="size-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-lg">Customer</h3>
            <p className="mt-2 text-sm text-muted-foreground">Place orders, track deliveries, and access demand insights.</p>
          </Link>
        </div>

        <div className="mt-6 text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth" search={{ mode: "signin" }} className="text-primary font-medium">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}