# Instalación de SigNoz con Docker Compose
## Tarea 5 - Métricas y Observabilidad

---

## 📋 Requisitos Previos

Antes de instalar SigNoz, asegúrate de tener:

- ✅ Docker Desktop instalado y corriendo
- ✅ Docker Compose v2.x o superior
- ✅ Al menos 4 GB de RAM disponible
- ✅ 10 GB de espacio en disco
- ✅ Puertos disponibles: 3301, 4317, 4318

### Verificar Docker
```bash
docker --version
docker compose version
```

Deberías ver:
```
Docker version 24.x.x
Docker Compose version v2.x.x
```

---

## 🚀 PASO 1: Clonar el Repositorio de SigNoz

### Comando:
```bash
git clone -b main https://github.com/SigNoz/signoz.git
cd signoz/deploy/
```

### Salida esperada:
```
Cloning into 'signoz'...
remote: Enumerating objects: 12345, done.
remote: Counting objects: 100% (1234/1234), done.
remote: Compressing objects: 100% (567/567), done.
remote: Total 12345 (delta 890), reused 11234 (delta 789)
Receiving objects: 100% (12345/12345), 5.67 MiB | 2.34 MiB/s, done.
Resolving deltas: 100% (890/890), done.
```

---

## 🐳 PASO 2: Levantar SigNoz con Docker Compose

### Navegar al directorio correcto:
```bash
cd docker
```

### Levantar los contenedores:
```bash
docker compose up -d --remove-orphans
```

### Salida esperada:
```
[+] Running 8/8
 ✔ Network signoz_default                Created
 ✔ Container signoz-zookeeper-1          Started
 ✔ Container signoz-clickhouse           Started
 ✔ Container signoz-query-service        Started
 ✔ Container signoz-otel-collector       Started
 ✔ Container signoz-otel-collector-metrics Started
 ✔ Container signoz-alertmanager         Started
 ✔ Container signoz-frontend             Started
```

**Tiempo estimado:** 2-5 minutos (primera vez)

---

## ✅ PASO 3: Verificar que los Contenedores Están Corriendo

### Comando:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Salida esperada:
```
NAMES                              STATUS                    PORTS
signoz-frontend                    Up 2 minutes              0.0.0.0:3301->3301/tcp
signoz-otel-collector              Up 2 minutes              0.0.0.0:4317-4318->4317-4318/tcp
signoz-query-service               Up 2 minutes (healthy)    8080/tcp
signoz-alertmanager                Up 2 minutes              9093/tcp
signoz-clickhouse                  Up 2 minutes (healthy)    8123/tcp, 9000/tcp
signoz-zookeeper-1                 Up 2 minutes (healthy)    2181/tcp, 2888/tcp, 3888/tcp
signoz-otel-collector-metrics      Up 2 minutes              4317-4318/tcp
```

### Verificar logs (opcional):
```bash
docker logs signoz-otel-collector --tail 50
```

Deberías ver:
```
2024-12-05T14:30:00.123Z info    service/service.go:143  Starting otelcol...
2024-12-05T14:30:00.234Z info    service/service.go:165  Everything is ready. Begin running and processing data.
```

---

## 🌐 PASO 4: Acceder a la Interfaz Web de SigNoz

### URL:
```
http://localhost:3301
```

### Primera vez:
1. Abre tu navegador
2. Ve a `http://localhost:3301`
3. Verás la pantalla de bienvenida de SigNoz
4. Crea una cuenta (solo local, no requiere email real)
5. Completa el onboarding

### Pantalla de bienvenida:
```
┌─────────────────────────────────────────┐
│         Welcome to SigNoz               │
│                                         │
│  Get started with observability         │
│                                         │
│  [Create Account]                       │
└─────────────────────────────────────────┘
```

---

## 🔧 PASO 5: Verificar Endpoints de SigNoz

### Verificar OTLP Collector (puerto 4317):
```bash
curl -v http://localhost:4317
```

### Verificar Frontend (puerto 3301):
```bash
curl http://localhost:3301
```

Deberías recibir una respuesta HTML.

---

## 📊 Servicios Desplegados

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **SigNoz Frontend** | 3301 | Interfaz web principal |
| **OTLP Collector (gRPC)** | 4317 | Recibe trazas y métricas |
| **OTLP Collector (HTTP)** | 4318 | Recibe trazas y métricas (HTTP) |
| **Query Service** | 8080 | API de consultas |
| **ClickHouse** | 9000 | Base de datos de métricas |
| **AlertManager** | 9093 | Gestión de alertas |
| **Zookeeper** | 2181 | Coordinación de servicios |

---

## 🛑 Comandos Útiles

### Detener SigNoz:
```bash
docker compose down
```

### Reiniciar SigNoz:
```bash
docker compose restart
```

### Ver logs de un servicio específico:
```bash
docker logs -f signoz-otel-collector
docker logs -f signoz-frontend
docker logs -f signoz-query-service
```

### Limpiar todo (incluyendo volúmenes):
```bash
docker compose down -v
```

**⚠️ ADVERTENCIA:** Esto eliminará todos los datos almacenados.

---

## 🔍 Verificación de Salud

### Verificar que todos los servicios están healthy:
```bash
docker ps --filter "health=healthy"
```

Deberías ver al menos:
- signoz-clickhouse
- signoz-query-service
- signoz-zookeeper-1

### Verificar uso de recursos:
```bash
docker stats --no-stream
```

Salida esperada:
```
CONTAINER                     CPU %     MEM USAGE / LIMIT
signoz-frontend               0.5%      150MiB / 4GiB
signoz-otel-collector         2.3%      250MiB / 4GiB
signoz-query-service          1.2%      300MiB / 4GiB
signoz-clickhouse             3.5%      800MiB / 4GiB
signoz-alertmanager           0.3%      50MiB / 4GiB
signoz-zookeeper-1            0.8%      200MiB / 4GiB
```

---

## ❌ Solución de Problemas

### Error: "port is already allocated"

**Problema:** El puerto 3301 o 4317 ya está en uso

**Solución:**
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3301
netstat -ano | findstr :4317

# Detener el proceso o cambiar el puerto en docker-compose.yml
```

---

### Error: "no space left on device"

**Problema:** No hay espacio en disco

**Solución:**
```bash
# Limpiar imágenes y contenedores no usados
docker system prune -a

# Liberar espacio de volúmenes
docker volume prune
```

---

### Error: Contenedor se reinicia constantemente

**Problema:** Falta de recursos o configuración incorrecta

**Solución:**
```bash
# Ver logs del contenedor problemático
docker logs signoz-clickhouse --tail 100

# Aumentar recursos en Docker Desktop:
# Settings → Resources → Memory: 4 GB mínimo
```

---

### Error: "Cannot connect to Docker daemon"

**Problema:** Docker Desktop no está corriendo

**Solución:**
1. Abre Docker Desktop
2. Espera a que inicie completamente
3. Verifica con: `docker ps`

---

## ✅ Checklist de Instalación Exitosa

- [ ] Repositorio clonado
- [ ] Docker Compose ejecutado sin errores
- [ ] 7 contenedores corriendo (docker ps)
- [ ] Frontend accesible en http://localhost:3301
- [ ] OTLP Collector respondiendo en puerto 4317
- [ ] Servicios marcados como "healthy"
- [ ] Cuenta creada en SigNoz UI
- [ ] Dashboard principal visible

---

## 📝 Notas Importantes

### Retención de Datos
Por defecto:
- **Logs y Trazas:** 7 días
- **Métricas:** 30 días

Para cambiar: Settings → General → Retention Period

### Recursos Recomendados
- **CPU:** 2 cores mínimo, 4 cores recomendado
- **RAM:** 4 GB mínimo, 8 GB recomendado
- **Disco:** 10 GB mínimo, 50 GB recomendado para producción

### Seguridad
- SigNoz corre en localhost por defecto
- No exponer puertos públicamente sin autenticación
- Usar reverse proxy (nginx) para producción

---

## 🎯 Siguiente Paso

Una vez que SigNoz esté corriendo:

1. ✅ Configurar OpenTelemetry en el backend NestJS
2. ✅ Instrumentar la aplicación
3. ✅ Generar tráfico con Locust
4. ✅ Visualizar métricas en SigNoz
5. ✅ Crear dashboards personalizados

**Continúa con:** `CONFIGURACION-OTEL.md`

---

**Instalación completada:** ✅  
**Fecha:** 05 de Diciembre de 2024  
**Versión SigNoz:** 0.69.0  
**Versión OTEL Collector:** 0.111.24
