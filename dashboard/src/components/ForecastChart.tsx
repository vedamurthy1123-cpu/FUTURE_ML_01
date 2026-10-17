"use client";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
} from "recharts";
import { testForecastResults } from "@/lib/data";
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
            ₹{(Number(p.value) * 83.5).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
        </div>
      ))}
    </div>
  );
};

const ErrorTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      <div className="tooltip-item">
        <span style={{ color: "#94a3b8" }}>MAPE:</span>
        <span style={{ color: "#f59e0b", fontWeight: 600 }}>
          {Number(payload[0]?.value).toFixed(2)}%
        </span>
      </div>
      <div className="tooltip-item">
        <span style={{ color: "#94a3b8" }}>Error:</span>
        <span style={{ color: "#f0f4ff", fontWeight: 600 }}>
          ₹{Math.abs(Number(payload[1]?.value ?? 0) * 83.5).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  );
};

export default function ForecastChart() {
  const [view, setView] = useState<"lines" | "residuals" | "pct">("lines");

  const data = testForecastResults.map((r) => ({
    ...r,
    label: r.month.slice(2),
  }));

  return (
    <div>
      <div className="tab-bar" style={{ marginBottom: 24 }}>
        {(["lines", "residuals", "pct"] as const).map((v) => (
          <button
            key={v}
            className={`tab-btn ${view === v ? "active" : ""}`}
            onClick={() => setView(v)}
          >
            {v === "lines" ? "📈 Actual vs Predicted" : v === "residuals" ? "📊 Residuals" : "📉 % Error"}
          </button>
        ))}
      </div>

      {view === "lines" && (
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#4f8cff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${((v * 83.5) / 100000).toFixed(1)}L`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#4f8cff"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "#4f8cff", strokeWidth: 0 }}
              activeDot={{ r: 7 }}
              name="Actual Sales (INR)"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ r: 5, fill: "#10b981", strokeWidth: 0 }}
              activeDot={{ r: 7 }}
              name="Extra Trees Forecast (INR)"
            />
            <Bar dataKey="error" fill="rgba(245,158,11,0.2)" name="Abs Error (INR)" radius={[4,4,0,0]} />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {view === "residuals" && (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${((v * 83.5) / 100000).toFixed(1)}L`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
            <Bar dataKey="residual" name="Residual (Actual − Pred)" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <rect
                  key={i}
                  fill={d.residual > 0 ? "#f59e0b" : "#10b981"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {view === "pct" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {testForecastResults.map((r) => (
            <div key={r.month} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 60, fontSize: "0.8rem", color: "#94a3b8", flexShrink: 0 }}>{r.month.slice(2)}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: 20,
                    borderRadius: 6,
                    background: `linear-gradient(90deg, ${r.pct < 15 ? "#10b981" : r.pct < 25 ? "#f59e0b" : "#f87171"} 0%, transparent 100%)`,
                    width: `${Math.min(r.pct, 50) * 2}%`,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 8,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "white",
                    minWidth: 60,
                    transition: "width 0.6s ease",
                  }}
                >
                  {r.pct.toFixed(1)}%
                </div>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#94a3b8", flexShrink: 0, width: 80, textAlign: "right" }}>
                ₹{(r.error * 83.5).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
          ))}
          <div style={{ fontSize: "0.78rem", color: "#475569", marginTop: 4 }}>
            Average MAPE: <span style={{ color: "#f59e0b", fontWeight: 600 }}>21.04%</span>
          </div>
        </div>
      )}

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 28 }}>
        {[
          { label: "Test MAE", value: "₹13.31L", color: "#4f8cff" },
          { label: "Test RMSE", value: "₹15.12L", color: "#a855f7" },
          { label: "Test MAPE", value: "21.04%", color: "#f59e0b" },
          { label: "Test R²", value: "0.3708", color: "#10b981" },
        ].map((s) => (
          <div key={s.label} className="glass-sm" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
