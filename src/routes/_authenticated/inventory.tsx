import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { topProducts, lowStock, overStock } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/inventory")({
  head: () => ({ meta: [{ title: "Inventory — Foresight" }] }),
  component: Inventory,
});

function Inventory() {
  const items = [
    ...topProducts.map((p) => ({ name: p.name, sku: p.sku, stock: 200 + Math.floor(Math.random() * 400), status: "OK" })),
    ...lowStock.map((p) => ({ name: p.name, sku: "—", stock: p.stock, status: "Low" })),
    ...overStock.map((p) => ({ name: p.name, sku: "—", stock: p.stock, status: "Over" })),
  ];
  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3"><Package className="size-7 text-primary" />Inventory</h1>
        <p className="text-muted-foreground mt-1">Live view of stock across all SKUs.</p>
      </div>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-6 py-4">Product</th>
              <th className="text-left px-6 py-4">SKU</th>
              <th className="text-right px-6 py-4">Stock</th>
              <th className="text-right px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p, i) => (
              <tr key={i} className="border-t border-border/30 hover:bg-card/40 transition">
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{p.sku}</td>
                <td className="px-6 py-4 text-right">{p.stock}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    p.status === "Low" ? "bg-destructive/10 text-destructive" :
                    p.status === "Over" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
