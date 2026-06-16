@echo off
REM 🚀 Shopping E-commerce - Script de Instalación Automatizada para Windows
REM Este script configura todo el entorno de desarrollo automáticamente

echo 🛒 Shopping E-commerce - Instalación Automatizada
echo ==================================================

REM Verificar prerequisitos
echo [INFO] Verificando prerequisitos...

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado. Por favor instala Node.js v18+ desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no está instalado.
    pause
    exit /b 1
)

REM Verificar Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker no está instalado. Por favor instala Docker Desktop desde https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

REM Verificar que Docker esté corriendo
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker no está corriendo. Por favor inicia Docker Desktop.
    pause
    exit /b 1
)

echo [SUCCESS] Todos los prerequisitos están instalados ✅

REM Configurar variables de entorno
echo [INFO] Configurando variables de entorno...

if not exist "app\api\.env" (
    copy "app\api\.env.example" "app\api\.env"
    echo [SUCCESS] Archivo app\api\.env creado desde .env.example
) else (
    echo [WARNING] app\api\.env ya existe, no se sobrescribirá
)

if not exist "web\.env.local" (
    copy "web\.env.example" "web\.env.local"
    echo [SUCCESS] Archivo web\.env.local creado desde .env.example
) else (
    echo [WARNING] web\.env.local ya existe, no se sobrescribirá
)

REM Levantar servicios de infraestructura
echo [INFO] Levantando servicios de infraestructura con Docker...
docker-compose up -d

echo [INFO] Esperando que los servicios estén listos...
timeout /t 10 /nobreak >nul

echo [SUCCESS] Servicios de infraestructura iniciados correctamente ✅

REM Configurar backend
echo [INFO] Configurando backend...
cd app\api

echo [INFO] Instalando dependencias del backend...
call npm install

echo [INFO] Compilando backend...
call npm run build

echo [INFO] Poblando base de datos con datos de prueba...
call npm run seed

cd ..\..
echo [SUCCESS] Backend configurado correctamente ✅

REM Configurar frontend
echo [INFO] Configurando frontend...
cd web

echo [INFO] Instalando dependencias del frontend...
call npm install

cd ..
echo [SUCCESS] Frontend configurado correctamente ✅

REM Configurar SigNoz (opcional)
set /p install_signoz="¿Deseas instalar SigNoz para observabilidad? (y/N): "
if /i "%install_signoz%"=="y" (
    echo [INFO] Configurando SigNoz...
    
    if not exist "signoz-deploy" (
        git clone https://github.com/SigNoz/signoz.git signoz-deploy
    )
    
    cd signoz-deploy\deploy\docker
    docker compose up -d
    cd ..\..\..
    
    echo [SUCCESS] SigNoz configurado. Accede en http://localhost:3301
) else (
    echo [WARNING] SigNoz no será instalado. Puedes instalarlo manualmente más tarde.
)

REM Mostrar información final
echo.
echo 🎉 ¡Instalación completada exitosamente!
echo ========================================
echo.
echo Para iniciar la aplicación:
echo.
echo 1. Backend (Terminal 1):
echo    cd app\api
echo    npm run start:otel
echo.
echo 2. Frontend (Terminal 2):
echo    cd web
echo    npm run dev
echo.
echo URLs de acceso:
echo - Frontend:     http://localhost:3000
echo - Backend API:  http://localhost:3002
echo - Swagger Docs: http://localhost:3002/api/docs
echo "- SigNoz:       http://localhost:3301 (si fue instalado)"
echo - MinIO:        http://localhost:9001 (admin/adminadmin)
echo.
echo Para más información, consulta DEPLOYMENT-GUIDE.md
echo.

pause