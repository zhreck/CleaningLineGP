// web/components/themeProvider.tsx
"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"   // agrega la clase "dark" al <html>
      defaultTheme="light"
      enableSystem={false} // si quieres usar tema del sistema, cambia a true
    >
      {children}
    </ThemeProvider>
  );
}
