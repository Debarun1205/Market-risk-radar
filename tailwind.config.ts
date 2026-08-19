import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        "panel-alt": "var(--panel-alt)",
        border: "var(--border)",
        "border-soft": "var(--border-soft)",
        text: "var(--text)",
        "text-dim": "var(--text-dim)",
        "text-faint": "var(--text-faint)",
        amber: "var(--amber)",
        cyan: "var(--cyan)",
        rose: "var(--rose)",
        violet: "var(--violet)",
        green: "var(--green)",
        blue: "var(--blue)",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
