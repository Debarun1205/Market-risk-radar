import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Risk Radar",
  description:
    "Global company footprint, correlation heatmap, and factor radar with an AI analyst layer.",
};

// Loaded via a plain <link> rather than next/font/google so the production
// build never depends on being able to reach fonts.googleapis.com at build
// time — some CI/deploy environments restrict that. Falls back to the
// system font stack in tokens.css if the request is blocked at runtime.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
