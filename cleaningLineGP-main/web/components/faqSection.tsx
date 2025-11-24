// web/components/faqSection.tsx

type FAQItem = {
  question: string;
  answer: string;
  category: "compras" | "despacho" | "pagos" | "empresa";
};

const categoryLabels: Record<FAQItem["category"], string> = {
  compras: "Compras y pedidos",
  despacho: "Despachos y retiros",
  pagos: "Pagos y facturación",
  empresa: "Sobre Cleaning Line GP",
};

const categoryColors: Record<FAQItem["category"], string> = {
  compras: "bg-emerald-100 text-emerald-800 border-emerald-200",
  despacho: "bg-sky-100 text-sky-800 border-sky-200",
  pagos: "bg-amber-100 text-amber-800 border-amber-200",
  empresa: "bg-violet-100 text-violet-800 border-violet-200",
};

const faqs: FAQItem[] = [
  {
    category: "compras",
    question: "¿Cómo puedo realizar un pedido?",
    answer:
      "Puedes revisar nuestro catálogo, anotar los productos y cantidades que necesitas y luego contactarnos por WhatsApp o correo. También podemos usar el carrito del sitio como apoyo para la cotización.",
  },
  {
    category: "compras",
    question: "¿Hay un monto mínimo de compra?",
    answer:
      "El monto mínimo puede variar según la zona de despacho. Como referencia, recomendamos compras desde $20.000 hacia arriba para optimizar el costo de envío.",
  },
  {
    category: "despacho",
    question: "¿En qué comunas realizan despacho?",
    answer:
      "Nos enfocamos principalmente en Pudahuel y comunas cercanas de Santiago. La cobertura exacta se coordina al momento de la compra, según dirección y volumen del pedido.",
  },
  {
    category: "despacho",
    question: "¿Puedo retirar mi pedido en un punto de entrega?",
    answer:
      "Sí. Contamos con retiro en punto de entrega en Pudahuel (sector Laguna Azul con La Estrella). Solo debes coordinar previamente el horario con nosotros.",
  },
  {
    category: "despacho",
    question: "¿Cuánto demora el despacho?",
    answer:
      "En condiciones normales, los pedidos confirmados se entregan dentro de 24 a 72 horas hábiles, dependiendo de la comuna y la carga de trabajo.",
  },
  {
    category: "pagos",
    question: "¿Qué medios de pago aceptan?",
    answer:
      "Aceptamos transferencias bancarias y otros medios de pago electrónicos que se coordinan al momento de confirmar el pedido.",
  },
  {
    category: "pagos",
    question: "¿Emiten boleta o factura?",
    answer:
      "Sí. Comercializadora y Distribuidora Cleaning de Productos de Limpieza y Aseo SPA puede emitir tanto boleta como factura, para personas naturales y empresas.",
  },
  {
    category: "empresa",
    question: "¿Quién es Cleaning Line GP?",
    answer:
      "Cleaning Line GP es una comercializadora y distribuidora de productos de limpieza y aseo, orientada a hogares, negocios y empresas, con base en la Región Metropolitana.",
  },
  {
    category: "empresa",
    question: "¿Qué pasa si un producto llega dañado o con problemas?",
    answer:
      "Si un producto llega en mal estado, por favor contáctanos dentro de las primeras 24 horas con fotos del producto y del envase. Revisaremos el caso y gestionaremos el cambio o solución que corresponda.",
  },
];

export default function FAQSection() {
  return (
    <section className="space-y-5">
      {/* Fila de chips de categorías (decorativa) */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white">
          Dudas frecuentes de nuestros clientes
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-800 border border-emerald-100">
          Compras y pedidos
        </span>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-800 border border-sky-100">
          Despachos y retiros
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-800 border border-amber-100">
          Pagos y facturación
        </span>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-medium text-violet-800 border border-violet-100">
          Sobre la empresa
        </span>
      </div>

      {/* Lista de FAQs */}
      <div className="space-y-3">
        {faqs.map((item, idx) => (
          <details
            key={idx}
            className="group rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 text-sm shadow-sm hover:shadow-md transition-shadow"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <div className="space-y-1">
                {/* Badge de categoría */}
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide ${categoryColors[item.category]}`}
                >
                  {categoryLabels[item.category]}
                </span>
                <p className="font-medium text-slate-900 group-open:text-emerald-700">
                  {item.question}
                </p>
              </div>
              <span className="mt-1 text-emerald-600 text-lg leading-none group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="mt-2 text-slate-700">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
