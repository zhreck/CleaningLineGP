// web/app/contacto/page.tsx
import Link from "next/link";
import FAQSection from "../../components/faqSection";

export default function ContactoPage() {
  const year = new Date().getFullYear();

  return (
    <section className="space-y-8">
      {/* Encabezado */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-emerald-700">
          Contacto
        </h1>
        <p className="text-sm text-slate-600">
          Aquí puedes encontrar los datos de contacto de Cleaning Line GP,
          conocer quiénes somos y dejarnos tu mensaje.
        </p>
      </header>

      {/* Quiénes somos + datos de contacto */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quiénes somos */}
        <div className="space-y-3 text-sm text-slate-700">
          <h2 className="text-lg font-semibold text-emerald-700">
            ¿Quiénes somos?
          </h2>
          <p>
            Cleaning Line GP es una comercializadora y distribuidora de
            productos de limpieza y aseo, orientada a hogares, negocios y
            empresas de la Región Metropolitana.
          </p>
          <p>
            Nuestro objetivo es ofrecer soluciones de limpieza confiables y
            convenientes, con despacho a distintas comunas y retiro en punto
            de entrega en Pudahuel.
          </p>
          
        </div>

        {/* Datos de contacto */}
        <div className="space-y-3 text-sm text-slate-700">
          <h2 className="text-lg font-semibold text-emerald-700">
            Datos de contacto
          </h2>
          <p>
            <span className="font-medium">Ubicación: </span>
            Pudahuel, sector Laguna Azul con La Estrella
            (retiro en punto de entrega coordinado).
          </p>
          <p>
            <span className="font-medium">WhatsApp: </span>
            {/* Reemplaza el href con el link real de wa.me cuando lo tengas */}
            <Link href="#" className="underline text-emerald-700">
              Escribir por WhatsApp
            </Link>
          </p>
          <p>
            <span className="font-medium">Correo: </span>
            <a
              href="mailto:contacto@tulimpieza.cl"
              className="underline text-emerald-700"
            >
              contacto@tulimpieza.cl
            </a>
          </p>
          <p className="text-xs text-slate-500">
            Horario de atención: lunes a domingo. Despachos en días hábiles.
          </p>
        </div>
      </div>

      {/* Formulario de contacto */}
      <div className="mt-4">
        <h2 className="mb-2 text-lg font-semibold text-emerald-700">
          Envíanos un mensaje
        </h2>
        <form className="space-y-4 rounded-xl border border-emerald-200 bg-white/80 p-4 text-sm shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-slate-700" htmlFor="name">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                className="w-full rounded-md border border-emerald-200 bg-white px-2 py-1 text-sm text-slate-800 outline-none focus:border-emerald-500"
                placeholder="Tu nombre"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-slate-700" htmlFor="email">
                Correo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border border-emerald-200 bg-white px-2 py-1 text-sm text-slate-800 outline-none focus:border-emerald-500"
                placeholder="tunombre@correo.cl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-700" htmlFor="message">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full rounded-md border border-emerald-200 bg-white px-2 py-1 text-sm text-slate-800 outline-none focus:border-emerald-500"
              placeholder="Cuéntanos qué productos necesitas, cantidades, comuna, etc."
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition"
          >
            Enviar mensaje
          </button>
        </form>

        <p className="mt-2 text-[11px] text-slate-500">
          Más adelante podemos conectar este formulario con un backend o enviar
          directamente al correo del administrador.
        </p>
      </div>

      <p className="mt-6 text-[11px] text-slate-500">
        © {year} Cleaning Line GP. Sitio en desarrollo como plataforma de
        pedidos y cotizaciones.
      </p>
    </section>
  );
}
