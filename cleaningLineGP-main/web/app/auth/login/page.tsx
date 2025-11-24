"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/auth/authContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const ok = await login(email, password);
    setIsSubmitting(false);

    if (!ok) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    // después puedes leer el rol y mandar a /admin o /profile
    router.push("/profile");
  };

  return (
    <section className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-semibold">Ingresar</h1>
      <p className="text-sm text-neutral-400">
        Accede a tu cuenta para ver tus compras y estado de pedidos.
      </p>

      {error && (
        <p className="rounded border border-red-500 bg-red-950/40 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="mb-1 block text-xs text-neutral-400">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.cl"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-neutral-400">
            Contraseña
          </label>
          <input
            type="password"
            required
            className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="text-sm text-neutral-400">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/register" className="text-emerald-400 underline">
          Crear cuenta
        </Link>
      </p>
    </section>
  );
}
