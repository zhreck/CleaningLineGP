/**
 * OpenTelemetry Configuration for NestJS Backend
 * Shopping Ecommerce - Tarea 5: Métricas y Observabilidad
 * 
 * Este archivo configura la instrumentación automática de OpenTelemetry
 * para enviar trazas, métricas y logs a SigNoz.
 */

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

// Configurar exportador de trazas (OTLP HTTP)
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
});

// Configurar exportador de métricas (OTLP HTTP)
const metricExporter = new OTLPMetricExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/metrics',
});

// Configurar el SDK de OpenTelemetry
const sdk = new NodeSDK({
  serviceName: 'shopping-ecommerce-api',
  traceExporter: traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10000, // Exportar métricas cada 10 segundos
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // Configuración de instrumentaciones automáticas
      '@opentelemetry/instrumentation-http': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-nestjs-core': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-pg': {
        enabled: true, // PostgreSQL
      },
    }),
  ],
});

// Iniciar el SDK
sdk.start();
console.log('✅ OpenTelemetry SDK iniciado correctamente');
console.log('📊 Enviando trazas y métricas a:', process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317');
console.log('🏷️  Service Name:', 'shopping-ecommerce-api');

// Agregar logs de debug para verificar que las instrumentaciones están activas
console.log('🔧 Instrumentaciones configuradas:');
console.log('   - HTTP: habilitado');
console.log('   - Express: habilitado');
console.log('   - NestJS Core: habilitado');
console.log('   - PostgreSQL: habilitado');

// Manejar el cierre graceful
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => {
      console.log('✅ OpenTelemetry SDK cerrado correctamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error al cerrar OpenTelemetry SDK:', error);
      process.exit(1);
    });
});

// Exportar el SDK para uso en otros módulos (opcional)
module.exports = sdk;
