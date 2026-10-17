import Navbar from "@/components/Navbar";
import KPIGrid from "@/components/KPIGrid";
import HistoricalSalesChart from "@/components/HistoricalSalesChart";
import QuarterlyTrends from "@/components/QuarterlyTrends";
import FutureForecast2018 from "@/components/FutureForecast2018";
import HolidaySurgeAnalysis from "@/components/HolidaySurgeAnalysis";
import BusinessInsights from "@/components/BusinessInsights";

export default function Home() {
  return (
    <>
      {/* ─── Animated Background ─── */}
      <div className="bg-animated" aria-hidden>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* ─── Navbar ─── */}
      <Navbar />

      <main>
        {/* ═══════════════════════════════════
            HERO
            ═══════════════════════════════════ */}
        <section className="hero container" id="hero">
          <div className="hero-tag">
            <span className="dot" />
            Executive Dashboard · 2018 Revenue Projections
          </div>

          <h1 className="hero-title">
            Superstore Sales &amp;{" "}
            <span className="gradient-text">Revenue Intelligence</span>
          </h1>

          <p className="hero-sub">
            Comprehensive business sales analytics and demand forecasting.
            Explore 4 years of monthly transaction trends, quarterly seasonality
            dynamics, and 12-month forward revenue projections in Indian Rupees (₹).
          </p>

          <div className="hero-cta-row">
            <a href="#historical" className="btn-primary">
              📊 Historical Sales
            </a>
            <a href="#future" className="btn-ghost">
              🔮 2018 Forecast
            </a>
            <a href="#insights" className="btn-ghost">
              💡 Strategic Insights
            </a>
          </div>

          {/* ─── KPI Metrics ─── */}
          <div id="overview">
            <KPIGrid />
          </div>
        </section>

        {/* ═══════════════════════════════════
            HISTORICAL SALES
            ═══════════════════════════════════ */}
        <section className="section" id="historical">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Historical Analysis</div>
              <h2 className="section-title">
                Monthly Sales &amp; Profit{" "}
                <span className="gradient-text">2014 – 2017</span>
              </h2>
              <div className="gradient-divider" />
              <p className="section-desc">
                48 months of Superstore transactions aggregated by monthly series.
                Strong Q4 seasonality (Sep–Dec) and 20.4% year-over-year
                growth trajectory are clearly evident.
              </p>
            </div>

            <div className="glass chart-card">
              <div className="chart-title">Monthly Sales &amp; Profit Over Time (INR)</div>
              <div className="chart-subtitle">
                Filter by individual year · Toggle Sales / Profit / Combined metrics
              </div>
              <HistoricalSalesChart />
            </div>

            {/* Yearly summary */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
                marginTop: 20,
              }}
            >
              {[
                { year: "2014", sales: "₹4.04 Cr", growth: "—", color: "#4f8cff" },
                { year: "2015", sales: "₹3.93 Cr", growth: "−2.7%", color: "#a855f7" },
                { year: "2016", sales: "₹5.09 Cr", growth: "+29.5%", color: "#10b981" },
                { year: "2017", sales: "₹6.12 Cr", growth: "+20.4%", color: "#fbbf24" },
              ].map((y) => (
                <div
                  key={y.year}
                  className="glass-sm"
                  style={{ padding: "18px 20px", textAlign: "center" }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: y.color,
                    }}
                  >
                    {y.year}
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#f0f4ff",
                      margin: "4px 0",
                    }}
                  >
                    {y.sales}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color:
                        y.growth.startsWith("+")
                          ? "#10b981"
                          : y.growth.startsWith("−")
                          ? "#f87171"
                          : "#94a3b8",
                    }}
                  >
                    YoY {y.growth}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            SEASONALITY & QUARTERLY ANALYSIS
            ═══════════════════════════════════ */}
        <section className="section" id="seasonality">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Seasonal Dynamics</div>
              <h2 className="section-title">
                Quarterly Demand &amp;{" "}
                <span className="gradient-text">Holiday Surge Analysis</span>
              </h2>
              <div className="gradient-divider" />
              <p className="section-desc">
                Comparative analysis of demand patterns across Q1, Q2, Q3, and Q4.
                Understanding cyclical variations enables proactive inventory planning
                and cashflow optimization.
              </p>
            </div>

            <div className="glass chart-card">
              <div className="chart-title">Quarterly Revenue Distribution (2014 – 2017)</div>
              <div className="chart-subtitle">
                Toggle between grouped comparison and cumulative quarterly share
              </div>
              <QuarterlyTrends />
            </div>

            {/* Dedicated Holiday Surge Breakdown */}
            <div className="glass chart-card" style={{ marginTop: 28 }} id="holiday-surge">
              <div className="chart-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>🎄 Q4 Holiday Surge &amp; Seasonal Peak Analysis</span>
                </div>
                <span className="badge badge-accent" style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: 20 }}>
                  High-Impact Season Focus
                </span>
              </div>
              <div className="chart-subtitle">
                Deep-dive into November–December demand acceleration, Extra Trees ML forecast validation, and multi-year trajectory
              </div>
              <HolidaySurgeAnalysis />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            FUTURE FORECAST 2018
            ═══════════════════════════════════ */}
        <section className="section" id="future">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Forward Projections</div>
              <h2 className="section-title">
                2018 Monthly{" "}
                <span className="gradient-text">Sales &amp; Demand Forecast</span>
              </h2>
              <div className="gradient-divider" />
              <p className="section-desc">
                Projected monthly revenue trajectory for January – December 2018.
                Accounts for seasonal demand spikes, historical baseline growth,
                and expected Q4 holiday momentum.
              </p>
            </div>

            <div className="glass chart-card">
              <div className="chart-title">2018 Monthly Sales Projections (INR)</div>
              <div className="chart-subtitle">
                Interactive monthly trajectory · ★ marks high-volume Q4 months
              </div>
              <FutureForecast2018 />
            </div>

            {/* Strategic Drivers Callout */}
            <div
              className="glass"
              style={{
                padding: 28,
                marginTop: 20,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
              }}
            >
              <div>
                <div
                  style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 16, color: "#4f8cff" }}
                >
                  🚀 Key Forecast Drivers
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    fontSize: "0.84rem",
                    color: "#94a3b8",
                    lineHeight: 1.9,
                    padding: 0,
                  }}
                >
                  <li>✓ <strong>Q4 Revenue Explosion:</strong> Projected ₹2.25+ Cr across Oct–Dec.</li>
                  <li>✓ <strong>Corporate Refresh Cycles:</strong> March &amp; September procurement surges.</li>
                  <li>✓ <strong>Consistent Base Run-rate:</strong> Average ₹47.58 Lakhs monthly sales floor.</li>
                  <li>✓ <strong>Peak Holiday Demand:</strong> December projected at record ₹80.23 Lakhs.</li>
                </ul>
              </div>
              <div>
                <div
                  style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 16, color: "#fbbf24" }}
                >
                  📋 Operational Recommendations
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    fontSize: "0.84rem",
                    color: "#94a3b8",
                    lineHeight: 1.9,
                    padding: 0,
                  }}
                >
                  <li>→ <strong>Early Warehouse Booking:</strong> Secure additional fulfillment capacity by Q3.</li>
                  <li>→ <strong>Supplier Price Locks:</strong> Contract bulk supplier pricing before festive rush.</li>
                  <li>→ <strong>Working Capital Management:</strong> Buffer liquidity in Q1 to fund Q3 procurement.</li>
                  <li>→ <strong>Targeted Account Promotions:</strong> Schedule B2B outreach 45 days ahead of quarter-ends.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            STRATEGIC BUSINESS INSIGHTS
            ═══════════════════════════════════ */}
        <section className="section" id="insights">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Strategic Planning</div>
              <h2 className="section-title">
                Executive Action Plan &amp;{" "}
                <span className="gradient-text">Growth Strategies</span>
              </h2>
              <div className="gradient-divider" />
              <p className="section-desc">
                Key strategic pillars designed to maximize revenue capture, protect profit
                margins, and streamline inventory operations.
              </p>
            </div>

            <BusinessInsights />
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="footer">
          <div className="container">
            <div className="footer-logo gradient-text">VikrayVridhi</div>
            <div className="footer-sub">
              Executive Sales Intelligence &amp; 2018 Revenue Forecasting
            </div>
            <div className="footer-tags">
              {[
                "48 Months Historical Data",
                "Total Revenue: ₹19.19 Cr",
                "Net Profit: ₹2.39 Cr",
                "2018 Forecast: ₹5.71 Cr",
                "37.6% Q4 Share",
                "9,994 Total Orders",
                "12-Month Forward Plan",
              ].map((t) => (
                <span key={t} className="footer-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
