"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useState } from "react";

const quarterlyData = [
  { quarter: "Q1 (Jan–Mar)", "2014": 74448, "2015": 68852, "2016": 93237, "2017": 123145 },
  { quarter: "Q2 (Apr–Jun)", "2014": 86539, "2015": 89124, "2016": 136082, "2017": 133764 },
  { quarter: "Q3 (Jul–Sep)", "2014": 143633, "2015": 130259, "2016": 143787, "2017": 196252 },
  { quarter: "Q4 (Oct–Dec)", "2014": 179628, "2015": 182297, "2016": 236099, "2017": 280054 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p: any, i: number) => (
        <div className="tooltip-item" key={i}>
          <span className="tooltip-dot" style={{ background: p.color || p.fill }} />
          <span style={{ color: "#94a3b8" }}>{p.name}:</span>
          <span style={{ color: "#f0f4ff", fontWeight: 600 }}>
            ₹{((p.value * 83.5) / 100000).toFixed(2)}L
          </span>
        </div>
      ))}
    </div>
  );
};

export default function QuarterlyTrends() {
  const [viewMetric, setViewMetric] = useState<"grouped" | "stacked">("grouped");

  return (
    <div>
      <div className="tab-bar" style={{ marginBottom: 24 }}>
        <button
          className={`tab-btn ${viewMetric === "grouped" ? "active" : ""}`}
          onClick={() => setViewMetric("grouped")}
        >
          📊 Quarterly Comparison
        </button>
        <button
          className={`tab-btn ${viewMetric === "stacked" ? "active" : ""}`}
          onClick={() => setViewMetric("stacked")}
        >
          📈 Cumulative Share
        </button>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={quarterlyData}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="quarter"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
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
          <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 12 }} />
          <Bar
            dataKey="2014"
            fill="#4f8cff"
            stackId={viewMetric === "stacked" ? "a" : undefined}
            radius={viewMetric === "stacked" ? 0 : [4, 4, 0, 0]}
          />
          <Bar
            dataKey="2015"
            fill="#a855f7"
            stackId={viewMetric === "stacked" ? "a" : undefined}
            radius={viewMetric === "stacked" ? 0 : [4, 4, 0, 0]}
          />
          <Bar
            dataKey="2016"
            fill="#10b981"
            stackId={viewMetric === "stacked" ? "a" : undefined}
            radius={viewMetric === "stacked" ? 0 : [4, 4, 0, 0]}
          />
          <Bar
            dataKey="2017"
            fill="#fbbf24"
            stackId={viewMetric === "stacked" ? "a" : undefined}
            radius={viewMetric === "stacked" ? [4, 4, 0, 0] : [4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Seasonality Key Highlights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginTop: 24,
        }}
      >
        {[
          {
            q: "Q1 Baseline",
            share: "16.8%",
            note: "Post-holiday normalization period with lowest yearly demand.",
            color: "#4f8cff",
          },
          {
            q: "Q2 Mid-Year",
            share: "19.2%",
            note: "Steady corporate procurement and institutional restocking.",
            color: "#a855f7",
          },
          {
            q: "Q3 Ramp-Up",
            share: "26.4%",
            note: "Early festive preparation and back-to-school order volume surge.",
            color: "#10b981",
          },
          {
            q: "Q4 Super-Peak",
            share: "37.6%",
            note: "Massive November-December holiday rush generating highest margins.",
            color: "#fbbf24",
          },
        ].map((item) => (
          <div
            key={item.q}
            className="glass-sm"
            style={{ padding: "16px 18px", borderTop: `2px solid ${item.color}` }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f0f4ff" }}>{item.q}</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: item.color }}>{item.share}</span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
