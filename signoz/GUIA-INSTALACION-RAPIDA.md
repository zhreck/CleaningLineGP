# Guía Rápida: Instalar SigNoz
## Solución al Error "directory already exists"

---

## ❌ Problema

El error que viste:
```
fatal: destination path 'signoz' already exists and is not an empty directory.
```

**Causa:** Ya existe una carpeta `signoz/` con la documentación de la Tarea 5.

**Solución:** Clonar SigNoz en una carpeta diferente llamada `signoz-deploy/`

---

## ✅ SOLUCIÓN RÁPIDA (Opción 1: Script Automático)

### Paso 1: Ejecutar el script

**Doble click en:** `instalar-signoz.bat`

El script hará automáticamente:
1. ✅ Verificar que Docker está corriendo
2. ✅ Clonar SigNoz en `signoz-deploy/`
3. ✅ Levantar todos los contenedores
4. ✅ Verificar el estado

**Tiempo estimado:** 5-10 minutos

---

## 🔧 SOLUCIÓN MANUAL (Opción 2: Paso a Paso)

### Paso 1: Clonar en carpeta diferente

```powershell
# Desde la raíz del proyecto
git clone -b main https://github.com/SigNoz/signoz.git signoz-deploy
```

**Nota:** Usamos `signoz-deploy` en lugar de `signoz`

### Paso 2: Navegar al directorio de Docker

```powershell
cd signoz-deploy\deploy\docker
```

### Paso 3: Levantar los contenedores

```powershell
docker compose up -d --remove-orphans
```

**Espera 5-10 minutos** la primera vez (descarga imágenes)

### Paso 4: Verificar que todo está corriendo

```powershell
docker ps
```

Deberías ver 7 contenedores:
- signoz-frontend
- signoz-otel-collector
- signoz-query-service
- signoz-clickhouse
- signoz-zookeeper-1
- signoz-alertmanager
- signoz-otel-collector-metrics

---

## 🌐 Paso 5: Abrir SigNoz

### En tu navegador:
```
http://localhost:3301
```

### Primera vez:
1. Verás la pantalla de bienvenida
2. Crea una cuenta (solo local, no requiere email real)
3. Completa el onboarding rápido
4. ¡Listo! Ya puedes usar SigNoz

---

## 📁 Estructura de Carpetas Resultante

```
Shoping_Ecommerce/
├── app/
├── web/
├── locust/
├── jest/
├── signoz/                    ← Documentación (ya existe)
│   ├── INSTALACION-SIGNOZ.md
│   ├── CONFIGURACION-OTEL.md
│   ├── TAREA-5-COMPLETA.md
│   └── ...
├── signoz-deploy/             ← Instalación de SigNoz (nuevo)
│   ├── deploy/
│   │   └── docker/
│   │       └── docker-compose.yaml
│   └── ...
└── instalar-signoz.bat
```

---

## 🔍 Verificación Rápida

### 1. Verificar contenedores:
```powershell
docker ps | findstr signoz
```

### 2. Verificar frontend:
```powershell
curl http://localhost:3301
```

### 3. Verificar OTLP Collector:
```powershell
docker logs signoz-otel-collector --tail 20
```

Deberías ver:
```
info    Starting GRPC server on 0.0.0.0:4317
info    Starting HTTP server on 0.0.0.0:4318
```

---

## 🛑 Comandos Útiles

### Ver logs de todos los servicios:
```powershell
cd signoz-deploy\deploy\docker
docker compose logs -f
```

### Ver logs de un servicio específico:
```powershell
docker logs signoz-otel-collector -f
docker logs signoz-frontend -f
```

### Reiniciar SigNoz:
```powershell
cd signoz-deploy\deploy\docker
docker compose restart
```

### Detener SigNoz:
```powershell
cd signoz-deploy\deploy\docker
docker compose down
```

### Detener y eliminar todo (incluyendo datos):
```powershell
cd signoz-deploy\deploy\docker
docker compose down -v
```

**⚠️ ADVERTENCIA:** `-v` elimina los volúmenes (datos persistentes)

---

## ❌ Solución de Problemas

### Error: "Cannot connect to Docker daemon"

**Solución:**
1. Abre Docker Desktop
2. Espera a que inicie completamente (ícono verde)
3. Verifica con: `docker ps`

---

### Error: "port is already allocated"

**Problema:** Puerto 3301 o 4317 ya está en uso

**Solución:**
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3301
netstat -ano | findstr :4317

# Detener el proceso o cambiar puerto en docker-compose.yaml
```

---

### Error: Contenedor se reinicia constantemente

**Solución:**
```powershell
# Ver logs del contenedor problemático
docker logs signoz-clickhouse --tail 100

# Verificar recursos en Docker Desktop
# Settings → Resources → Memory: 4 GB mínimo
```

---

### Error: "no space left on device"

**Solución:**
```powershell
# Limpiar imágenes no usadas
docker system prune -a

# Liberar espacio de volúmenes
docker volume prune
```

---

## ✅ Checklist de Instalación Exitosa

- [ ] Docker Desktop corriendo
- [ ] Repositorio clonado en `signoz-deploy/`
- [ ] Comando `docker compose up -d` ejecutado sin errores
- [ ] 7 contenedores corriendo (`docker ps`)
- [ ] Frontend accesible en http://localhost:3301
- [ ] OTLP Collector respondiendo (logs sin errores)
- [ ] Cuenta creada en SigNoz UI

---

## 🎯 Siguiente Paso

Una vez que SigNoz esté corriendo:

1. ✅ Continúa con `CONFIGURACION-OTEL.md`
2. ✅ Instrumenta el backend NestJS
3. ✅ Genera tráfico con Locust
4. ✅ Visualiza métricas en SigNoz

---

## 📞 Resumen de Comandos

```powershell
# Opción 1: Script automático
.\instalar-signoz.bat

# Opción 2: Manual
git clone -b main https://github.com/SigNoz/signoz.git signoz-deploy
cd signoz-deploy\deploy\docker
docker compose up -d --remove-orphans

# Verificar
docker ps
curl http://localhost:3301

# Abrir navegador
start http://localhost:3301
```

---

**Tiempo total estimado:** 10-15 minutos  
**Dificultad:** Fácil  
**Requisitos:** Docker Desktop corriendo
