// web/app/page.tsx
import Link from "next/link";
import OffersCarousel from "../components/carousel/offersCarousel";
import ProductGrid from "../components/products/productGrid";
import { fetchProducts } from "../lib/api";
import { getFinalPrice, formatCLP } from "../lib/price";

export default async function HomePage() {
  const products = await fetchProducts();

  // destacados para home
  const featured = products.filter((p) => p.isFeatured);
  const heroFeatured = (featured.length ? featured : products).slice(0, 6);

  return (
    <section className="space-y-10">
      {/* HERO PRINCIPAL */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 px-6 py-8 shadow-sm">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          {/* Texto */}
          <div className="space-y-4">
            <p className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900">
              {/* ★ antes text-xs + emerald-800 */}
              Cleaning Line GP · Productos de limpieza y aseo
            </p>

            <h1 className="text-3xl font-semibold leading-tight text-emerald-900 md:text-4xl">
              Soluciones de limpieza para hogares, negocios y empresas.
            </h1>

            <p className="max-w-xl text-base text-slate-900 md:text-lg">
              {/* ★ subí de text-sm/md:text-base y lo dejé casi negro */}
              Arma tu pedido de productos de limpieza y aseo, coordina despacho
              a tu comuna o retira en punto de entrega en Pudahuel. Trabajamos
              con formatos familiares y para uso profesional.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/catalogo"
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Ver catálogo
              </Link>
              <Link
                href="/contacto"
                className="rounded-full border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                Cotizar por WhatsApp / correo
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 pt-3 text-sm text-slate-900">
              {/* ★ antes text-xs y gris medio */}
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Despacho en días hábiles según comuna.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Retiro coordinado en Pudahuel.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Facturación disponible para empresas.</span>
              </div>
            </div>
          </div>

          {/* Lado derecho: resumen visual de productos */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-emerald-100/40 blur-3xl" />
            <div className="relative rounded-3xl border border-emerald-200 bg-white p-5 shadow-md">
              {/* ★ fondo más sólido (antes bg-white/90) y padding un poco mayor */}
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-800">
                {/* ★ era text-xs */}
                Algunos productos destacados
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {/* ★ antes text-xs en todo el bloque */}
                {heroFeatured.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2.5"
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-emerald-900">
                      {/* ★ text-[11px] -> text-sm, font-medium -> font-semibold */}
                      {p.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-900">
                      {/* ★ gris medio -> casi negro */}
                      {p.category?.name ?? "Producto de limpieza"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-800">
                      {formatCLP(getFinalPrice(p))}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-800">
                {/* ★ text-[11px] + slate-500 -> text-sm + slate-800 */}
                Revisa el catálogo completo para ver formatos, concentraciones
                y más opciones de productos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BENEFICIOS / SELL POINTS */}
      <div className="grid gap-4 text-base md:grid-cols-3">
        {/* ★ text-sm -> text-base */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Despachos y retiros
          </p>
          <p className="mt-1 text-slate-900">
            Entregas coordinadas en Pudahuel y comunas cercanas. Opción de
            retiro en punto de entrega en sector Laguna Azul con La Estrella.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Hogar y empresas
          </p>
          <p className="mt-1 text-slate-900">
            Productos pensados tanto para uso doméstico como para negocios,
            oficinas y pequeñas empresas.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Facturación y compras grandes
          </p>
          <p className="mt-1 text-slate-900">
            Emitimos boleta y factura. Si necesitas comprar en volumen, podemos
            preparar cotizaciones especiales.
          </p>
        </div>
      </div>

      {/* CARRUSEL DE DESTACADOS (si hay) */}
      {heroFeatured.length > 0 && (
        <div className="space-y-3">
          <OffersCarousel
            products={heroFeatured}
            title="Productos destacados"
            subtitle="Algunos de los productos más solicitados por nuestros clientes."
          />
        </div>
      )}

      {/* MINI CATÁLOGO / GRID */}
      {heroFeatured.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-emerald-900">
              {/* ★ emerald-800 -> 900 */}
              Explora el catálogo
            </h2>
            <Link
              href="/catalogo"
              className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-900"
            >
              Ver todos los productos
            </Link>
          </div>
          <ProductGrid products={heroFeatured} />
        </div>
      )}

      {/* CÓMO COMPRAR */}
      <div className="mt-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        {/* ★ bg-white/90 -> bg-white */}
        <h2 className="text-lg font-semibold text-emerald-900">
          ¿Cómo comprar en Cleaning Line GP?
        </h2>
        <p className="mt-1 text-base text-slate-900">
          {/* ★ antes text-sm slate-700 */}
          Por ahora el proceso es semi-asistido, ideal para coordinar bien
          formatos, cantidades y despacho.
        </p>

        <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
          <div className="space-y-1">
            <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              1
            </p>
            <p className="font-semibold text-emerald-900">
              Explora el catálogo
            </p>
            <p className="text-slate-900">
              Revisa los productos, formatos y precios en el catálogo. Puedes
              usar los filtros para encontrar lo que necesitas.
            </p>
          </div>
          <div className="space-y-1">
            <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              2
            </p>
            <p className="font-semibold text-emerald-900">Arma tu pedido</p>
            <p className="text-slate-900">
              Anota los productos y cantidades. Si lo prefieres, podemos usar el
              carrito del sitio como apoyo para la cotización.
            </p>
          </div>
          <div className="space-y-1">
            <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              3
            </p>
            <p className="font-semibold text-emerald-900">
              Coordina por WhatsApp o correo
            </p>
            <p className="text-slate-900">
              Escríbenos para confirmar dirección, medio de pago, tipo de
              documento (boleta/factura) y fecha de entrega.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
