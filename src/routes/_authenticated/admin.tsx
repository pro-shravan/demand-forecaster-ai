import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, Users, Trash2, UserCog, Search, RefreshCw,
  Loader2, AlertTriangle, Crown,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Super Admin — Foresight" }] }),
  component: AdminPanel,
});

type UserRow = {
  id: string;
  email: string;
  created_at: string;
  full_name: string | null;
  role: string | null;
};

const ROLES = ["super_admin", "admin", "manager", "analyst", "driver", "customer"] as const;

function AdminPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: UserRow | null }>({ open: false, user: null });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "super_admin" });
    if (data) {
      setIsSuperAdmin(true);
      fetchUsers();
    } else {
      setIsSuperAdmin(false);
      setLoading(false);
    }
  }

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_all_users");
    if (error) {
      toast.error("Failed to load users: " + error.message);
      setLoading(false);
      return;
    }
    setUsers((data as UserRow[]) || []);
    setLoading(false);
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setActionLoading(userId);
    const { error } = await supabase.rpc("update_user_role", {
      _user_id: userId,
      _new_role: newRole as any,
    });
    if (error) {
      toast.error("Failed to update role: " + error.message);
    } else {
      toast.success("Role updated successfully");
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    }
    setActionLoading(null);
  }

  async function handleDeleteUser() {
    if (!deleteDialog.user) return;
    setActionLoading(deleteDialog.user.id);
    const { error } = await supabase.rpc("admin_delete_user", { _user_id: deleteDialog.user.id });
    if (error) {
      toast.error("Failed to delete user: " + error.message);
    } else {
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u.id !== deleteDialog.user!.id));
    }
    setDeleteDialog({ open: false, user: null });
    setActionLoading(null);
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = !searchQuery ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (!isSuperAdmin && !loading) {
    return (
      <div className="max-w-[1600px] mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center glass-card p-12">
          <AlertTriangle className="size-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="mt-2 text-muted-foreground">You need super admin privileges to access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="size-8 text-primary" />
            Super Admin Panel
          </motion.h1>
          <p className="text-muted-foreground mt-1">Manage all users, roles, and system access.</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/60 text-sm hover:bg-card transition"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {ROLES.map((role) => {
          const count = users.filter((u) => u.role === role).length;
          return (
            <div key={role} className="glass-card p-4">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-muted-foreground capitalize mt-1">{role.replace("_", " ")}s</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card/50 border-border/60"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48 h-11 rounded-xl bg-card/50 border-border/60">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r} className="capitalize">{r.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">User</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Email</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Role</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Joined</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/20 hover:bg-card/40 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary/10 grid place-items-center">
                          {user.role === "super_admin" ? (
                            <Crown className="size-4 text-yellow-500" />
                          ) : (
                            <Users className="size-4 text-primary" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{user.full_name || "—"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="p-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={user.role || "analyst"}
                          onValueChange={(val) => handleRoleChange(user.id, val)}
                          disabled={actionLoading === user.id}
                        >
                          <SelectTrigger className="w-36 h-8 rounded-lg text-xs bg-card/50 border-border/60">
                            <UserCog className="size-3 mr-1" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((r) => (
                              <SelectItem key={r} value={r} className="capitalize text-xs">{r.replace("_", " ")}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <button
                          onClick={() => setDeleteDialog({ open: true, user })}
                          disabled={actionLoading === user.id}
                          className="size-8 rounded-lg grid place-items-center bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, user: open ? deleteDialog.user : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-500" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteDialog.user?.full_name || deleteDialog.user?.email}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setDeleteDialog({ open: false, user: null })}
              className="px-4 py-2 rounded-lg text-sm bg-card/60 border border-border/60 hover:bg-card transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              disabled={actionLoading !== null}
              className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition flex items-center gap-2"
            >
              {actionLoading && <Loader2 className="size-3 animate-spin" />}
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RoleBadge({ role }: { role: string | null }) {
  const colors: Record<string, string> = {
    super_admin: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    admin: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    manager: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    analyst: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    driver: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    customer: "bg-green-500/10 text-green-400 border-green-500/30",
  };
  const cls = colors[role || "analyst"] || colors.analyst;
  return (
    <Badge variant="outline" className={`capitalize text-xs ${cls}`}>
      {(role || "analyst").replace("_", " ")}
    </Badge>
  );
}