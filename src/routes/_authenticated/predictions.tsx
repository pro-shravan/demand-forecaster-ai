import { createFileRoute } from "@tanstack/react-router";
import { Brain, Sparkles, TrendingUp, Lightbulb, Package } from "lucide-react";
import { recentPredictions } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/predictions")({
  head: () => ({ meta: [{ title: "AI Prediction — Foresight" }] }),
  component: Predictions,
});

const insights = [
  { icon: TrendingUp, title: "Demand Prediction", body: "Q1 demand expected to grow 18% led by Electronics. Prepare 15% additional stock on top 20 SKUs." },
  { icon: Package, title: "Inventory Recommendation", body: "Reorder Wireless Earbuds Pro (1,200 units) and Ergonomic Chair (450 units) within the next 7 days." },
  { icon: Lightbulb, title: "Improvement Suggestions", body: "Bundle slow-moving Denim Jackets with fast-moving Sneakers to lift AOV by an estimated 12%." },
  { icon: Sparkles, title: "Business Summary", body: "Revenue trend is healthy (+22% MoM). Watch: Beauty category shows early signs of seasonal slowdown." },
];

function Predictions() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3"><Brain className="size-7 text-primary" />AI Prediction</h1>
          <p className="text-muted-foreground mt-1">Groq-powered analysis of your sales & inventory.</p>
        </div>
        <button className="rounded-full px-6 py-2.5 text-sm font-medium text-white flex items-center gap-2"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
          <Sparkles className="size-4" /> Run new prediction
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {insights.map((i) => (
          <div key={i.title} className="glass-card p-6">
            <div className="size-11 rounded-2xl grid place-items-center mb-4" style={{ background: "var(--gradient-primary)" }}>
              <i.icon className="size-5 text-white" />
            </div>
            <h3 className="font-semibold">{i.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i.body}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold mb-5">Latest predictions</h3>
        <div className="space-y-3">
          {recentPredictions.map((p) => (
            <div key={p.product} className="flex items-center justify-between p-4 rounded-2xl hover:bg-card/60 transition">
              <div>
                <div className="text-sm font-medium">{p.product}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Confidence {p.confidence}%</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{p.predicted.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">units / month</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
