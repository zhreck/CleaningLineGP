import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-emerald-200 bg-white/70 py-6 text-sm text-slate-600">
      <div className="mx-auto max-w-7xl px-0 md:px-2 grid gap-4 md:grid-cols-3">
        
        {/* Columna 1: marca + logo */}
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center gap-3">
            <Image
              src="/favicon.ico"
              alt="Cleaning Line GP"
              width={45}
              height={45}
              className="rounded-md"
            />
            <p className="font-semibold text-emerald-800">
              Cleaning Line GP · Productos de limpieza
            </p>
          </div>

          <p className="text-xs text-neutral-500">
            Venta y distribución de productos de limpieza para hogar y empresas.
          </p>
          <p className="text-xs text-neutral-500">
            &copy; {year} Cleaning Line GP — Todos los derechos reservados.
          </p>
        </div>

        {/* Columna 2: info de atención */}
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-neutral-700">Atención y despacho</p>
          <p>Ubicación: Pudahuel, sector Laguna Azul con La Estrella.</p>
          <p>Días de trabajo: lunes a domingo.</p>
          <p>Despacho en días hábiles y retiro en tienda (hasta sábado).</p>
          <p>Expansión gradual a distintas comunas.</p>
        </div>

        {/* Columna 3: contacto */}
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-neutral-700">Contacto</p>
          <p>
            WhatsApp:{" "}
            <span className="underline">+56 9 6363 9873</span>
          </p>
          <p>
            
            Correo:{" "}
            <a href="mailto:cleaningsale04@gmail.com" className="underline">
              cleaningsale04@gmail.com
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a href="https://www.instagram.com/cleaning_line_gp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">
            Cleaning_Line_GP
            </a>
          </p>
          <p>
            Facebook:{" "}
            <a href="https://www.facebook.com/share/17VJrX4rYm/">
            Cleaning_Line_GP
            </a>
          </p>
          <p className="text-neutral-500">
            Facturación disponible para personas naturales y empresas.
          </p>
        </div>
      </div>
    </footer>
  );
}
