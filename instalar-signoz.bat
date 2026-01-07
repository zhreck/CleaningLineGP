@echo off
REM Script para instalar SigNoz en Windows
REM Proyecto: Shopping Ecommerce - Tarea 5

echo ========================================
echo   INSTALACION DE SIGNOZ
echo   Shopping Ecommerce - Tarea 5
echo ========================================
echo.

REM Verificar si Docker está corriendo
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta corriendo
    echo Por favor inicia Docker Desktop y espera a que este completamente iniciado
    pause
    exit /b 1
)

echo [OK] Docker esta corriendo
echo.

REM Verificar si ya existe la carpeta signoz-deploy
if exist "signoz-deploy" (
    echo [ADVERTENCIA] La carpeta signoz-deploy ya existe
    echo.
    echo Deseas eliminarla y reinstalar? (S/N)
    set /p reinstalar=
    if /i "%reinstalar%"=="S" (
        echo Eliminando carpeta anterior...
        rmdir /s /q signoz-deploy
        echo [OK] Carpeta eliminada
    ) else (
        echo Usando instalacion existente...
        goto verificar
    )
)

echo Clonando repositorio de SigNoz...
echo Esto puede tardar 2-3 minutos...
echo.

git clone -b main https://github.com/SigNoz/signoz.git signoz-deploy

if errorlevel 1 (
    echo [ERROR] No se pudo clonar el repositorio
    echo Verifica tu conexion a internet
    pause
    exit /b 1
)

echo [OK] Repositorio clonado exitosamente
echo.

:verificar
echo Navegando al directorio de Docker Compose...
cd signoz-deploy\deploy\docker

if errorlevel 1 (
    echo [ERROR] No se encontro el directorio deploy/docker
    pause
    exit /b 1
)

echo [OK] Directorio encontrado
echo.

echo ========================================
echo   LEVANTANDO CONTENEDORES DE SIGNOZ
echo ========================================
echo.
echo Esto puede tardar 5-10 minutos la primera vez...
echo Los contenedores se descargaran e iniciaran automaticamente
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

docker compose up -d --remove-orphans

if errorlevel 1 (
    echo.
    echo [ERROR] Hubo un problema al levantar los contenedores
    echo Revisa los logs con: docker compose logs
    pause
    exit /b 1
)

echo.
echo [OK] Contenedores levantados exitosamente
echo.

echo Esperando 30 segundos para que los servicios inicien...
timeout /t 30 /nobreak >nul

echo.
echo ========================================
echo   VERIFICANDO ESTADO DE CONTENEDORES
echo ========================================
echo.

docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo ========================================
echo   INSTALACION COMPLETADA
echo ========================================
echo.
echo SigNoz esta corriendo en:
echo   - UI: http://localhost:3301
echo   - OTLP Collector: http://localhost:4317
echo.
echo Abre tu navegador en http://localhost:3301 para acceder a SigNoz
echo.
echo Para ver logs:
echo   cd signoz-deploy\deploy\docker
echo   docker compose logs -f
echo.
echo Para detener SigNoz:
echo   cd signoz-deploy\deploy\docker
echo   docker compose down
echo.
pause
