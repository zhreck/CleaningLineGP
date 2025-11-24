"use client";

import { useAuth } from "../../components/auth/authContext";
import { RequireAuth } from "../../components/auth/requireAuth";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <RequireAuth>
      <section className="mx-auto max-w-lg space-y-4">
        <h1 className="text-2xl font-semibold">Mi perfil</h1>

        <div className="rounded-lg border border-neutral-800 p-4 text-sm">
          <p>
            <span className="text-neutral-400">Nombre:</span> {user?.name}
          </p>
          <p>
            <span className="text-neutral-400">Correo:</span> {user?.email}
          </p>
          <p>
            <span className="text-neutral-400">Rol:</span> {user?.role}
          </p>
        </div>

        <button
          onClick={logout}
          className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          Cerrar sesión
        </button>
      </section>
    </RequireAuth>
  );
}
