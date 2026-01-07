// web/app/faq/page.tsx
import FAQSection from "../../components/faqSection";

export default function FAQPage() {
  return (
    <section className="space-y-8 max-w-4xl">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-emerald-700">
          Preguntas frecuentes
        </h1>
        <p className="text-sm text-slate-600">
          En esta sección respondemos dudas frecuentes sobre compras,
          despachos, métodos de pago y funcionamiento general de Cleaning Line GP.
        </p>
      </header>

      <FAQSection />

      <p className="mt-6 text-[11px] text-slate-500">
        Si tu duda no aparece aquí, puedes contactarnos mediante WhatsApp o correo desde la sección de Contacto.
      </p>
    </section>
  );
}
