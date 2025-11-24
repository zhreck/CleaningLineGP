// web/app/admin/page.tsx
import Link from "next/link";

export default function AdminHomePage() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Resumen</h2>
      <p className="text-sm text-neutral-300">
        Desde aquí podrás administrar el catálogo, revisar pedidos y configurar
        promociones.
      </p>

      <div className="grid gap-3 md:grid-cols-2 text-sm">
        <Link
          href="/admin/products"
          className="rounded-lg border border-neutral-800 p-4 hover:bg-neutral-900 transition block"
        >
          <p className="font-medium">Productos</p>
          <p className="text-xs text-neutral-400">
            Agregar, editar o desactivar productos del catálogo.
          </p>
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-lg border border-neutral-800 p-4 hover:bg-neutral-900 transition block"
        >
          <p className="font-medium">Pedidos (próximamente)</p>
          <p className="text-xs text-neutral-400">
            Visualizar pedidos y estado de despacho.
          </p>
        </Link>
      </div>
    </section>
  );
}
