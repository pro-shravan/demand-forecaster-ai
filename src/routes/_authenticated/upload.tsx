import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({ meta: [{ title: "Upload Sales Data — Foresight" }] }),
  component: UploadPage,
});

function UploadPage() {
  const [rows, setRows] = useState<string[][] | null>(null);
  const [fileName, setFileName] = useState("");

  function onFile(f: File) {
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result || "");
      const lines = text.split(/\r?\n/).filter(Boolean).slice(0, 11);
      setRows(lines.map((l) => l.split(",")));
      toast.success("CSV parsed — preview ready");
    };
    reader.readAsText(f);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Sales Data</h1>
        <p className="text-muted-foreground mt-1">Import your CSV to run AI predictions.</p>
      </div>

      <label
        htmlFor="file"
        className="glass-card block p-14 text-center cursor-pointer border-2 border-dashed border-border/60 hover:border-primary/60 transition"
      >
        <input
          id="file" type="file" accept=".csv" className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
        <div className="size-16 rounded-3xl grid place-items-center mx-auto mb-4" style={{ background: "var(--gradient-primary)" }}>
          <UploadCloud className="size-7 text-white" />
        </div>
        <div className="font-semibold">Drop your CSV or click to browse</div>
        <div className="text-sm text-muted-foreground mt-1">date, sku, quantity, revenue</div>
      </label>

      {rows && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="size-5 text-primary" />
              <div>
                <div className="font-medium">{fileName}</div>
                <div className="text-xs text-muted-foreground">Preview · first 10 rows</div>
              </div>
            </div>
            <button className="rounded-full px-5 py-2 text-sm font-medium text-white flex items-center gap-2"
              style={{ background: "var(--gradient-primary)" }}
              onClick={() => toast.success("Saved to database")}>
              <CheckCircle2 className="size-4" /> Save to database
            </button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border/40">
            <table className="w-full text-sm">
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className={i === 0 ? "bg-card/60 font-medium" : "border-t border-border/30"}>
                    {r.map((c, j) => <td key={j} className="px-4 py-2.5">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
