"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(""); // ← agregado desde main
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      // `main` no incluía el uso de name en el backend, así que
      // lo ignoramos para no romper el flujo actual.
      await register(email, password);
      setSuccess(true);

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "El correo ya está registrado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <section className="mx-auto max-w-sm space-y-4">
        <div className="rounded border border-emerald-500 bg-emerald-950/40 px-4 py-3 text-center">
          <p className="text-sm text-emerald-200 font-semibold mb-2">
            ✓ Cuenta creada exitosamente
          </p>
          <p className="text-xs text-emerald-300">
            Redirigiendo al inicio de sesión...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 rounded-3xl border border-border bg-card px-6 py-8 shadow-sm">
      {/* Encabezado */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Crear cuenta
        </h1>
        <p className="text-base text-muted-foreground">
          Regístrate para seguir tus pedidos y recibir ofertas.
        </p>
      </header>

      {/* Error */}
      {error && (
        <p className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4 text-base">
        {/* Nombre completo */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Nombre completo
          </label>
          <input
            required
            className="
              w-full rounded-2xl border border-border bg-white
              px-3 py-2.5 text-base text-foreground
              placeholder:text-muted-foreground
              outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
            "
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Pedrito Pascal"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            className="
              w-full rounded-2xl border border-border bg-white
              px-3 py-2.5 text-base text-foreground
              placeholder:text-muted-foreground
              outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.cl"
            autoComplete="email"
          />
        </div>

        {/* Contraseña */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Contraseña
          </label>
          <input
            type="password"
            required
            minLength={6}
            className="
              w-full rounded-2xl border border-border bg-white
              px-3 py-2.5 text-base text-foreground
              placeholder:text-muted-foreground
              outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
        </div>

        {/* Confirmación */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Confirmar contraseña
          </label>
          <input
            type="password"
            required
            minLength={6}
            className="
              w-full rounded-2xl border border-border bg-white
              px-3 py-2.5 text-base text-foreground
              placeholder:text-muted-foreground
              outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
            "
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            mt-2 w-full rounded-2xl bg-emerald-600 py-2.5
            text-base font-semibold text-white hover:bg-emerald-500
            disabled:cursor-not-allowed disabled:opacity-70
          "
        >
          {isSubmitting ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>

      {/* Enlace login */}
      <p className="text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Ingresar
        </Link>
      </p>
    </section>
  );
}
