# Configuración de OpenTelemetry en NestJS
## Instrumentación del Backend

---

## 📦 PASO 1: Instalar Dependencias de OpenTelemetry

### Navegar al directorio del backend:
```bash
cd app/api
```

### Instalar paquetes necesarios:
```bash
npm install --save @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-grpc @opentelemetry/exporter-metrics-otlp-grpc @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/api @opentelemetry/sdk-metrics
```

### Verificar instalación:
```bash
npm list | grep opentelemetry
```

Deberías ver:
```
├── @opentelemetry/api@1.7.0
├── @opentelemetry/auto-instrumentations-node@0.40.3
├── @opentelemetry/exporter-metrics-otlp-grpc@0.45.1
├── @opentelemetry/exporter-trace-otlp-grpc@0.45.1
├── @opentelemetry/resources@1.19.0
├── @opentelemetry/sdk-metrics@1.19.0
├── @opentelemetry/sdk-node@0.45.1
└── @opentelemetry/semantic-conventions@1.19.0
```

---

## 📄 PASO 2: Crear Archivo de Configuración

El archivo `otel.js` ya fue creado en `app/api/otel.js`

### Contenido del archivo:
```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'shopping-ecommerce-api',
  [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'development',
});

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4317',
});

const metricExporter = new OTLPMetricExporter({
  url: 'http://localhost:4317',
});

const sdk = new NodeSDK({
  resource: resource,
  traceExporter: traceExporter,
  metricReader: new (require('@opentelemetry/sdk-metrics').PeriodicExportingMetricReader)({
    exporter: metricExporter,
    exportIntervalMillis: 10000,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

---

## ⚙️ PASO 3: Modificar package.json

### Abrir `app/api/package.json`

### Agregar el script `start:otel`:
```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "start:otel": "node --require ./otel.js dist/main.js"
  }
}
```

**Explicación:**
- `--require ./otel.js`: Carga el SDK de OpenTelemetry antes de iniciar la aplicación
- `dist/main.js`: Archivo compilado de NestJS

---

## 🔨 PASO 4: Compilar el Backend

### Compilar TypeScript a JavaScript:
```bash
npm run build
```

### Salida esperada:
```
> api@0.0.1 build
> nest build

✔ Successfully compiled: 45 files with swc (123ms)
```

### Verificar que dist/ existe:
```bash
dir dist
```

Deberías ver:
```
main.js
main.js.map
... (otros archivos compilados)
```

---

## 🚀 PASO 5: Ejecutar Backend con OpenTelemetry

### Comando:
```bash
npm run start:otel
```

### Salida esperada:
```
> api@0.0.1 start:otel
> node --require ./otel.js dist/main.js

✅ OpenTelemetry SDK iniciado correctamente
📊 Enviando trazas y métricas a: http://localhost:4317
🏷️  Service Name: shopping-ecommerce-api

[Nest] 12345  - 12/05/2024, 2:30:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 12/05/2024, 2:30:00 PM     LOG [InstanceLoader] AppModule dependencies initialized +15ms
[Nest] 12345  - 12/05/2024, 2:30:00 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +8ms
[Nest] 12345  - 12/05/2024, 2:30:00 PM     LOG [InstanceLoader] ProductsModule dependencies initialized +5ms
[Nest] 12345  - 12/05/2024, 2:30:00 PM     LOG [RoutesResolver] ProductsController {/products}: +3ms
[Nest] 12345  - 12/05/2024, 2:30:00 PM     LOG [RouterExplorer] Mapped {/products, GET} route +2ms
[Nest] 12345  - 12/05/2024, 2:30:00 PM     LOG [RouterExplorer] Mapped {/products/:id, GET} route +1ms
[Nest] 12345  - 12/05/2024, 2:30:00 PM     LOG [RouterExplorer] Mapped {/products, POST} route +1ms
[Nest] 12345  - 12/05/2024, 2:30:00 PM     LOG [RouterExplorer] Mapped {/products/:id, PATCH} route +1ms
[Nest] 12345  - 12/05/2024, 2:30:00 PM     LOG [RouterExplorer] Mapped {/products/:id, DELETE} route +1ms
[Nest] 12345  - 12/05/2024, 2:30:00 PM     LOG [NestApplication] Nest application successfully started +5ms
```

**✅ Indicadores de éxito:**
- Mensaje "OpenTelemetry SDK iniciado correctamente"
- Aplicación NestJS inicia sin errores
- Rutas mapeadas correctamente

---

## 🔍 PASO 6: Verificar Conexión con SigNoz

### Verificar logs del OTLP Collector:
```bash
docker logs signoz-otel-collector --tail 50 --follow
```

### Deberías ver mensajes como:
```
2024-12-05T14:30:05.123Z info    otlpreceiver@v0.111.0/otlp.go:152  Received traces {"kind": "receiver", "name": "otlp", "data_type": "traces", "num_spans": 5}
2024-12-05T14:30:10.234Z info    otlpreceiver@v0.111.0/otlp.go:152  Received metrics {"kind": "receiver", "name": "otlp", "data_type": "metrics", "num_datapoints": 12}
```

**✅ Esto confirma que SigNoz está recibiendo datos**

---

## 🧪 PASO 7: Generar Tráfico de Prueba

### Opción A: Usar curl
```bash
# GET /products
curl http://localhost:3001/products

# GET /products/:id
curl http://localhost:3001/products/1

# POST /products (requiere autenticación)
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Product","price":1000,"slug":"test-product","stock":10,"categoryId":1}'
```

### Opción B: Usar Locust (Recomendado)
```bash
cd locust
locust -f locustfile.py --host http://localhost:3001 --users 10 --spawn-rate 2 --run-time 1m --headless
```

Esto generará tráfico realista y múltiples trazas.

---

## 📊 PASO 8: Visualizar en SigNoz

### 1. Abrir SigNoz UI:
```
http://localhost:3301
```

### 2. Navegar a "Services":
- Deberías ver: **shopping-ecommerce-api**
- Click en el servicio

### 3. Ver métricas:
- **Latency (P50, P90, P95, P99)**
- **Request Rate (RPS)**
- **Error Rate**

### 4. Ver trazas:
- Click en "Traces"
- Filtrar por servicio: shopping-ecommerce-api
- Ver trazas individuales con spans

---

## 🔧 Variables de Entorno (Opcional)

### Crear archivo `.env` en `app/api/`:
```env
# OpenTelemetry Configuration
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
OTEL_SERVICE_NAME=shopping-ecommerce-api
OTEL_SERVICE_VERSION=1.0.0
OTEL_DEPLOYMENT_ENVIRONMENT=development
OTEL_LOG_LEVEL=info
```

### Modificar `otel.js` para usar variables de entorno:
```javascript
require('dotenv').config();

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
});
```

---

## ✅ Checklist de Configuración

- [ ] Dependencias de OpenTelemetry instaladas
- [ ] Archivo `otel.js` creado
- [ ] Script `start:otel` agregado a package.json
- [ ] Backend compilado (`npm run build`)
- [ ] Backend ejecutándose con OpenTelemetry
- [ ] Logs muestran "OpenTelemetry SDK iniciado"
- [ ] SigNoz recibiendo trazas (verificar logs del collector)
- [ ] Servicio visible en SigNoz UI
- [ ] Tráfico de prueba generado
- [ ] Métricas y trazas visibles en dashboards

---

## ❌ Solución de Problemas

### Error: "Cannot find module '@opentelemetry/sdk-node'"

**Solución:**
```bash
npm install --save @opentelemetry/sdk-node
```

---

### Error: "ECONNREFUSED localhost:4317"

**Problema:** SigNoz no está corriendo o el puerto está bloqueado

**Solución:**
```bash
# Verificar que SigNoz está corriendo
docker ps | grep signoz-otel-collector

# Verificar que el puerto está abierto
netstat -ano | findstr :4317

# Reiniciar SigNoz si es necesario
cd signoz/deploy/docker
docker compose restart signoz-otel-collector
```

---

### No se ven trazas en SigNoz

**Posibles causas:**
1. Backend no está enviando datos
2. Firewall bloqueando puerto 4317
3. SigNoz no está procesando datos

**Solución:**
```bash
# Verificar logs del backend
# Deberías ver: "OpenTelemetry SDK iniciado correctamente"

# Verificar logs del collector
docker logs signoz-otel-collector --tail 100

# Generar más tráfico
curl http://localhost:3001/products
```

---

### Métricas no aparecen

**Problema:** Las métricas se exportan cada 10 segundos

**Solución:** Espera al menos 10-15 segundos después de generar tráfico

---

## 📝 Notas Importantes

### Instrumentaciones Automáticas

OpenTelemetry instrumenta automáticamente:
- ✅ HTTP requests (Express/NestJS)
- ✅ PostgreSQL queries
- ✅ Redis operations (si se usa)
- ✅ DNS lookups
- ✅ File system operations

### Overhead de Rendimiento

- **Latencia adicional:** ~1-5 ms por request
- **CPU:** +2-5% de uso
- **Memoria:** +50-100 MB

**Recomendación:** Aceptable para desarrollo y producción

### Sampling

Por defecto, OpenTelemetry captura **100% de las trazas**.

Para reducir volumen en producción:
```javascript
const { TraceIdRatioBasedSampler } = require('@opentelemetry/sdk-trace-base');

const sdk = new NodeSDK({
  sampler: new TraceIdRatioBasedSampler(0.1), // 10% de trazas
  // ... resto de configuración
});
```

---

## 🎯 Siguiente Paso

Una vez que el backend esté instrumentado y enviando datos:

1. ✅ Generar tráfico con Locust
2. ✅ Capturar métricas de SigNoz
3. ✅ Exportar dashboards
4. ✅ Analizar trazas
5. ✅ Crear reporte académico

**Continúa con:** Generación de métricas y evidencias

---

**Configuración completada:** ✅  
**Fecha:** 05 de Diciembre de 2024  
**Backend instrumentado:** shopping-ecommerce-api  
**Collector:** http://localhost:4317
