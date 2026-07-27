import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports — Foresight" }] }),
  component: Reports,
});

const reports = [
  { name: "Monthly Sales Report", desc: "Complete revenue breakdown by category & product.", date: "Dec 2025" },
  { name: "Prediction Report", desc: "AI forecast for the next quarter with confidence scores.", date: "Q1 2026" },
  { name: "Inventory Report", desc: "Stock status, reorder points, and overstock warnings.", date: "This week" },
];

function Reports() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3"><FileText className="size-7 text-primary" />Reports</h1>
        <p className="text-muted-foreground mt-1">Export as PDF or email your team.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((r) => (
          <div key={r.name} className="glass-card p-6 flex flex-col">
            <div className="size-11 rounded-2xl grid place-items-center mb-4" style={{ background: "var(--gradient-primary)" }}>
              <FileText className="size-5 text-white" />
            </div>
            <h3 className="font-semibold">{r.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{r.desc}</p>
            <div className="text-xs text-muted-foreground mt-3">{r.date}</div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => toast.success("PDF exported")} className="flex-1 h-10 rounded-full text-sm font-medium text-white flex items-center justify-center gap-1.5"
                style={{ background: "var(--gradient-primary)" }}>
                <Download className="size-4" /> PDF
              </button>
              <button onClick={() => toast.success("Report emailed")} className="flex-1 h-10 rounded-full text-sm font-medium border border-border/60 flex items-center justify-center gap-1.5 hover:bg-card/60">
                <Mail className="size-4" /> Email
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
