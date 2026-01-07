# 🛒 Shopping E-commerce Platform

Una plataforma de e-commerce moderna y completa con observabilidad, testing automatizado y arquitectura escalable.

## ✨ Características Principales

- 🎨 **Frontend moderno** con Next.js 15 y Tailwind CSS
- 🚀 **Backend robusto** con NestJS y TypeScript
- 📊 **Observabilidad completa** con SigNoz y OpenTelemetry
- 🧪 **Testing automatizado** E2E con Playwright
- 📈 **Testing de carga** con Locust
- 💳 **Integración de pagos** con Webpay Plus (Transbank)
- 🔍 **Búsqueda avanzada** con Meilisearch
- 📁 **Gestión de archivos** con MinIO
- 🔐 **Autenticación JWT** con refresh tokens
- 🐳 **Containerización** con Docker

## 🏗️ Arquitectura

```
Frontend (Next.js) ←→ Backend (NestJS) ←→ PostgreSQL
       ↓                    ↓              ↓
   Port 3000           Port 3002      Port 5432
                           ↓
                    ┌─────────────┐
                    │ Servicios   │
                    │ - Redis     │
                    │ - MinIO     │
                    │ - Meilisearch│
                    │ - SigNoz    │
                    └─────────────┘
```

## 🚀 Quick Start

### Prerequisitos
- Node.js v18+
- Docker Desktop
- Git

### Instalación Rápida

```bash
# 1. Clonar repositorio
git clone <URL_REPOSITORIO>
cd Shoping_Ecommerce

# 2. Levantar servicios de infraestructura
docker-compose up -d

# 3. Configurar backend
cd app/api
cp .env.example .env
npm install
npm run build
npm run seed

# 4. Configurar frontend
cd ../../web
cp .env.example .env.local
npm install

# 5. Ejecutar aplicación
# Terminal 1 - Backend
cd app/api && npm run start:otel

# Terminal 2 - Frontend  
cd web && npm run dev
```

### URLs de Acceso
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3002
- **Swagger Docs**: http://localhost:3002/api/docs
- **SigNoz Dashboard**: http://localhost:8080

## 📖 Documentación Completa

Para una guía detallada de instalación, configuración y deployment, consulta:

**[📋 DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)**

Esta guía incluye:
- Instalación paso a paso
- Configuración de variables de entorno
- Deployment en producción
- Troubleshooting
- Monitoreo y observabilidad

## 🧪 Testing

### Tests End-to-End
```bash
cd web
npm run test:e2e
```

### Tests de Carga
```bash
cd locust
pip install locust
locust -f locustfile.py --host http://localhost:3002
```

## 📊 Observabilidad

El proyecto incluye observabilidad completa con:
- **Trazas distribuidas** con OpenTelemetry
- **Métricas de performance** en tiempo real
- **Dashboard de monitoreo** con SigNoz
- **Logs estructurados** para debugging

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Playwright** - E2E testing

### Backend
- **NestJS** - Framework Node.js
- **TypeScript** - Type safety
- **TypeORM** - ORM para base de datos
- **JWT** - Autenticación
- **Swagger** - Documentación API

### Infraestructura
- **PostgreSQL** - Base de datos principal
- **Redis** - Cache y sesiones
- **Meilisearch** - Motor de búsqueda
- **MinIO** - Almacenamiento de archivos
- **SigNoz** - Observabilidad
- **Docker** - Containerización

### Integrations
- **Webpay Plus** - Procesamiento de pagos
- **OpenTelemetry** - Telemetría
- **Locust** - Testing de carga

## 📁 Estructura del Proyecto

```
Shoping_Ecommerce/
├── app/
│   └── api/                 # Backend NestJS
│       ├── src/            # Código fuente
│       ├── dist/           # Código compilado
│       └── .env.example    # Variables de entorno
├── web/                    # Frontend Next.js
│   ├── app/               # App Router
│   ├── components/        # Componentes React
│   ├── lib/              # Utilidades
│   ├── tests/            # Tests E2E
│   └── .env.example      # Variables de entorno
├── locust/               # Tests de carga
├── signoz/              # Configuración observabilidad
├── docker-compose.yml   # Servicios de infraestructura
└── DEPLOYMENT-GUIDE.md  # Guía completa de deployment
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la [Guía de Deployment](./DEPLOYMENT-GUIDE.md)
2. Consulta la documentación de la API en `/api/docs`
3. Abre un issue en GitHub

---

**¡Desarrollado con ❤️ para crear la mejor experiencia de e-commerce!**