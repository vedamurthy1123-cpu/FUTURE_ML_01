"use client";
import { modelComparison } from "@/lib/data";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { useState } from "react";

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
            {typeof p.value === "number"
              ? p.value > 1
                ? `₹${(p.value * 83.5).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                : p.value.toFixed(4)
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const COLOR_MAP: Record<number, string> = {
  1: "#4f8cff",
  2: "#10b981",
  3: "#a855f7",
  4: "#f59e0b",
  5: "#f87171",
  6: "#ef4444",
};

const BADGE_CLASS: Record<string, string> = {
  "🥇 Best": "best",
  "🥈 Linear": "good",
  "🥉 3rd": "good",
  "📏 Baseline": "neutral",
  "⚠️ Overfit": "bad",
  "❌ Worst": "bad",
};

export default function ModelComparison() {
  const [tab, setTab] = useState<"table" | "rmse" | "mae" | "r2">("table");

  const rmseData = modelComparison.map((m) => ({
    name: m.model.replace("Historical Baseline", "Baseline").replace("Regression", "Reg."),
    "Test RMSE": Math.round(m.testRMSE),
    "Train RMSE": Math.round(m.trainRMSE),
    rank: m.rank,
  }));

  const maeData = modelComparison.map((m) => ({
    name: m.model.replace("Historical Baseline", "Baseline").replace("Regression", "Reg."),
    "Test MAE": Math.round(m.testMAE),
    "Train MAE": Math.round(m.trainMAE),
    rank: m.rank,
  }));

  return (
    <div>
      <div className="tab-bar" style={{ marginBottom: 24 }}>
        {(["table", "rmse", "mae", "r2"] as const).map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "table" ? "📋 Table" : t === "rmse" ? "📉 RMSE" : t === "mae" ? "📏 MAE" : "🎯 R²"}
          </button>
        ))}
      </div>

      {tab === "table" && (
        <div className="forecast-table-wrap">
          <table className="model-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Model</th>
                <th>Test RMSE (₹)</th>
                <th>Test MAE (₹)</th>
                <th>Test MAPE</th>
                <th>Test R²</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {modelComparison.map((m) => (
                <tr key={m.model} className={m.selected ? "selected" : ""}>
                  <td>
                    <span style={{ fontSize: "1.1rem" }}>
                      {m.rank === 1 ? "🥇" : m.rank === 2 ? "🥈" : m.rank === 3 ? "🥉" : m.rank}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: m.selected ? 700 : 400 }}>
                      {m.model}
                      {m.selected && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: "0.7rem",
                            padding: "2px 8px",
                            background: "rgba(79,140,255,0.15)",
                            color: "#4f8cff",
                            borderRadius: 99,
                            fontWeight: 700,
                            border: "1px solid rgba(79,140,255,0.3)",
                          }}
                        >
                          SELECTED
                        </span>
                      )}
                    </span>
                  </td>
                  <td style={{ color: COLOR_MAP[m.rank] }}>
                    ₹{(m.testRMSE * 83.5).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </td>
                  <td>₹{(m.testMAE * 83.5).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                  <td>{m.testMAPE.toFixed(2)}%</td>
                  <td>{m.testR2.toFixed(4)}</td>
                  <td>
                    <span className={`model-badge ${BADGE_CLASS[m.badge] ?? "neutral"}`}>
                      {m.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "rmse" && (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={rmseData} layout="vertical" margin={{ left: 80, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "#475569", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${((v * 83.5) / 100000).toFixed(1)}L`}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            <Bar dataKey="Train RMSE" fill="rgba(79,140,255,0.3)" radius={[0, 4, 4, 0]}>
              {rmseData.map((e, i) => (
                <Cell key={i} fill={`${COLOR_MAP[e.rank]}33`} />
              ))}
            </Bar>
            <Bar dataKey="Test RMSE" radius={[0, 4, 4, 0]}>
              {rmseData.map((e, i) => (
                <Cell key={i} fill={COLOR_MAP[e.rank]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {tab === "mae" && (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={maeData} layout="vertical" margin={{ left: 80, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "#475569", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${((v * 83.5) / 100000).toFixed(1)}L`}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            <Bar dataKey="Train MAE" radius={[0, 4, 4, 0]}>
              {maeData.map((e, i) => (
                <Cell key={i} fill={`${COLOR_MAP[e.rank]}33`} />
              ))}
            </Bar>
            <Bar dataKey="Test MAE" radius={[0, 4, 4, 0]}>
              {maeData.map((e, i) => (
                <Cell key={i} fill={COLOR_MAP[e.rank]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {tab === "r2" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {modelComparison.map((m) => {
            const r2Pct = Math.max(0, m.testR2 * 100);
            return (
              <div
                key={m.model}
                className="glass-sm"
                style={{
                  padding: 16,
                  borderColor: m.selected ? "rgba(79,140,255,0.35)" : undefined,
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 6 }}>
                  {m.model}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: m.testR2 > 0 ? COLOR_MAP[m.rank] : "#f87171",
                  }}
                >
                  {m.testR2.toFixed(4)}
                </div>
                <div
                  style={{
                    height: 4,
                    borderRadius: 99,
                    background: "rgba(255,255,255,0.06)",
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      width: `${r2Pct}%`,
                      height: "100%",
                      borderRadius: 99,
                      background: m.testR2 > 0 ? COLOR_MAP[m.rank] : "#ef4444",
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
