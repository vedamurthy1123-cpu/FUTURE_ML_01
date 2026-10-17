"use client";

const strategicPillars = [
  {
    step: "01",
    title: "Q4 Peak Season Inventory Buffer",
    category: "Supply Chain & Operations",
    description:
      "November & December consistently account for over 37% of yearly revenue. Lock supplier procurement by August to prevent stockouts during peak holiday demand.",
    tags: ["Safety Stock +40%", "Early Procurement", "Logistics Scaling"],
    gradient: "linear-gradient(90deg, #4f8cff, #06b6d4)",
    icon: "📦",
  },
  {
    step: "02",
    title: "Technology & High-Margin Bundling",
    category: "Revenue & Margins",
    description:
      "Technology products deliver the highest basket value and profit contribution. Introduce corporate accessory bundles to increase average order values beyond ₹25,000.",
    tags: ["12.5% Avg Margin", "B2B Bundles", "High Ticket Items"],
    gradient: "linear-gradient(90deg, #a855f7, #4f8cff)",
    icon: "💻",
  },
  {
    step: "03",
    title: "Q1 Working Capital Optimization",
    category: "Financial Planning",
    description:
      "Historical data shows Jan–Feb represents the lowest volume period (16.8% share). Reallocate operating cashflows and schedule maintenance during Q1 troughs.",
    tags: ["Cash Reserve", "Cost Control", "Maintenance Window"],
    gradient: "linear-gradient(90deg, #ec4899, #a855f7)",
    icon: "💵",
  },
  {
    step: "04",
    title: "Enterprise Corporate Restocking",
    category: "Sales Strategy",
    description:
      "March and September show sharp corporate fiscal procurement spikes. Deploy targeted account renewal campaigns 45 days prior to quarter-ends.",
    tags: ["Q1 & Q3 Spikes", "Enterprise CRM", "Contract Renewals"],
    gradient: "linear-gradient(90deg, #10b981, #06b6d4)",
    icon: "🏢",
  },
  {
    step: "05",
    title: "2018 Revenue Target Realization",
    category: "Forward Strategy",
    description:
      "Projected annual sales of ₹5.71 Cr requires maintaining a monthly average run-rate of ₹47.58L with a target December finish above ₹80 Lakhs.",
    tags: ["₹5.71 Cr Target", "₹47.58L / mo Avg", "Dec ₹80L Peak"],
    gradient: "linear-gradient(90deg, #fbbf24, #f59e0b)",
    icon: "🎯",
  },
  {
    step: "06",
    title: "Customer Retention & Basket Size",
    category: "Customer Experience",
    description:
      "Over 9,994 lifetime orders indicate a strong repeat-buyer base. Implement tier-based loyalty incentives for top 20% high-frequency corporate buyers.",
    tags: ["9,994 Orders", "Loyalty Programs", "Tiered Discounts"],
    gradient: "linear-gradient(90deg, #f87171, #ec4899)",
    icon: "⭐",
  },
];

export default function BusinessInsights() {
  return (
    <div className="stages-grid">
      {strategicPillars.map((p, i) => (
        <div
          key={p.step}
          className="glass stage-card fade-in"
          style={{
            animationDelay: `${i * 0.08}s`,
            borderTop: "3px solid transparent",
            borderImage: `${p.gradient} 1`,
          }}
        >
          <div className="stage-num" style={{ background: p.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {p.icon} Strategy {p.step}
          </div>
          <div className="stage-title">{p.title}</div>
          <div style={{ fontSize: "0.72rem", color: "#60a5fa", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {p.category}
          </div>
          <div className="stage-desc">{p.description}</div>
          <div className="stage-tags">
            {p.tags.map((t) => (
              <span key={t} className="stage-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
