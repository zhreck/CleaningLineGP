"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "./themeToggle";
import { useCart } from "../cart/cartContext";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalog", label: "Catálogo" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { totalQuantity } = useCart();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-200 bg-white/80 backdrop-blur-md shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        {/* Logo + marca */}
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <Image
            src="/logo.jpeg"
            alt="Cleaning Line GP"
            width={40}
            height={40}
            className="rounded-full border border-emerald-200 shadow-sm"
          />
          <div className="leading-tight">
            <p className="text-[15px] font-bold text-emerald-800 dark:text-emerald-200">
              Cleaning Line GP
            </p>
            <p className="hidden text-[11px] text-emerald-500 sm:block dark:text-emerald-400/80">
              Productos de limpieza profesional
            </p>
          </div>
        </Link>

        {/* DESKTOP */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition font-medium ${
                  active
                    ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                    : "text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <ThemeToggle />

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-700 shadow-sm hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
          >
            🛒 Carrito
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              {totalQuantity}
            </span>
          </Link>
        </div>

        {/* MOBILE / TABLET CHICA */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <Link
            href="/cart"
            className="flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
          >
            🛒
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
              {totalQuantity}
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-sm hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900"
            aria-label="Abrir menú"
          >
            <div className="space-y-1">
              <span
                className={`block h-0.5 w-5 rounded-full bg-slate-800 dark:bg-slate-200 transition-transform ${
                  isOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-slate-800 dark:bg-slate-200 transition-opacity ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-slate-800 dark:bg-slate-200 transition-transform ${
                  isOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* MENÚ MÓVIL */}
      {isOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/95 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-2 px-5 py-4 text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`rounded-full px-3 py-2 transition ${
                    active
                      ? "bg-emerald-50 text-emerald-700 font-semibold dark:bg-slate-800 dark:text-emerald-300"
                      : "text-slate-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
