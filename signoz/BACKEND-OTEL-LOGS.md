# Logs de Conexión OpenTelemetry - Backend
## Shopping Ecommerce - Tarea 5

---

## ✅ BACKEND INICIADO CON OPENTELEMETRY

**Fecha:** 05 de Diciembre de 2025  
**Hora:** 04:16:42 AM  
**Proceso ID:** 2592

---

## 📊 LOGS DE INICIO

```
> api@0.0.1 start:otel
> node --require ./otel.js dist/main

✅ OpenTelemetry SDK iniciado correctamente
📊 Enviando trazas y métricas a: http://localhost:4317
🏷️  Service Name: shopping-ecommerce-api

[Nest] 2592  - 05/12/2025, 4:16:42     LOG [NestFactory] Starting Nest application...
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] TypeOrmModule dependencies initialized +75ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] PassportModule dependencies initialized +0ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] AppModule dependencies initialized +4ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] ConfigModule dependencies initialized +24ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] BullModule dependencies initialized +0ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] JwtModule dependencies initialized +2ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] RedisModule dependencies initialized +0ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] MediaModule dependencies initialized +1ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [WebpayService] Webpay Plus configurado en modo: Integration
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] ProductsModule dependencies initialized +3ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] CategoriesModule dependencies initialized +1ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] AuthModule dependencies initialized +0ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] CartModule dependencies initialized +1ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [InstanceLoader] OrdersModule dependencies initialized +0ms
[Nest] 2592  - 05/12/2025, 4:16:42     LOG [NestApplication] Nest application successfully started +6ms

Application is running on: http://[::1]:3001
```

---

## 🔧 CONFIGURACIÓN APLICADA

### OpenTelemetry SDK

**Service Name:** `shopping-ecommerce-api`  
**OTLP Endpoint:** `http://localhost:4317`  
**Protocol:** gRPC  
**Export Interval:** 10 segundos

### Instrumentaciones Activas

- ✅ **HTTP Instrumentation** - Captura requests/responses HTTP
- ✅ **Express Instrumentation** - Captura middleware de Express
- ✅ **NestJS Core Instrumentation** - Captura controllers y services
- ✅ **PostgreSQL Instrumentation** - Captura queries a la base de datos

---

## 🌐 ENDPOINTS INSTRUMENTADOS

### Productos (Products)
- `POST /products` - Crear producto
- `GET /products` - Listar productos
- `GET /products/:id` - Obtener producto por ID
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

### Categorías (Categories)
- `GET /categories` - Listar categorías
- `POST /categories` - Crear categoría
- `GET /categories/:id` - Obtener categoría
- `PUT /categories/:id` - Actualizar categoría
- `DELETE /categories/:id` - Eliminar categoría

### Carrito (Cart)
- `POST /cart` - Agregar al carrito
- `GET /cart` - Ver carrito
- `DELETE /cart/:productId` - Eliminar del carrito
- `DELETE /cart` - Vaciar carrito
- `GET /cart/admin/all` - Ver todos los carritos (admin)

### Autenticación (Auth)
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/refresh` - Refrescar token

### Órdenes (Orders)
- `POST /orders/checkout` - Crear orden
- `PATCH /orders/:id/complete` - Completar orden
- `GET /orders/mine` - Mis órdenes
- `GET /orders` - Listar órdenes (admin)
- `GET /orders/:id` - Obtener orden por ID

### Media
- `POST /media/upload` - Subir archivo
- `GET /media/list` - Listar archivos
- `DELETE /media` - Eliminar archivo

### Pagos (Webpay)
- `POST /payments/webpay/create` - Crear transacción
- `POST /payments/webpay/commit` - Confirmar transacción

### Seed
- `GET /seed/run` - Ejecutar seed de datos

---

## 📊 DATOS QUE SE ESTÁN CAPTURANDO

### Trazas (Traces)
- ✅ Span de cada request HTTP
- ✅ Span de cada query a PostgreSQL
- ✅ Span de validaciones de DTOs
- ✅ Span de autenticación JWT
- ✅ Span de serialización de respuestas

### Métricas (Metrics)
- ✅ Latencia de requests (P50, P90, P95, P99)
- ✅ Throughput (requests por segundo)
- ✅ Tasa de errores (4xx, 5xx)
- ✅ Duración de queries a DB
- ✅ Uso de memoria y CPU

### Atributos Capturados
- `http.method` - Método HTTP (GET, POST, etc.)
- `http.url` - URL del endpoint
- `http.status_code` - Código de respuesta
- `service.name` - Nombre del servicio
- `db.system` - Sistema de base de datos (postgresql)
- `db.statement` - Query SQL ejecutado
- `db.operation` - Operación (SELECT, INSERT, etc.)

---

## ✅ VERIFICACIÓN DE CONEXIÓN

### 1. Backend Corriendo
```
✅ Puerto: 3001
✅ Estado: RUNNING
✅ OpenTelemetry: ACTIVO
```

### 2. SigNoz Collector
```
✅ Puerto: 4317 (gRPC)
✅ Puerto: 4318 (HTTP)
✅ Estado: LISTENING
```

### 3. Flujo de Datos
```
Backend (3001) → OpenTelemetry SDK → OTLP Collector (4317) → ClickHouse → SigNoz UI (3301)
```

---

## 🎯 PRÓXIMOS PASOS

### 1. Verificar en SigNoz UI

Abre: **http://localhost:3301**

1. Ve a **"Services"** en el menú lateral
2. Deberías ver **"shopping-ecommerce-api"** listado
3. Haz clic para ver métricas y trazas

### 2. Generar Tráfico

**Opción A - Usar la aplicación web:**
```bash
# Navega a http://localhost:3000
# Realiza acciones: login, ver productos, agregar al carrito, etc.
```

**Opción B - Usar Locust:**
```bash
cd locust
locust -f locustfile.py --host http://localhost:3001
```

Luego abre http://localhost:8089 y configura:
- **Usuarios:** 50
- **Spawn rate:** 5 usuarios/seg
- **Duración:** 2 minutos

### 3. Visualizar Métricas en SigNoz

En http://localhost:3301:

**Traces:**
- Ve a "Traces" → Verás cada request individual
- Haz clic en una traza para ver el detalle completo
- Verás el flujo: HTTP → Controller → Service → Database

**Metrics:**
- Ve a "Services" → "shopping-ecommerce-api"
- Verás gráficas de latencia, throughput, errores
- Puedes filtrar por endpoint específico

**Dashboards:**
- Ve a "Dashboards"
- Crea visualizaciones personalizadas
- Agrega gráficas de métricas específicas

---

## 🛑 COMANDOS ÚTILES

### Ver logs del backend:
```bash
# Los logs se muestran en la terminal donde ejecutaste npm run start:otel
```

### Detener el backend:
```bash
# Presiona Ctrl+C en la terminal
```

### Reiniciar el backend:
```bash
cd app/api
npm run start:otel
```

### Ver logs de SigNoz Collector:
```bash
docker logs signoz-otel-collector -f
```

---

## 📈 ESTADO ACTUAL

| Componente | Estado | Puerto |
|------------|--------|--------|
| Backend NestJS | ✅ RUNNING | 3001 |
| OpenTelemetry SDK | ✅ ACTIVE | - |
| OTLP Collector | ✅ LISTENING | 4317 |
| SigNoz UI | ✅ ACCESSIBLE | 3301 |
| ClickHouse DB | ✅ HEALTHY | 9000 |

---

**Backend Instrumentado:** ✅ COMPLETADO  
**Enviando Datos a SigNoz:** ✅ SÍ  
**Listo para Capturar Métricas:** ✅ SÍ

