import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Superstore Sales & Revenue Intelligence Dashboard",
  description:
    "Executive interactive sales dashboard for Superstore business performance. Explore 4-year historical sales trends, quarterly seasonality dynamics, and 2018 forward revenue forecasts.",
  keywords: [
    "sales dashboard",
    "revenue forecast",
    "business intelligence",
    "superstore analytics",
    "seasonal demand",
    "executive KPI",
  ],
  authors: [{ name: "Superstore Analytics" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
