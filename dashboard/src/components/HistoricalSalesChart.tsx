"use client";
import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";
import { monthlyHistoricalSales } from "@/lib/data";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p: any, i: number) => (
        <div className="tooltip-item" key={i}>
          <span className="tooltip-dot" style={{ background: p.color }} />
          <span style={{ color: "#94a3b8" }}>{p.name}:</span>
          <span style={{ color: "#f0f4ff", fontWeight: 600 }}>
            ₹{(p.value * 83.5).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
        </div>
      ))}
    </div>
  );
};

const YEARS = ["All", "2014", "2015", "2016", "2017"];

export default function HistoricalSalesChart() {
  const [activeYear, setActiveYear] = useState("All");
  const [metric, setMetric] = useState<"sales" | "profit" | "both">("both");

  const filtered =
    activeYear === "All"
      ? monthlyHistoricalSales
      : monthlyHistoricalSales.filter((d) => d.month.startsWith(activeYear));

  const data = filtered.map((d) => ({
    ...d,
    label: d.month.slice(2),
  }));

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <div className="tab-bar">
          {YEARS.map((y) => (
            <button
              key={y}
              className={`tab-btn ${activeYear === y ? "active" : ""}`}
              onClick={() => setActiveYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
        <div className="tab-bar">
          {(["both", "sales", "profit"] as const).map((m) => (
            <button
              key={m}
              className={`tab-btn ${metric === m ? "active" : ""}`}
              onClick={() => setMetric(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#4f8cff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4f8cff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${((v * 83.5) / 100000).toFixed(0)}L`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 16, fontSize: 12, color: "#94a3b8" }}
          />
          {metric !== "profit" && (
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#4f8cff"
              strokeWidth={2}
              fill="url(#gradSales)"
              name="Sales (₹)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          )}
          {metric !== "sales" && (
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradProfit)"
              name="Profit (₹)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          )}
          <ReferenceLine
            x="17-09"
            stroke="rgba(251,191,36,0.4)"
            strokeDasharray="4 4"
            label={{ value: "Q4 Peak", fill: "#fbbf24", fontSize: 10, position: "top" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
