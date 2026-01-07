// web/tailwind.config.ts
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", ...fontFamily.sans],
      },
      fontSize: {
        xs: ["0.85rem", { lineHeight: "1.4" }],
        sm: ["0.95rem", { lineHeight: "1.5" }],
        base: ["1.05rem", { lineHeight: "1.5" }],
        lg: ["1.25rem", { lineHeight: "1.5" }],
        xl: ["1.45rem", { lineHeight: "1.3" }],
      },
      colors: {
        // para usar tokens de globals.css al estilo shadcn
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        card: "oklch(var(--card))",
        "card-foreground": "oklch(var(--card-foreground))",
        muted: "oklch(var(--muted))",
        "muted-foreground": "oklch(var(--muted-foreground))",
        sidebar: "oklch(var(--sidebar))",
        "sidebar-foreground": "oklch(var(--sidebar-foreground))",
        "sidebar-border": "oklch(var(--sidebar-border))",
        "sidebar-primary": "oklch(var(--sidebar-primary))",
        "sidebar-primary-foreground": "oklch(var(--sidebar-primary-foreground))",
        "sidebar-accent": "oklch(var(--sidebar-accent))",
        "sidebar-accent-foreground": "oklch(var(--sidebar-accent-foreground))",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
