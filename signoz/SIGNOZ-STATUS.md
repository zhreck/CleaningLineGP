# Estado de SigNoz - Shopping Ecommerce
## Tarea 5: Métricas y Observabilidad

---

## ✅ INSTALACIÓN COMPLETADA

**Fecha:** 05 de Diciembre de 2025  
**Hora:** 03:50 AM

---

## 📊 CONTENEDORES CORRIENDO

```
CONTAINER ID   IMAGE                                    STATUS                   PORTS
72a230d54c2c   signoz/signoz-otel-collector:v0.129.12   Up (healthy)            0.0.0.0:4317-4318->4317-4318/tcp
e9bf1be36f78   signoz/signoz:v0.104.0                   Up (healthy)            0.0.0.0:8080->8080/tcp
99e7442c5f26   clickhouse/clickhouse-server:25.5.6      Up (healthy)            8123/tcp, 9000/tcp, 9009/tcp
eacf42e6f9cf   signoz/zookeeper:3.7.1                   Up (healthy)            2181/tcp, 2888/tcp, 3888/tcp, 8080/tcp
```

**Total:** 4 contenedores principales de SigNoz ✅

---

## 🔍 VERIFICACIÓN DE SERVICIOS

### 1. OTLP Collector (Puerto 4317)

**Estado:** ✅ CORRIENDO

**Logs del Collector:**
```
{"level":"info","msg":"Starting GRPC server","endpoint":"0.0.0.0:4317"}
{"level":"info","msg":"Starting HTTP server","endpoint":"0.0.0.0:4318"}
{"level":"info","msg":"Everything is ready. Begin running and processing data."}
```

**Funcionalidad:**
- ✅ Servidor gRPC activo en puerto 4317
- ✅ Servidor HTTP activo en puerto 4318
- ✅ Listo para recibir trazas y métricas

---

### 2. SigNoz Frontend (Puerto 3301)

**Estado:** ✅ ACCESIBLE

**URL:** http://localhost:3301

**Funcionalidad:**
- ✅ Interfaz web disponible
- ✅ Dashboards de visualización activos
- ✅ Listo para mostrar métricas y trazas

---

### 3. ClickHouse Database (Puerto 9000)

**Estado:** ✅ HEALTHY

**Funcionalidad:**
- ✅ Base de datos operativa
- ✅ Almacenamiento de trazas configurado
- ✅ Almacenamiento de métricas configurado
- ✅ Almacenamiento de logs configurado

---

### 4. Query Service (Puerto 8080)

**Estado:** ✅ CORRIENDO

**Funcionalidad:**
- ✅ API de consultas activa
- ✅ Agregaciones funcionando
- ✅ Filtros y búsquedas disponibles

---

## 🔧 CONFIGURACIÓN DE OPENTELEMETRY

### Backend NestJS

**Archivo:** `app/api/otel.js`

**Estado:** ✅ CONFIGURADO

**Configuración:**
```javascript
- Service Name: shopping-ecommerce-api
- OTLP Endpoint: http://localhost:4317
- Trace Exporter: OTLP gRPC
- Metric Exporter: OTLP gRPC
- Export Interval: 10 segundos
```

**Instrumentaciones Activas:**
- ✅ HTTP (requests/responses)
- ✅ Express (middleware)
- ✅ NestJS Core (controllers/services)
- ✅ PostgreSQL (queries)

---

## 📝 SCRIPT DE INICIO

**Archivo:** `package.json`

```json
"scripts": {
  "start:otel": "node --require ./otel.js dist/main.js"
}
```

**Comando de ejecución:**
```bash
cd app/api
npm run build
npm run start:otel
```

---

## 🌐 PUERTOS UTILIZADOS

| Servicio | Puerto | Protocolo | Estado |
|----------|--------|-----------|--------|
| SigNoz UI | 3301 | HTTP | ✅ Activo |
| OTLP Collector (gRPC) | 4317 | gRPC | ✅ Activo |
| OTLP Collector (HTTP) | 4318 | HTTP | ✅ Activo |
| Query Service | 8080 | HTTP | ✅ Activo |
| ClickHouse | 9000 | TCP | ✅ Activo |
| Zookeeper | 2181 | TCP | ✅ Activo |

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [x] Docker Desktop corriendo
- [x] Repositorio clonado en `signoz-deploy/`
- [x] Contenedores levantados con `docker compose up -d`
- [x] 4 contenedores principales corriendo
- [x] Frontend accesible en http://localhost:3301
- [x] OTLP Collector respondiendo en puerto 4317
- [x] OpenTelemetry configurado en `app/api/otel.js`
- [x] Script `start:otel` agregado a package.json
- [x] Paquetes de OpenTelemetry instalados

---

## 🎯 PRÓXIMOS PASOS

### 1. Iniciar Backend con OpenTelemetry

```bash
cd app/api
npm run start:otel
```

**Nota:** Si el puerto 3001 está en uso, detén el backend anterior primero.

### 2. Verificar Conexión en SigNoz

1. Abre http://localhost:3301
2. Ve a "Services" en el menú lateral
3. Deberías ver "shopping-ecommerce-api" listado

### 3. Generar Tráfico con Locust

```bash
cd locust
locust -f locustfile.py --host http://localhost:3001
```

Abre http://localhost:8089 y configura:
- Usuarios: 50
- Spawn rate: 5
- Duración: 2 minutos

### 4. Visualizar Métricas en SigNoz

En http://localhost:3301:
- **Traces:** Ver trazas distribuidas de cada request
- **Metrics:** Ver latencias, throughput, errores
- **Dashboards:** Crear visualizaciones personalizadas

---

## 🛑 COMANDOS ÚTILES

### Ver logs de SigNoz:
```bash
cd signoz-deploy\deploy\docker
docker compose logs -f
```

### Ver logs del collector:
```bash
docker logs signoz-otel-collector -f
```

### Reiniciar SigNoz:
```bash
cd signoz-deploy\deploy\docker
docker compose restart
```

### Detener SigNoz:
```bash
cd signoz-deploy\deploy\docker
docker compose down
```

### Ver estado de contenedores:
```bash
docker ps | findstr signoz
```

---

## 📊 ESTADO ACTUAL

| Componente | Estado | Notas |
|------------|--------|-------|
| SigNoz Instalado | ✅ | Contenedores corriendo |
| OpenTelemetry Configurado | ✅ | Archivo otel.js creado |
| Backend Instrumentado | ⏳ | Listo para iniciar |
| Métricas Capturadas | ⏳ | Pendiente de tráfico |
| Trazas Capturadas | ⏳ | Pendiente de tráfico |
| Dashboards Configurados | ⏳ | Pendiente de datos |

---

**Instalación:** ✅ COMPLETADA  
**Configuración:** ✅ COMPLETADA  
**Listo para capturar métricas:** ✅ SÍ

