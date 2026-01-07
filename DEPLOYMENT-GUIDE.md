# 🚀 Guía de Deployment - Shopping E-commerce

Esta guía te permitirá deployar el proyecto completo de e-commerce con todas sus funcionalidades: frontend, backend, base de datos, observabilidad y testing.

## 📋 Requisitos Previos

### Software Necesario
- **Node.js** v18+ y npm
- **Docker Desktop** (para servicios de infraestructura)
- **Git** para clonar el repositorio

### Verificar Instalaciones
```bash
node --version    # Debe ser v18+
npm --version     # Debe ser v8+
docker --version  # Debe estar instalado
git --version     # Debe estar instalado
```

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │  Infraestructura│
│   Next.js       │◄──►│   NestJS        │◄──►│   Docker        │
│   Port: 3000    │    │   Port: 3002    │    │   Múltiples     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌─────────────────────────────────┼─────────────────────────────────┐
                       │                                 │                                 │
                ┌──────▼──────┐  ┌──────────────┐  ┌────▼─────┐  ┌─────────────┐  ┌─────▼─────┐
                │ PostgreSQL  │  │ Meilisearch  │  │  Redis   │  │    MinIO    │  │   SigNoz  │
                │ Port: 5432  │  │ Port: 7700   │  │Port: 6379│  │ Port: 9000  │  │Port: 8080 │
                └─────────────┘  └──────────────┘  └──────────┘  └─────────────┘  └───────────┘
```

---

## 📦 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd Shoping_Ecommerce
```

### 🚀 Instalación Automatizada (Recomendado)

Para una instalación rápida y automatizada:

#### Windows:
```cmd
setup.bat
```

#### Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

El script automatizado se encargará de:
- ✅ Verificar prerequisitos
- ✅ Configurar variables de entorno
- ✅ Levantar servicios de infraestructura
- ✅ Instalar dependencias
- ✅ Compilar y poblar base de datos
- ✅ Configurar SigNoz (opcional)

### 📋 Instalación Manual

Si prefieres instalar manualmente:

### 2. Configurar Variables de Entorno

#### Backend API
```bash
cd app/api
cp .env.example .env
```

Edita `app/api/.env` con tus configuraciones específicas:
```env
# Cambiar en producción
JWT_SECRET=TuSecretoSuperSeguroAqui123
JWT_REFRESH_SECRET=OtroSecretoMuySeguroAqui456

# Para producción, cambiar a 'production'
WEBPAY_ENVIRONMENT=integration

# URL de retorno para Webpay (cambiar dominio en producción)
WEBPAY_RETURN_URL=http://tu-dominio.com/pago/resultado
```

#### Frontend Web
```bash
cd ../../web
cp .env.example .env.local
```

Edita `web/.env.local`:
```env
# En producción, cambiar a la URL de tu API
NEXT_PUBLIC_API_URL=http://tu-dominio-api.com

NODE_ENV=production  # Para producción
```

### 3. Levantar Servicios de Infraestructura

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

Esto iniciará:
- **PostgreSQL** (puerto 5432)
- **Redis** (puerto 6379) 
- **Meilisearch** (puerto 7700)
- **MinIO** (puerto 9000)

#### Verificar que los servicios estén corriendo:
```bash
docker ps
```

Deberías ver 4 contenedores corriendo.

### 4. Configurar SigNoz (Observabilidad)

#### Instalar SigNoz
```bash
# Clonar repositorio de SigNoz
git clone https://github.com/SigNoz/signoz.git signoz-deploy
cd signoz-deploy/deploy/docker

# Levantar SigNoz
docker compose up -d
```

#### Verificar SigNoz
- Abrir http://localhost:8080
- Crear cuenta de administrador
- SigNoz estará listo para recibir telemetrías

### 5. Instalar Dependencias del Backend

```bash
cd app/api
npm install
```

### 6. Compilar y Poblar Base de Datos

```bash
# Compilar el proyecto
npm run build

# Poblar base de datos con datos de prueba
npm run seed
```

### 7. Instalar Dependencias del Frontend

```bash
cd ../../web
npm install
```

---

## 🚀 Ejecutar el Sistema

### Opción 1: Desarrollo (Recomendado para desarrollo)

#### Terminal 1 - Backend con Observabilidad
```bash
cd app/api
npm run start:otel  # Inicia con OpenTelemetry habilitado
```

#### Terminal 2 - Frontend
```bash
cd web
npm run dev
```

### Opción 2: Producción

#### Backend
```bash
cd app/api
npm run build
npm run start:prod
```

#### Frontend
```bash
cd web
npm run build
npm start
```

---

## 🌐 URLs de Acceso

Una vez que todo esté corriendo:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Aplicación web principal |
| **Backend API** | http://localhost:3002 | API REST + Swagger docs |
| **Swagger Docs** | http://localhost:3002/api/docs | Documentación de API |
| **SigNoz** | http://localhost:8080 | Dashboard de observabilidad |
| **MinIO Console** | http://localhost:9001 | Gestión de archivos |
| **Meilisearch** | http://localhost:7700 | Motor de búsqueda |

### Credenciales por Defecto

**MinIO:**
- Usuario: `admin`
- Contraseña: `adminadmin`

**Base de Datos:**
- Usuario: `dev`
- Contraseña: `devpass`
- Base de datos: `ecommerce`

---

## 🧪 Testing y Calidad

### Tests End-to-End (E2E)
```bash
cd web
npm run test:e2e
```

### Tests de Carga con Locust
```bash
cd locust
pip install locust
locust -f locustfile.py --host http://localhost:3002
```
Abrir http://localhost:8089 para configurar las pruebas.

### Tests Unitarios
```bash
# Backend
cd app/api
npm test

# Frontend  
cd web
npm test
```

---

## 📊 Monitoreo y Observabilidad

### SigNoz Dashboard
1. Abrir http://localhost:8080
2. Ir a **Services** → Buscar `shopping-ecommerce-api`
3. Ver métricas de:
   - Latencia de requests
   - Throughput
   - Errores
   - Trazas distribuidas

### Generar Tráfico de Prueba
```bash
# PowerShell (Windows)
for ($i=1; $i -le 50; $i++) { 
    curl http://localhost:3002/products | Out-Null
    Write-Host "Request $i completed"
    Start-Sleep -Seconds 1
}

# Bash (Linux/Mac)
for i in {1..50}; do
    curl -s http://localhost:3002/products > /dev/null
    echo "Request $i completed"
    sleep 1
done
```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Puerto ocupado
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

#### 2. Docker no inicia servicios
```bash
# Reiniciar Docker Desktop
# Verificar recursos disponibles (RAM/CPU)
docker system prune -f  # Limpiar recursos
```

#### 3. Base de datos no conecta
```bash
# Verificar que PostgreSQL esté corriendo
docker logs postgres

# Recrear contenedor si es necesario
docker-compose down
docker-compose up -d
```

#### 4. Frontend no conecta con Backend
- Verificar que `NEXT_PUBLIC_API_URL` esté correcto en `.env.local`
- Verificar que el backend esté corriendo en el puerto correcto
- Verificar CORS en el backend

#### 5. SigNoz no recibe telemetrías
```bash
# Verificar que el collector esté corriendo
docker logs signoz-otel-collector

# Verificar conectividad
curl http://localhost:4318/v1/traces  # Debe devolver 405
```

---

## 🚀 Deployment en Producción

### Opción 1: Docker Compose (Recomendado)

Para deployment en producción usando Docker:

```bash
# 1. Configurar variables de entorno de producción
cp .env.example .env.prod

# 2. Editar variables de producción
nano .env.prod

# 3. Levantar en modo producción
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Opción 2: Servicios Separados

Para deployment en servicios cloud separados:

### Variables de Entorno para Producción

#### Backend (.env)
```env
# Base de datos (usar servicio administrado)
DB_HOST=tu-db-host.com
DB_USERNAME=usuario_produccion
DB_PASSWORD=contraseña_super_segura

# JWT (generar secretos únicos)
JWT_SECRET=secreto_unico_super_seguro_64_caracteres_minimo
JWT_REFRESH_SECRET=otro_secreto_unico_super_seguro_64_caracteres_minimo

# Webpay (credenciales de producción)
WEBPAY_ENVIRONMENT=production
WEBPAY_COMMERCE_CODE=tu_codigo_comercio
WEBPAY_API_KEY=tu_api_key_produccion
WEBPAY_RETURN_URL=https://tu-dominio.com/pago/resultado

# URLs de servicios
REDIS_HOST=tu-redis-host.com
MEILI_HOST=https://tu-meilisearch-host.com
MINIO_ENDPOINT=tu-minio-host.com
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
NODE_ENV=production
```

### Consideraciones de Seguridad

1. **Cambiar todas las contraseñas por defecto**
2. **Usar HTTPS en producción**
3. **Configurar firewall apropiadamente**
4. **Usar servicios administrados para base de datos**
5. **Implementar backup automático**
6. **Configurar monitoreo de logs**

### Servicios Recomendados para Producción

- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: AWS ECS, Google Cloud Run, Railway
- **Base de datos**: AWS RDS, Google Cloud SQL, PlanetScale
- **Redis**: AWS ElastiCache, Redis Cloud
- **Archivos**: AWS S3, Google Cloud Storage
- **Monitoreo**: SigNoz Cloud, DataDog, New Relic

---

## 📚 Documentación Adicional

- **API Documentation**: http://localhost:3002/api/docs (Swagger)
- **Arquitectura**: Ver `/docs/` para documentación técnica detallada
- **Testing**: Ver `/web/tests/` para ejemplos de tests E2E
- **Performance**: Ver `/locust/` para tests de carga

---

## 🆘 Soporte

Si encuentras problemas:

1. **Verificar logs**: `docker logs <container_name>`
2. **Revisar variables de entorno**: Asegurar que estén correctas
3. **Verificar puertos**: Que no estén ocupados por otros servicios
4. **Limpiar caché**: `npm cache clean --force`
5. **Reiniciar servicios**: `docker-compose restart`

---

## 📝 Notas Importantes

- **Desarrollo**: Usar `npm run dev` para hot-reload
- **Producción**: Siempre usar `npm run build` antes de deploy
- **Seguridad**: Cambiar secretos JWT en producción
- **Performance**: SigNoz te ayudará a identificar cuellos de botella
- **Backup**: Configurar backup automático de PostgreSQL en producción

¡El sistema está listo para usar! 🎉