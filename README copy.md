🛒 CleaningLineGP - E-commerce Platform
Plataforma de e-commerce retail desarrollada con Next.js (Frontend) y NestJS (Backend), con base de datos en la nube (Neon Cloud) y servicios de infraestructura gestionados vía Docker.

🚀 Quick Start (Guía de Instalación)
Sigue estos pasos en orden para levantar el entorno de desarrollo.

1. Preparación e Instalación
Asegúrate de tener instalados Node.js (v18+) y Docker. Clona el repositorio y ejecuta las instalaciones:

Bash
# Instalación del Backend
cd App/api
npm install

# Instalación del Frontend
cd ../web
npm install
2. Configuración de Variables de Entorno
Crea los archivos necesarios en cada carpeta:

Backend (App/api/.env): Define DATABASE_URL (Neon Cloud), JWT_SECRET, y credenciales de servicios.

Frontend (web/.env.local): Configura la URL de tu API para que el frontend pueda conectarse:

Fragmento de código
NEXT_PUBLIC_API_URL=https://<tu-url-de-codespaces-o-servidor>:3002/api
3. Autorización de Scripts de Seguridad (Importante)
Debido a las políticas de seguridad de npm, es posible que debas autorizar los scripts de instalación de paquetes nativos:

Bash
# Dentro de App/api y dentro de web, ejecuta:
npm approve-scripts bcrypt sharp esbuild @tailwindcss/oxide
npm rebuild
4. Ejecución del Proyecto
Levanta la infraestructura y los servicios:

Bash
# Levantar servicios (Redis, MinIO, etc.)
docker-compose up -d

# Iniciar Backend (API)
cd App/api
npm run start:dev

# Iniciar Frontend (Web)
cd ../web
npm install 

npm approve-scripts @tailwindcss/oxide
npm approve-scripts esbuild
npm approve-scripts sharp
npm rebuild

npm run dev
5. Poblar Base de Datos (Seed)
Para tener productos iniciales y un usuario administrador, ejecuta la semilla (solo backend):

Bash
cd App/api
npm run seed
Credenciales de Admin:

Correo: admin@test.com

Clave: Admin123!

🏗️ Arquitectura del Sistema
🛠️ Stack Tecnológico
Frontend: Next.js 15, Tailwind CSS, TypeScript.

Backend: NestJS, TypeORM, PostgreSQL (Neon Cloud).

Servicios: Redis, MinIO (almacenamiento), Meilisearch.

DevOps: Docker, GitHub Actions, OpenTelemetry.

⚠️ Troubleshooting (Solución de problemas)
"Failed to fetch" en el Frontend: - Asegúrate de que NEXT_PUBLIC_API_URL en tu archivo web/.env.local coincida exactamente con la URL pública de tu API (especialmente si usas Codespaces).

Verifica que el backend tenga app.enableCors() habilitado.

Error de autenticación (Database): - Verifica que DATABASE_URL y DB_PASSWORD en App/api/.env coincidan con las credenciales actuales de tu consola de Neon Cloud.

Scripts de instalación bloqueados:

Si un paquete no instala, ejecuta siempre npm approve-scripts <nombre-paquete> seguido de npm rebuild.