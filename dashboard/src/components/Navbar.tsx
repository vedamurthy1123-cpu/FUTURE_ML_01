"use client";

const navLinks = [
  { href: "#overview", label: "Overview" },
  { href: "#historical", label: "Historical Trends" },
  { href: "#seasonality", label: "Quarterly Trends" },
  { href: "#holiday-surge", label: "Holiday Surge" },
  { href: "#future", label: "2018 Forecast" },
  { href: "#insights", label: "Strategic Insights" },
  { href: "#performance", label: "Model Performance" },
];

export default function Navbar() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <a href="#" className="nav-brand">
          <div className="nav-logo-icon">📈</div>
          <span>VikrayVridhi</span>
        </a>
        <ul className="nav-links">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => scrollTo(e, l.href)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-badge">2018 Target: ₹5.71 Cr</div>
      </div>
    </nav>
  );
}
