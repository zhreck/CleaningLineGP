@echo off
REM Script para ejecutar Locust en Windows
REM Proyecto: Shopping Ecommerce - Pruebas de Rendimiento

echo ========================================
echo   LOCUST - Pruebas de Rendimiento
echo   Shopping Ecommerce
echo ========================================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no esta instalado
    echo Por favor instala Python desde: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python instalado
echo.

REM Verificar si Locust está instalado
locust --version >nul 2>&1
if errorlevel 1 (
    echo [ADVERTENCIA] Locust no esta instalado
    echo.
    echo Deseas instalar Locust ahora? (S/N)
    set /p instalar=
    if /i "%instalar%"=="S" (
        echo Instalando Locust...
        pip install locust
        echo.
        echo [OK] Locust instalado
    ) else (
        echo Por favor instala Locust manualmente: pip install locust
        pause
        exit /b 1
    )
)

echo [OK] Locust instalado
echo.

REM Verificar si el backend está corriendo
echo Verificando si el backend esta corriendo...
curl -s http://localhost:3001 >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ADVERTENCIA] El backend NO esta corriendo en http://localhost:3001
    echo.
    echo IMPORTANTE: Debes iniciar el backend antes de ejecutar Locust
    echo.
    echo Abre otra terminal y ejecuta:
    echo   cd app\api
    echo   npm run start:dev
    echo.
    echo Presiona cualquier tecla cuando el backend este corriendo...
    pause >nul
)

echo [OK] Backend corriendo
echo.

REM Verificar si existe locustfile.py
if not exist "locustfile.py" (
    echo [ERROR] No se encuentra locustfile.py
    echo Asegurate de estar en la carpeta locust/
    pause
    exit /b 1
)

echo [OK] locustfile.py encontrado
echo.

REM Preguntar modo de ejecución
echo Como deseas ejecutar Locust?
echo.
echo 1. Con interfaz web (recomendado para principiantes)
echo 2. Sin interfaz (headless - genera reportes automaticamente)
echo 3. Cancelar
echo.
set /p modo="Selecciona una opcion (1/2/3): "

if "%modo%"=="1" goto web
if "%modo%"=="2" goto headless
if "%modo%"=="3" goto end

echo Opcion invalida
pause
exit /b 1

:web
echo.
echo ========================================
echo   MODO: Interfaz Web
echo ========================================
echo.
echo Iniciando Locust con interfaz web...
echo.
echo Una vez que se inicie:
echo   1. Abre tu navegador en: http://localhost:8089
echo   2. Configura:
echo      - Number of users: 50
echo      - Spawn rate: 5
echo      - Host: http://localhost:3001
echo   3. Click en "Start swarming"
echo   4. Espera 2 minutos
echo   5. Click en "Stop"
echo   6. Descarga los resultados (HTML + CSV)
echo.
echo Presiona Ctrl+C para detener Locust
echo.
pause

locust -f locustfile.py --host http://localhost:3001

goto end

:headless
echo.
echo ========================================
echo   MODO: Sin Interfaz (Headless)
echo ========================================
echo.
echo Configuracion:
echo   - Usuarios: 50
echo   - Spawn rate: 5 usuarios/segundo
echo   - Duracion: 2 minutos
echo   - Host: http://localhost:3001
echo.
echo Los resultados se guardaran en:
echo   - performance-report.html
echo   - results_stats.csv
echo   - results_failures.csv
echo.
echo Iniciando prueba...
echo.

locust -f locustfile.py --host http://localhost:3001 --users 50 --spawn-rate 5 --run-time 2m --headless --html performance-report.html --csv results

echo.
echo ========================================
echo   PRUEBA COMPLETADA
echo ========================================
echo.
echo Archivos generados:
dir /b performance-report.html results_*.csv 2>nul
echo.
echo Abre performance-report.html en tu navegador para ver los resultados
echo.
pause

goto end

:end
echo.
echo Gracias por usar Locust!
echo.
pause
