"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

export default function LoginForm() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/profile";
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);

      const redirect = searchParams.get("redirect") || "/profile";
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Correo o contraseña incorrectos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 rounded-3xl border border-border bg-card px-6 py-8 shadow-sm">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Ingresar</h1>
        <p className="text-base text-muted-foreground">
          Accede a tu cuenta para ver tus compras y estado de pedidos.
        </p>
      </header>

      {error && (
        <p className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-base">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.cl"
            autoComplete="email"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Contraseña
          </label>
          <input
            type="password"
            required
            className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-2xl bg-emerald-600 py-2.5 text-base font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Crear cuenta
        </Link>
      </p>
    </section>
  );
}
