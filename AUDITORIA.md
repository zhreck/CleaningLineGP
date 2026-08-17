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

Backend (App/api/.env): Este proyecto no usa una única DATABASE_URL, la conexión a Neon Cloud se define con variables separadas. Como mínimo necesitas:

Fragmento de código
DB_HOST=<host-de-tu-instancia-neon>
DB_PORT=5432
DB_USERNAME=<usuario-neon>
DB_PASSWORD=<password-neon>
DB_DATABASE=<nombre-de-base-de-datos>

JWT_SECRET=<tu-jwt-secret>
JWT_EXPIRATION_TIME=900s
JWT_REFRESH_SECRET=<tu-jwt-refresh-secret>
JWT_REFRESH_EXPIRATION_TIME=7d
Además, según los servicios que uses en local (Redis, MinIO, Meilisearch, Webpay, OpenTelemetry), completa el resto de variables listadas en App/api/.env.example.

Frontend (web/.env.local): Configura la URL de tu API para que el frontend pueda conectarse. El cliente HTTP (web/lib/apiClient.ts) ya agrega el sufijo /api automáticamente, así que la variable NO debe incluirlo (si lo incluyes, las rutas quedarán duplicadas como /api/api):

Fragmento de código
NEXT_PUBLIC_API_URL=https://<tu-url-de-codespaces-o-servidor>:3002
3. Compilación de Paquetes Nativos (Importante)
Este proyecto usa npm (no pnpm), y npm ejecuta automáticamente los scripts de instalación (postinstall) de paquetes nativos como bcrypt (backend) o esbuild y @tailwindcss/oxide (frontend); no hace falta autorizarlos manualmente. El comando npm approve-scripts no existe en npm (es un comando de pnpm), así que no lo ejecutes. Si tras un npm install algún binario nativo no quedó compilado, usa en su lugar:

Bash
npm rebuild
4. Ejecución del Proyecto
Levanta la infraestructura y los servicios:

Bash
# Levantar servicios (Redis, MinIO, Meilisearch)
docker-compose up -d

# Iniciar Backend (API)
cd App/api
npm run start:dev

# Iniciar Frontend (Web)
cd ../web
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

Error de autenticación (Database): - Verifica que DB_HOST, DB_USERNAME, DB_PASSWORD y DB_DATABASE en App/api/.env coincidan con las credenciales actuales de tu consola de Neon Cloud.

Un binario nativo no compiló al instalar:

npm no bloquea los scripts de instalación por defecto, así que basta con ejecutar npm rebuild dentro de la carpeta correspondiente (App/api o web). El comando npm approve-scripts no existe en npm.