import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/globals.css";

import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../components/cart/cartContext";

export const metadata: Metadata = {
  title: "Cleaning Line GP · Limpieza y aseo",
  description: "Productos de limpieza para hogar y empresas.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 py-6 px-4 lg:px-8">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
