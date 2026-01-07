"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../cart/cartContext";
import { useAuth } from "../../contexts/AuthContext";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { totalQuantity } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    router.push("/");
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-200 bg-white/90 backdrop-blur-md shadow-sm">
      <nav className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        {/* Logo + marca */}
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <Image
            src="/favicon.ico"
            alt="Cleaning Line GP"
            width={42}
            height={42}
            className="rounded-full border border-emerald-300 shadow-sm"
          />
          <div className="leading-tight">
            <p className="text-[15px] font-bold text-emerald-800">
              Cleaning Line GP
            </p>
            <p className="hidden text-[11px] text-emerald-500 sm:block">
              Productos de limpieza profesional
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li
                  key={link.href}
                  className={[
                    "relative transform skew-x-12 rounded shadow-sm transition-colors",
                    active
                      ? "bg-emerald-700"
                      : "bg-emerald-800 hover:bg-emerald-600",
                  ].join(" ")}
                >
                  <Link
                    href={link.href}
                    className="block transform -skew-x-12 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Usuario autenticado o login (DESKTOP) */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {getInitials(user.email)}
                </span>
                <span className="max-w-[120px] truncate">{user.email}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${showUserMenu ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-emerald-200 bg-white shadow-lg">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-emerald-800 hover:bg-emerald-50"
                    >
                      Mi perfil
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-emerald-800 hover:bg-emerald-50"
                      >
                        Panel de admin
                      </Link>
                    )}

                    <hr className="my-1 border-emerald-100" />

                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center rounded-full border border-emerald-300 bg-white px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50"
            >
              Iniciar sesión
            </Link>
          )}

          {/* Carrito */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500"
          >
            🛒Carrito
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold">
              {totalQuantity}
            </span>
          </Link>
        </div>

        {/* MOBILE menu + login + cart */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && user ? (
            <Link
              href="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm"
            >
              {getInitials(user.email)}
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center rounded-full border border-emerald-300 bg-white px-3 py-1 text-[11px] font-medium text-emerald-700 shadow-sm hover:bg-emerald-50"
            >
              Iniciar
            </Link>
          )}

          {/* Carrito mobile */}
          <Link
            href="/cart"
            className="flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm hover:bg-emerald-100"
          >
            🛒
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
              {totalQuantity}
            </span>
          </Link>

          {/* Hamburguesa */}
          <button
            type="button"
            onClick={toggleMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-sm hover:bg-emerald-50"
            aria-label="Abrir menú"
          >
            <div className="space-y-1">
              <span
                className={`block h-0.5 w-5 rounded-full bg-emerald-900 transition-transform ${isOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-emerald-900 transition-opacity ${isOpen ? "opacity-0" : "opacity-100"
                  }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-emerald-900 transition-transform ${isOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="border-t border-emerald-100 bg-white/95 shadow-sm md:hidden">
          <div className="flex flex-col gap-2 px-5 py-4 text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={[
                    "rounded-full px-3 py-2 transition-colors",
                    active
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-emerald-800 hover:bg-emerald-50",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* User options mobile */}
            {isAuthenticated && (
              <>
                <hr className="my-2 border-emerald-100" />

                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="rounded-full px-3 py-2 text-emerald-800 hover:bg-emerald-50"
                >
                  Mi perfil
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="rounded-full px-3 py-2 text-emerald-800 hover:bg-emerald-50"
                  >
                    Panel de admin
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="rounded-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
