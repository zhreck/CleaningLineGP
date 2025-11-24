// web/app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/globals.css";

import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { AppThemeProvider } from "../components/themes/themeProvider";
import { AuthProvider } from "../components/auth/authContext";
import { CartProvider } from "../components/cart/cartContext";

export const metadata: Metadata = {
  title: "Cleaning Line GP · Limpieza y aseo",
  description: "Productos de limpieza para hogar y empresas.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300">
        <AppThemeProvider>
          <AuthProvider>
            <CartProvider>
              <div className="w-full">
                <Navbar />
                <main className="py-6 px-4 lg:px-8">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
