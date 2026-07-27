import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Foresight" }] }),
  component: Profile,
});

function Profile() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      setEmail(userData.user.email || "");
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", userData.user.id).maybeSingle();
      if (profile) {
        setFullName(profile.full_name || "");
        setCompany(profile.company || "");
      }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
      if (roles?.length) setRole(roles.map((r) => r.role).join(", "));
    })();
  }, []);

  async function save() {
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: userData.user.id, full_name: fullName, company,
    });
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3"><User className="size-7 text-primary" />Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal details.</p>
      </div>
      <div className="glass-card p-8 space-y-5">
        <div className="flex items-center gap-5">
          <div className="size-20 rounded-3xl grid place-items-center text-2xl font-bold text-white" style={{ background: "var(--gradient-primary)" }}>
            {(fullName || email).slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-lg">{fullName || "Unnamed"}</div>
            <div className="text-sm text-muted-foreground">{email}</div>
            {role && <div className="mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary inline-block">{role}</div>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-4">
          <div>
            <Label className="text-xs">Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5 h-11 rounded-xl bg-card/50 border-border/60" />
          </div>
          <div>
            <Label className="text-xs">Company</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1.5 h-11 rounded-xl bg-card/50 border-border/60" />
          </div>
        </div>

        <button onClick={save} disabled={saving} className="rounded-full px-6 py-2.5 text-sm font-medium text-white flex items-center gap-2 disabled:opacity-60"
          style={{ background: "var(--gradient-primary)" }}>
          {saving && <Loader2 className="size-4 animate-spin" />} Save changes
        </button>
      </div>
    </div>
  );
}
