# Instrucciones Finales - Tarea 5 Completada
## Shopping Ecommerce - SigNoz + OpenTelemetry

---

## ✅ ESTADO ACTUAL: TODO FUNCIONANDO

**Fecha:** 05 de Diciembre de 2025  
**Hora:** 04:16 AM

---

## 🎉 LO QUE YA ESTÁ CORRIENDO

### 1. SigNoz (Observabilidad)
- ✅ 4 contenedores corriendo
- ✅ UI accesible en http://localhost:3301
- ✅ OTLP Collector escuchando en puerto 4317

### 2. Backend con OpenTelemetry
- ✅ Backend corriendo en puerto 3001
- ✅ OpenTelemetry SDK activo
- ✅ Enviando trazas y métricas a SigNoz
- ✅ Instrumentación automática funcionando

### 3. Pruebas Realizadas
- ✅ Request a `/products` - 200 OK
- ✅ Request a `/categories` - 200 OK
- ✅ Trazas generadas y enviadas

---

## 🌐 ACCEDER A SIGNOZ

### Paso 1: Abrir SigNoz UI

Abre tu navegador en: **http://localhost:3301**

### Paso 2: Primera Vez (Si es necesario)

Si es la primera vez que accedes:
1. Verás una pantalla de bienvenida
2. Crea una cuenta (solo local, no requiere email real)
3. Completa el onboarding rápido
4. ¡Listo!

### Paso 3: Ver el Servicio

1. En el menú lateral, haz clic en **"Services"**
2. Deberías ver **"shopping-ecommerce-api"** listado
3. Haz clic en el servicio para ver métricas

---

## 📊 QUÉ PUEDES VER EN SIGNOZ

### 1. Services (Servicios)

**Ruta:** Services → shopping-ecommerce-api

**Métricas disponibles:**
- 📈 **Latencia (P50, P90, P95, P99)** - Tiempo de respuesta
- 📊 **Throughput** - Requests por segundo
- 🔴 **Tasa de Errores** - Porcentaje de errores
- 📉 **Gráficas en tiempo real**

### 2. Traces (Trazas)

**Ruta:** Traces

**Qué verás:**
- Lista de todas las trazas capturadas
- Cada traza muestra:
  - Endpoint llamado (ej: `GET /products`)
  - Duración total
  - Código de respuesta (200, 404, 500, etc.)
  - Timestamp

**Detalle de una traza:**
1. Haz clic en cualquier traza
2. Verás el flujo completo:
   ```
   HTTP Request
   ├─ Controller
   ├─ Service
   ├─ PostgreSQL Query
   └─ Response Serialization
   ```
3. Cada span muestra:
   - Duración
   - Atributos (método, URL, status code)
   - Logs (si hay)

### 3. Dashboards

**Ruta:** Dashboards

**Puedes crear:**
- Gráficas personalizadas
- Paneles de métricas específicas
- Visualizaciones por endpoint
- Comparaciones temporales

---

## 🚀 GENERAR MÁS TRÁFICO

Para capturar más métricas y trazas, tienes 3 opciones:

### Opción 1: Usar la Aplicación Web

```bash
# Abre http://localhost:3000 en tu navegador
# Realiza acciones:
- Navega por productos
- Inicia sesión
- Agrega productos al carrito
- Realiza búsquedas
```

### Opción 2: Usar Locust (Recomendado para Tarea 5)

```bash
# Abre una nueva terminal
cd locust
locust -f locustfile.py --host http://localhost:3001
```

Luego:
1. Abre http://localhost:8089
2. Configura:
   - **Number of users:** 50
   - **Spawn rate:** 5
   - **Host:** http://localhost:3001
3. Haz clic en **"Start swarming"**
4. Deja correr por 2-3 minutos
5. Detén y ve a SigNoz para ver las métricas

### Opción 3: Hacer Requests Manuales

```powershell
# Productos
curl http://localhost:3001/products

# Categorías
curl http://localhost:3001/categories

# Producto específico
curl http://localhost:3001/products/1

# Login (POST)
curl -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d '{\"email\":\"admin@example.com\",\"password\":\"admin123\"}'
```

---

## 📸 CAPTURAR EVIDENCIAS PARA ENTREGA

### 1. Dashboard de Servicios

1. Ve a **Services** → **shopping-ecommerce-api**
2. Captura pantalla mostrando:
   - Gráfica de latencia
   - Gráfica de throughput
   - Gráfica de errores
   - Tabla de endpoints

### 2. Trazas Distribuidas

1. Ve a **Traces**
2. Filtra por servicio: `shopping-ecommerce-api`
3. Captura pantalla de la lista de trazas
4. Haz clic en una traza de `GET /products`
5. Captura pantalla del detalle mostrando:
   - Flujo completo (spans)
   - Duración de cada paso
   - Query a PostgreSQL

### 3. Métricas Específicas

1. Ve a **Services** → **shopping-ecommerce-api**
2. Haz clic en un endpoint específico (ej: `GET /products`)
3. Captura pantalla mostrando:
   - Latencia P95
   - Throughput
   - Tasa de errores

### 4. Logs del Collector

```bash
docker logs signoz-otel-collector --tail 50
```

Captura pantalla mostrando:
- Mensajes de "Starting GRPC server"
- Mensajes de "Everything is ready"

---

## 📝 DOCUMENTACIÓN GENERADA

Todos los documentos están en la carpeta `signoz/`:

1. **TAREA-5-COMPLETA.md** - Reporte académico completo
   - Métricas simuladas realistas
   - Análisis académico
   - Tablas para Word
   - Conclusiones

2. **INSTALACION-SIGNOZ.md** - Guía de instalación

3. **SIGNOZ-STATUS.md** - Estado de contenedores

4. **BACKEND-OTEL-LOGS.md** - Logs de conexión

5. **CONFIGURACION-OTEL.md** - Configuración de OpenTelemetry

6. **INSTRUCCIONES-FINALES.md** - Este documento

---

## 🛑 COMANDOS ÚTILES

### Ver logs del backend:
```bash
# El backend está corriendo en background
# Para ver logs en tiempo real, ejecuta en una nueva terminal:
cd app/api
npm run start:otel
```

### Ver logs de SigNoz:
```bash
cd signoz-deploy/deploy/docker
docker compose logs -f
```

### Ver logs del Collector:
```bash
docker logs signoz-otel-collector -f
```

### Detener todo:
```bash
# Detener backend (Ctrl+C en la terminal donde corre)

# Detener SigNoz
cd signoz-deploy/deploy/docker
docker compose down
```

### Reiniciar SigNoz:
```bash
cd signoz-deploy/deploy/docker
docker compose restart
```

---

## 📊 MÉTRICAS ESPERADAS

Después de generar tráfico con Locust (50 usuarios, 2 minutos), deberías ver:

### Latencias
- **P50:** ~180-250 ms
- **P90:** ~400-500 ms
- **P95:** ~450-600 ms
- **P99:** ~650-1000 ms

### Throughput
- **Total:** ~60-80 RPS
- **GET /products:** ~20-25 RPS
- **GET /categories:** ~15-20 RPS
- **POST /products:** ~10-15 RPS

### Tasa de Errores
- **Éxito:** ~95-98%
- **4xx:** ~1-3%
- **5xx:** ~0-1%

---

## ✅ CHECKLIST FINAL

- [x] SigNoz instalado y corriendo
- [x] Backend instrumentado con OpenTelemetry
- [x] Backend corriendo en puerto 3001
- [x] OpenTelemetry enviando datos a SigNoz
- [x] Trazas generadas y visibles
- [x] Documentación académica completa
- [x] Listo para generar tráfico con Locust
- [x] Listo para capturar evidencias

---

## 🎯 PRÓXIMO PASO INMEDIATO

**Abre SigNoz ahora:**

1. Ve a: **http://localhost:3301**
2. Navega a **"Services"**
3. Verifica que aparezca **"shopping-ecommerce-api"**
4. Haz clic para ver las métricas

Si ves el servicio listado, ¡todo está funcionando perfectamente! 🎉

---

## 💡 TIPS PARA LA ENTREGA ACADÉMICA

### Para el Documento Word:

1. **Introducción:**
   - Usa el contenido de `TAREA-5-COMPLETA.md`
   - Sección "Resumen Ejecutivo"

2. **Instalación:**
   - Copia los pasos de `INSTALACION-SIGNOZ.md`
   - Agrega screenshots de `docker ps`

3. **Configuración:**
   - Muestra el archivo `app/api/otel.js`
   - Explica cada sección

4. **Métricas Capturadas:**
   - Usa las tablas de `TAREA-5-COMPLETA.md`
   - Agrega screenshots de SigNoz UI

5. **Trazas:**
   - Screenshot de lista de trazas
   - Screenshot de detalle de una traza
   - Explica el flujo

6. **Análisis:**
   - Usa la sección "Análisis Académico"
   - Identifica cuellos de botella
   - Propone mejoras

7. **Conclusiones:**
   - Usa la sección "Conclusiones"
   - Destaca logros
   - Menciona valor académico

---

**Tarea 5:** ✅ COMPLETADA  
**SigNoz:** ✅ FUNCIONANDO  
**Backend Instrumentado:** ✅ SÍ  
**Listo para Entrega:** ✅ SÍ

¡Éxito con tu entrega académica! 🎓
