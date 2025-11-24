// web/components/navbar/themeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // evitar desajuste entre server y client
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        flex items-center gap-1
        rounded-full border border-emerald-300
        px-3 py-1 text-xs font-medium
        text-emerald-700 hover:bg-emerald-50
        dark:text-emerald-200 dark:border-emerald-500 dark:hover:bg-emerald-900/40
        transition
      "
    >
      <span className="hidden sm:inline">
        {isDark ? "Modo claro" : "Modo oscuro"}
      </span>
      <span aria-hidden className="text-lg leading-none">
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
