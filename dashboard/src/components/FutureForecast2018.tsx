"use client";
import { futureForecast2018 } from "@/lib/data";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value ?? 0;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label} 2018</div>
      <div className="tooltip-item">
        <span className="tooltip-dot" style={{ background: "#a855f7" }} />
        <span style={{ color: "#94a3b8" }}>Forecast (INR):</span>
        <span style={{ color: "#f0f4ff", fontWeight: 600 }}>
          ₹{(Number(v) * 83.5).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </span>
      </div>
      <div className="tooltip-item">
        <span style={{ color: "#94a3b8", marginLeft: 16 }}>In Lakhs:</span>
        <span style={{ color: "#a855f7", fontWeight: 600 }}>
          ₹{((Number(v) * 83.5) / 100000).toFixed(2)}L
        </span>
      </div>
    </div>
  );
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MAX_VAL = Math.max(...futureForecast2018.map((d) => d.predicted));

export default function FutureForecast2018() {
  const data = futureForecast2018.map((d) => ({
    ...d,
    label: d.month.slice(5),   // "01", "02" ...
    isPeak: d.predicted === MAX_VAL,
  }));

  return (
    <div>
      {/* Area Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grad2018" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
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
          <ReferenceLine
            y={75809}
            stroke="rgba(251,191,36,0.4)"
            strokeDasharray="4 4"
            label={{ value: "Peak", fill: "#fbbf24", fontSize: 10, position: "top" }}
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#a855f7"
            strokeWidth={2.5}
            fill="url(#grad2018)"
            dot={{ r: 5, fill: "#a855f7", strokeWidth: 0 }}
            activeDot={{ r: 7 }}
            name="Predicted Sales (INR)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Month Cards */}
      <div className="forecast-2018-grid" style={{ marginTop: 24 }}>
        {data.map((d, i) => {
          const barW = Math.round((d.predicted / MAX_VAL) * 100);
          const isQ4 = ["10", "11", "12"].includes(d.label);
          return (
            <div
              key={i}
              className={`glass-sm forecast-month-card ${d.isPeak ? "peak" : ""}`}
            >
              {d.isPeak && (
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    right: 8,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#fbbf24",
                    background: "rgba(251,191,36,0.15)",
                    border: "1px solid rgba(251,191,36,0.3)",
                    borderRadius: 99,
                    padding: "1px 8px",
                  }}
                >
                  PEAK
                </div>
              )}
              <div className="fmonth-label">
                {MONTH_NAMES[parseInt(d.label, 10) - 1]} {isQ4 && <span style={{ color: "#fbbf24" }}>★</span>}
              </div>
              <div className="fmonth-value">
                ₹{(d.predictedINR / 100000).toFixed(2)}L
              </div>
              <div className="fmonth-inr">
                ₹{Math.round(d.predictedINR).toLocaleString("en-IN")}
              </div>
              <div
                className="fmonth-bar"
                style={{
                  width: `${barW}%`,
                  background: isQ4
                    ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                    : "linear-gradient(90deg, #a855f7, #4f8cff)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginTop: 24,
        }}
      >
        {[
          {
            label: "Total 2018 Revenue",
            value: "₹5.71 Cr",
            sub: "₹5,70,91,205",
            color: "#a855f7",
          },
          {
            label: "Avg Monthly Forecast",
            value: "₹47.58L",
            sub: "₹47,57,600 / mo",
            color: "#4f8cff",
          },
          {
            label: "Peak Month (Dec)",
            value: "₹80.23L",
            sub: "₹80,22,680 (Q4 Peak)",
            color: "#fbbf24",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="glass-sm"
            style={{ padding: "18px 20px", textAlign: "center" }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: s.color,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 2 }}>
              {s.sub}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#475569",
                marginTop: 6,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
