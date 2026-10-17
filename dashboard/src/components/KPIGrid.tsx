"use client";

const kpis = [
  {
    icon: "💰",
    value: "₹19.19 Cr",
    label: "Total Revenue",
    change: "+20.4% YoY Growth",
    positive: true,
    colorA: "rgba(79,140,255,0.12)",
    colorB: "rgba(79,140,255,0.03)",
  },
  {
    icon: "📊",
    value: "₹2.39 Cr",
    label: "Net Profit",
    change: "12.5% Profit Margin",
    positive: true,
    colorA: "rgba(16,185,129,0.12)",
    colorB: "rgba(16,185,129,0.03)",
  },
  {
    icon: "🧾",
    value: "9,994",
    label: "Total Orders",
    change: "4-Year Cumulative",
    positive: true,
    colorA: "rgba(168,85,247,0.12)",
    colorB: "rgba(168,85,247,0.03)",
  },
  {
    icon: "📦",
    value: "37,873",
    label: "Units Sold",
    change: "Product Volume",
    positive: true,
    colorA: "rgba(6,182,212,0.12)",
    colorB: "rgba(6,182,212,0.03)",
  },
  {
    icon: "🔮",
    value: "₹5.71 Cr",
    label: "2018 Projected Sales",
    change: "12-Month Target",
    positive: true,
    colorA: "rgba(236,72,153,0.12)",
    colorB: "rgba(236,72,153,0.03)",
  },
  {
    icon: "🔥",
    value: "₹80.23L",
    label: "Peak Month Forecast",
    change: "December Peak",
    positive: true,
    colorA: "rgba(251,191,36,0.12)",
    colorB: "rgba(251,191,36,0.03)",
  },
  {
    icon: "📈",
    value: "₹47.58L",
    label: "Avg Monthly Sales",
    change: "Run-rate Baseline",
    positive: true,
    colorA: "rgba(79,140,255,0.14)",
    colorB: "rgba(79,140,255,0.04)",
  },
  {
    icon: "⚡",
    value: "+62.8%",
    label: "Q4 Holiday Lift",
    change: "vs Q1 Baseline",
    positive: true,
    colorA: "rgba(16,185,129,0.14)",
    colorB: "rgba(16,185,129,0.04)",
  },
];

export default function KPIGrid() {
  return (
    <div className="kpi-grid">
      {kpis.map((k, i) => (
        <div
          className="glass kpi-card fade-in"
          key={i}
          style={{
            animationDelay: `${i * 0.07}s`,
            // @ts-ignore
            "--kpi-color-a": k.colorA,
            "--kpi-color-b": k.colorB,
          }}
        >
          <span className="kpi-icon">{k.icon}</span>
          <div className="kpi-value">{k.value}</div>
          <div className="kpi-label">{k.label}</div>
          <div className={`kpi-change ${k.positive ? "positive" : "negative"}`}>
            {k.positive ? "▲" : "▼"} {k.change}
          </div>
        </div>
      ))}
    </div>
  );
}
