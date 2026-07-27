import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";
import { salesData, categoryPerformance } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Foresight" }] }),
  component: Analytics,
});

const COLORS = ["#E85D2A", "#FF7A3D", "#FFB088", "#FFD4BE", "#FFE8DA"];
const accuracy = salesData.map((d) => ({ month: d.month, accuracy: 88 + Math.random() * 8 }));

function Analytics() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3"><BarChart3 className="size-7 text-primary" />Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep-dive charts across sales and predictions.</p>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#BDBDBD" fontSize={11} />
              <YAxis stroke="#BDBDBD" fontSize={11} />
              <Tooltip contentStyle={{ background: "#181818", border: "1px solid #ffffff20", borderRadius: 16 }} />
              <Bar dataKey="sales" fill="#E85D2A" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Demand Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#BDBDBD" fontSize={11} />
              <YAxis stroke="#BDBDBD" fontSize={11} />
              <Tooltip contentStyle={{ background: "#181818", border: "1px solid #ffffff20", borderRadius: 16 }} />
              <Line type="monotone" dataKey="forecast" stroke="#FF7A3D" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Category-wise Sales</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryPerformance} innerRadius={55} outerRadius={100} dataKey="value" paddingAngle={4}>
                {categoryPerformance.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#181818", border: "1px solid #ffffff20", borderRadius: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Prediction Accuracy</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={accuracy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#BDBDBD" fontSize={11} />
              <YAxis stroke="#BDBDBD" fontSize={11} domain={[80, 100]} />
              <Tooltip contentStyle={{ background: "#181818", border: "1px solid #ffffff20", borderRadius: 16 }} />
              <Line type="monotone" dataKey="accuracy" stroke="#E85D2A" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
