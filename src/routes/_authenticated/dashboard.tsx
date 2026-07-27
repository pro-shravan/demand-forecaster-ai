import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Package, TrendingUp, DollarSign, Target, Activity, ShoppingBag,
  ArrowUpRight, AlertTriangle, Boxes, Brain,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  salesData, categoryPerformance, topProducts, lowStock, overStock,
  recentPredictions, recentActivity,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Foresight" }] }),
  component: Dashboard,
});

const COLORS = ["#E85D2A", "#FF7A3D", "#FFB088", "#FFD4BE", "#FFE8DA"];

const stats = [
  { label: "Total Products", value: "2,481", change: "+8.2%", icon: Package },
  { label: "Monthly Sales", value: "$128.4K", change: "+22%", icon: TrendingUp },
  { label: "Inventory Value", value: "$1.84M", change: "+3.1%", icon: Boxes },
  { label: "Prediction Accuracy", value: "94.2%", change: "+1.8%", icon: Target },
  { label: "Today's Revenue", value: "$14,820", change: "+12%", icon: DollarSign },
  { label: "Active Products", value: "2,104", change: "+4%", icon: Activity },
];

function Dashboard() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <div>
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold tracking-tight">
          Dashboard
        </motion.h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's your business at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between">
              <div className="size-10 rounded-2xl grid place-items-center bg-primary/10">
                <s.icon className="size-4 text-primary" />
              </div>
              <span className="text-xs text-primary flex items-center gap-0.5">
                <ArrowUpRight className="size-3" />{s.change}
              </span>
            </div>
            <div className="mt-4 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Sales & Demand Forecast</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 12 months · AI predictions overlaid</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Sales</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" />Forecast</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E85D2A" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#E85D2A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fcG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF7A3D" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FF7A3D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#BDBDBD" fontSize={11} />
              <YAxis stroke="#BDBDBD" fontSize={11} />
              <Tooltip contentStyle={{ background: "#181818", border: "1px solid #ffffff20", borderRadius: 16 }} />
              <Area type="monotone" dataKey="sales" stroke="#E85D2A" strokeWidth={2} fill="url(#salesG)" />
              <Area type="monotone" dataKey="forecast" stroke="#FF7A3D" strokeWidth={2} strokeDasharray="4 4" fill="url(#fcG)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
          <h3 className="font-semibold">Category Performance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Sales share by category</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryPerformance} innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                {categoryPerformance.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#181818", border: "1px solid #ffffff20", borderRadius: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold flex items-center gap-2"><ShoppingBag className="size-4 text-primary" />Top Selling Products</h3>
          </div>
          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.sku} className="flex items-center justify-between p-3 rounded-2xl hover:bg-card/60 transition">
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.sku}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{p.sold.toLocaleString()}</div>
                  <div className="text-xs text-primary">{p.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-5"><Brain className="size-4 text-primary" />Recent AI Predictions</h3>
          <div className="space-y-3">
            {recentPredictions.map((p) => (
              <div key={p.product} className="p-3 rounded-2xl hover:bg-card/60 transition">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{p.product}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{p.confidence}%</span>
                </div>
                <div className="text-xs text-muted-foreground">Predicted demand: <span className="text-foreground font-medium">{p.predicted.toLocaleString()}</span> units</div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.confidence}%`, background: "var(--gradient-primary)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><AlertTriangle className="size-4 text-primary" />Low Stock</h3>
          <div className="space-y-3">
            {lowStock.map((p) => (
              <div key={p.name} className="flex justify-between text-sm">
                <span className="truncate">{p.name}</span>
                <span className="text-primary font-semibold">{p.stock}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><Boxes className="size-4 text-primary" />Overstock</h3>
          <div className="space-y-3">
            {overStock.map((p) => (
              <div key={p.name} className="flex justify-between text-sm">
                <span className="truncate">{p.name}</span>
                <span className="text-muted-foreground">{p.stock} · 30d: {p.sales30d}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><Activity className="size-4 text-primary" />Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="text-sm">
                <div>{a.text}</div>
                <div className="text-xs text-muted-foreground">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
