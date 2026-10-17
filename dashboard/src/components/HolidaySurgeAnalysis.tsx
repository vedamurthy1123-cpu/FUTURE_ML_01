"use client";
import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
} from "recharts";

// 1. Q4 Holiday Test Forecast (Actual vs Predicted from ML Model Stage 7)
const q4ForecastData = [
  {
    month: "October 2017",
    label: "Oct '17 (Prep)",
    actualUSD: 77776.92,
    predictedUSD: 67556.33,
    actualINR: 6494373,
    predictedINR: 5640954,
    accuracy: "86.9%",
    errorPct: 13.14,
    event: "Early Festive Prep & Corporate Gifting",
  },
  {
    month: "November 2017",
    label: "Nov '17 (Peak)",
    actualUSD: 118447.83,
    predictedUSD: 88087.51,
    actualINR: 9890394,
    predictedINR: 7355307,
    accuracy: "74.4%",
    errorPct: 25.63,
    event: "Black Friday & Cyber Monday Megasale",
  },
  {
    month: "December 2017",
    label: "Dec '17 (Closing)",
    actualUSD: 83829.32,
    predictedUSD: 92759.52,
    actualINR: 6999748,
    predictedINR: 7745420,
    accuracy: "89.3%",
    errorPct: 10.65,
    event: "Christmas Rush & Year-End Budget Flush",
  },
];

// 2. Multi-Year Holiday Surge Progression (Nov + Dec Sales across Years)
const yearlyHolidayProgression = [
  {
    year: "2014",
    novSalesINR: 65.66,
    decSalesINR: 58.07,
    totalHolidayINR: 123.73,
    holidayShare: "36.7%",
  },
  {
    year: "2015",
    novSalesINR: 63.44,
    decSalesINR: 62.56,
    totalHolidayINR: 126.0,
    holidayShare: "38.5%",
  },
  {
    year: "2016",
    novSalesINR: 66.31,
    decSalesINR: 81.0,
    totalHolidayINR: 147.31,
    holidayShare: "34.6%",
  },
  {
    year: "2017",
    novSalesINR: 98.9,
    decSalesINR: 70.0,
    totalHolidayINR: 168.9,
    holidayShare: "40.3%",
  },
  {
    year: "2018 (Proj)",
    novSalesINR: 76.96,
    decSalesINR: 80.23,
    totalHolidayINR: 157.19,
    holidayShare: "37.2%",
  },
];

// 3. Demand Surge Index by Month (vs Q1 average baseline of 1.0x)
const surgeIndexData = [
  { month: "Jan", multiplier: 1.0, type: "Baseline" },
  { month: "Feb", multiplier: 0.8, type: "Trough" },
  { month: "Mar", multiplier: 1.8, type: "Corporate Surge" },
  { month: "Apr", multiplier: 1.3, type: "Normal" },
  { month: "May", multiplier: 1.4, type: "Normal" },
  { month: "Jun", multiplier: 1.5, type: "Normal" },
  { month: "Jul", multiplier: 1.4, type: "Normal" },
  { month: "Aug", multiplier: 1.6, type: "Restock" },
  { month: "Sep", multiplier: 2.7, type: "Early Ramp" },
  { month: "Oct", multiplier: 2.6, type: "Festive Prep" },
  { month: "Nov", multiplier: 3.8, type: "Mega Surge (Peak)" },
  { month: "Dec", multiplier: 3.2, type: "Holiday Super-Peak" },
];

const CustomForecastTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label" style={{ fontWeight: 700, color: "#f0f4ff" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#fbbf24", marginBottom: 6 }}>
        🎯 {data.event}
      </div>
      <div className="tooltip-item">
        <span className="tooltip-dot" style={{ background: "#4f8cff" }} />
        <span style={{ color: "#94a3b8" }}>Actual Revenue:</span>
        <span style={{ color: "#f0f4ff", fontWeight: 700 }}>
          ₹{(data.actualINR / 100000).toFixed(2)}L (${data.actualUSD.toLocaleString()})
        </span>
      </div>
      <div className="tooltip-item">
        <span className="tooltip-dot" style={{ background: "#10b981" }} />
        <span style={{ color: "#94a3b8" }}>ML Extra Trees Pred:</span>
        <span style={{ color: "#10b981", fontWeight: 700 }}>
          ₹{(data.predictedINR / 100000).toFixed(2)}L (${data.predictedUSD.toLocaleString()})
        </span>
      </div>
      <div className="tooltip-item" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 4, marginTop: 4 }}>
        <span style={{ color: "#94a3b8" }}>Forecast Accuracy:</span>
        <span style={{ color: "#a855f7", fontWeight: 700 }}>{data.accuracy}</span>
      </div>
    </div>
  );
};

export default function HolidaySurgeAnalysis() {
  const [activeTab, setActiveTab] = useState<"forecast" | "yearly" | "multiplier">("forecast");

  return (
    <div style={{ marginTop: 28 }}>
      {/* ─── Holiday Surge Header Badges & Headline ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div
          className="glass-sm"
          style={{
            padding: "16px 18px",
            borderLeft: "3px solid #fbbf24",
            background: "linear-gradient(135deg, rgba(251,191,36,0.06), rgba(255,255,255,0.02))",
          }}
        >
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#fbbf24", fontWeight: 700, letterSpacing: 0.5 }}>
            🎄 Holiday Demand Lift
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f0f4ff", margin: "4px 0" }}>
            +112.4%
          </div>
          <div style={{ fontSize: "0.76rem", color: "#94a3b8" }}>
            Over average Q1–Q3 non-holiday baseline
          </div>
        </div>

        <div
          className="glass-sm"
          style={{
            padding: "16px 18px",
            borderLeft: "3px solid #ec4899",
            background: "linear-gradient(135deg, rgba(236,72,153,0.06), rgba(255,255,255,0.02))",
          }}
        >
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#ec4899", fontWeight: 700, letterSpacing: 0.5 }}>
            🔥 All-Time Peak Month
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f0f4ff", margin: "4px 0" }}>
            ₹98.90 L
          </div>
          <div style={{ fontSize: "0.76rem", color: "#94a3b8" }}>
            November 2017 ($118.4k Black Friday record)
          </div>
        </div>

        <div
          className="glass-sm"
          style={{
            padding: "16px 18px",
            borderLeft: "3px solid #10b981",
            background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(255,255,255,0.02))",
          }}
        >
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#10b981", fontWeight: 700, letterSpacing: 0.5 }}>
            📦 90-Day Volume Share
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f0f4ff", margin: "4px 0" }}>
            37.6%
          </div>
          <div style={{ fontSize: "0.76rem", color: "#94a3b8" }}>
            Of entire annual Superstore revenue in Q4
          </div>
        </div>

        <div
          className="glass-sm"
          style={{
            padding: "16px 18px",
            borderLeft: "3px solid #4f8cff",
            background: "linear-gradient(135deg, rgba(79,140,255,0.06), rgba(255,255,255,0.02))",
          }}
        >
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#4f8cff", fontWeight: 700, letterSpacing: 0.5 }}>
            🤖 ML Q4 Capture Rate
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f0f4ff", margin: "4px 0" }}>
            88.7%
          </div>
          <div style={{ fontSize: "0.76rem", color: "#94a3b8" }}>
            ₹2.07 Cr predicted vs ₹2.34 Cr actual Q4
          </div>
        </div>
      </div>

      {/* ─── Interactive Tab Bar ─── */}
      <div className="tab-bar" style={{ marginBottom: 20 }}>
        <button
          className={`tab-btn ${activeTab === "forecast" ? "active" : ""}`}
          onClick={() => setActiveTab("forecast")}
        >
          🎯 Q4 Holiday Model vs Actual
        </button>
        <button
          className={`tab-btn ${activeTab === "yearly" ? "active" : ""}`}
          onClick={() => setActiveTab("yearly")}
        >
          📈 Multi-Year Holiday Growth
        </button>
        <button
          className={`tab-btn ${activeTab === "multiplier" ? "active" : ""}`}
          onClick={() => setActiveTab("multiplier")}
        >
          ⚡ Monthly Surge Multipliers
        </button>
      </div>

      {/* ─── TAB 1: Q4 Holiday Model vs Actual (Plot 6 from ML Pipeline) ─── */}
      {activeTab === "forecast" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              Comparing <strong style={{ color: "#4f8cff" }}>Actual Revenue</strong> against the{" "}
              <strong style={{ color: "#10b981" }}>Extra Trees Forecast</strong> during the Q4 2017 Holiday Season.
            </span>
            <span style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
              ✓ Stage 7 ML Benchmark
            </span>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={q4ForecastData} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" tick={{ fill: "#cbd5e1", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${((v * 83.5) / 100000).toFixed(0)}L`}
              />
              <Tooltip content={<CustomForecastTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 10 }} />
              <Bar dataKey="actualUSD" name="Actual Sales (USD)" fill="#4f8cff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="predictedUSD" name="Extra Trees Forecast (USD)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginTop: 16,
            }}
          >
            {q4ForecastData.map((d) => (
              <div key={d.month} className="glass-sm" style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#f0f4ff" }}>{d.month}</span>
                  <span style={{ color: d.errorPct < 15 ? "#10b981" : "#f59e0b", fontSize: "0.78rem", fontWeight: 700 }}>
                    Error: {d.errorPct}%
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: 6 }}>{d.event}</div>
                <div style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
                  <span>Actual: ₹{(d.actualINR / 100000).toFixed(1)}L</span>
                  <span>Model: ₹{(d.predictedINR / 100000).toFixed(1)}L</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: Multi-Year Holiday Rush Growth (Nov + Dec) ─── */}
      {activeTab === "yearly" && (
        <div>
          <div style={{ marginBottom: 12, fontSize: "0.85rem", color: "#94a3b8" }}>
            Combined November + December Holiday Sales Volume (in ₹ Lakhs) across all operating years:
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={yearlyHolidayProgression} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="year" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v}L`}
              />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0]?.payload;
                  return (
                    <div className="custom-tooltip">
                      <div className="tooltip-label">{label} Holiday Rush</div>
                      <div className="tooltip-item">
                        <span className="tooltip-dot" style={{ background: "#4f8cff" }} />
                        <span style={{ color: "#94a3b8" }}>November Sales:</span>
                        <span style={{ color: "#f0f4ff", fontWeight: 600 }}>₹{item.novSalesINR}L</span>
                      </div>
                      <div className="tooltip-item">
                        <span className="tooltip-dot" style={{ background: "#fbbf24" }} />
                        <span style={{ color: "#94a3b8" }}>December Sales:</span>
                        <span style={{ color: "#f0f4ff", fontWeight: 600 }}>₹{item.decSalesINR}L</span>
                      </div>
                      <div className="tooltip-item" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 4, marginTop: 4 }}>
                        <span style={{ color: "#10b981", fontWeight: 700 }}>Total Festive Rush:</span>
                        <span style={{ color: "#10b981", fontWeight: 800 }}>₹{item.totalHolidayINR}L ({item.holidayShare})</span>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 10 }} />
              <Bar dataKey="novSalesINR" name="November (Cyber/Black Friday)" fill="#4f8cff" stackId="a" radius={0} />
              <Bar dataKey="decSalesINR" name="December (Christmas/Year-End)" fill="#fbbf24" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 12, lineHeight: 1.5 }}>
            💡 <strong>Observation:</strong> The November-December holiday period has grown from ₹1.24 Cr in 2014 to a peak of ₹1.69 Cr in 2017, representing an overall <strong>+36.5% expansion</strong> in holiday purchasing power.
          </p>
        </div>
      )}

      {/* ─── TAB 3: Monthly Demand Surge Multipliers ─── */}
      {activeTab === "multiplier" && (
        <div>
          <div style={{ marginBottom: 12, fontSize: "0.85rem", color: "#94a3b8" }}>
            Monthly Demand Index relative to the post-holiday baseline (January = 1.0x):
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={surgeIndexData} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}x`}
              />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0]?.payload;
                  return (
                    <div className="custom-tooltip">
                      <div className="tooltip-label">{label} Demand Multiplier</div>
                      <div style={{ color: "#fbbf24", fontSize: "0.75rem", marginBottom: 4 }}>
                        Stage: {item.type}
                      </div>
                      <div className="tooltip-item">
                        <span style={{ color: "#94a3b8" }}>Multiplier:</span>
                        <span style={{ color: "#f0f4ff", fontWeight: 700, fontSize: "1rem" }}>
                          {item.multiplier}x Baseline
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <ReferenceLine y={1.0} stroke="#64748b" strokeDasharray="3 3" label={{ value: "1.0x Baseline", fill: "#94a3b8", fontSize: 10 }} />
              <Bar dataKey="multiplier" name="Surge Multiplier" radius={[4, 4, 0, 0]}>
                {surgeIndexData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.month === "Nov"
                        ? "#ec4899"
                        : entry.month === "Dec"
                        ? "#fbbf24"
                        : entry.month === "Oct" || entry.month === "Sep"
                        ? "#a855f7"
                        : "#4f8cff"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 12, lineHeight: 1.5 }}>
            ⚡ <strong>Surge Factor:</strong> November reaches a monumental <strong>3.8x baseline lift</strong>, followed by December at <strong>3.2x</strong>. This validates why the ML model prioritized the <code>Is_Q4</code> and <code>Sales_Lag_12</code> seasonal flags.
          </p>
        </div>
      )}

      {/* ─── Operational Holiday Surge Action Guide ─── */}
      <div
        className="glass-sm"
        style={{
          marginTop: 20,
          padding: "16px 20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fbbf24", marginBottom: 8 }}>
            📦 Holiday Supply Chain Protocol
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.8 }}>
            <li>• <strong>August 15 Buffer Lock:</strong> Pre-order 3.5x inventory buffers before factory price surges.</li>
            <li>• <strong>Carrier Capacity Reservation:</strong> Secure priority shipping slots with 3PL logistics by September.</li>
            <li>• <strong>Focus High-Margin Categories:</strong> Stock up on Technology &amp; High-End Office Supplies.</li>
          </ul>
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10b981", marginBottom: 8 }}>
            🤖 ML Model Role in Holiday Operations
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.8 }}>
            <li>• <strong>Seasonal Lag 12 Tracking:</strong> Accurately mirrors historical year-over-year surge contours.</li>
            <li>• <strong>Underestimation Buffer:</strong> Apply a +12% safety margin to Extra Trees output during peak November spikes.</li>
            <li>• <strong>Cashflow Allocation:</strong> Reserve Q1 profits to fund Q3 procurement for the holiday surge.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
