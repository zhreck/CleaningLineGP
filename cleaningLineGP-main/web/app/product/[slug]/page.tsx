// web/app/product/[slug]/page.tsx
import Link from "next/link";
import { fetchProductBySlug } from "../../../lib/api";
import AddToCartButton from "../../../components/products/addToCartButton";

type ProductPageProps = {
  params: { slug: string };
};

function formatPriceCLP(value: number) {
  if (Number.isNaN(value)) return "$0";
  return value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProductBySlug(params.slug);

  // Si el backend no lo encuentra, fetchProductBySlug ya devuelve uno “Producto no encontrado”
  const isNotFound = product.id === "0";

  return (
    <section className="space-y-6">
      {/* Migas de pan */}
      <nav className="text-xs text-neutral-500">
        <Link href="/catalog" className="underline">
          Catálogo
        </Link>{" "}
        / <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 items-start">
        {/* Imagen principal */}
        <div className="rounded-xl border border-neutral-200 bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            className="h-72 w-full object-cover rounded-lg"
          />
        </div>

        {/* Información del producto */}
        <div className="space-y-4">
          {/* Nombre y (opcional) categoría */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold">
              {product.name}
            </h1>

            {/* Si en el futuro agregas categoryName o similar en el tipo Product */}
            {"categoryName" in product && product.categoryName && (
              <p className="text-sm text-neutral-500">
                Categoría: {product.categoryName}
              </p>
            )}
          </div>

          {/* Precio + estado */}
          <div className="space-y-1">
            <p className="text-xl font-semibold text-neutral-900">
              {formatPriceCLP(product.price)}
            </p>
            {/* Stock opcional si lo agregas en el tipo Product */}
            {"stock" in product && typeof (product as any).stock === "number" && (
              <p className="text-sm text-neutral-600">
                {(product as any).stock > 0
                  ? `Stock disponible: ${(product as any).stock} unidad${
                      (product as any).stock === 1 ? "" : "es"
                    }`
                  : "Sin stock disponible"}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-neutral-800">
              Descripción
            </h2>
            <p className="text-sm text-neutral-600">
              {product.description || "Producto sin descripción detallada."}
            </p>
          </div>

          {/* Info de despacho y retiro */}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700 space-y-1">
            <p>
              🛻 <span className="font-semibold">Despacho disponible.</span> Sobre
              $50.000 en productos, el envío es{" "}
              <span className="font-semibold">gratis</span>.
            </p>
            <p>
              📍 Retiro en tienda disponible hasta el sábado. Días de trabajo de
              lunes a domingo.
            </p>
            <p className="text-neutral-500">
              Los tiempos y costo final de despacho se confirman al coordinar el
              pedido.
            </p>
          </div>

          {/* Fichas técnicas / hojas de seguridad (texto por ahora) */}
          <div className="space-y-1 text-xs text-neutral-600">
            <p className="font-semibold">Fichas técnicas y seguridad</p>
            <p>
              Si el producto lo requiere, se pueden adjuntar fichas técnicas u
              hojas de seguridad (PDF) para descargas futuras.
            </p>
          </div>

          {/* Botón de agregar al carrito */}
          {!isNotFound && (
            <div className="pt-2">
              <AddToCartButton product={product} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
