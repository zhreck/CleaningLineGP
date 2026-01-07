@echo off
REM Script para ejecutar tests de evidencias - Tarea 7
REM Proyecto: Shopping Ecommerce - Sumativa 3

echo ========================================
echo   TAREA 7 - GENERACION DE EVIDENCIAS
echo   Playwright E2E Tests
echo ========================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo [ERROR] No se encontro package.json
    echo Por favor ejecuta este script desde la carpeta web/
    pause
    exit /b 1
)

echo [INFO] Verificando que la aplicacion este corriendo...
echo.

REM Verificar que el frontend este corriendo
echo Verificando frontend en http://localhost:3000...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5 -UseBasicParsing; exit 0 } catch { exit 1 }"
if errorlevel 1 (
    echo [ADVERTENCIA] El frontend no esta corriendo en http://localhost:3000
    echo.
    echo Por favor inicia el frontend en otra terminal:
    echo   cd web
    echo   npm run dev
    echo.
    echo Presiona cualquier tecla cuando el frontend este corriendo...
    pause >nul
) else (
    echo [OK] Frontend corriendo en http://localhost:3000
)

REM Verificar que el backend este corriendo
echo Verificando backend en http://localhost:3001...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001' -TimeoutSec 5 -UseBasicParsing; exit 0 } catch { exit 1 }"
if errorlevel 1 (
    echo [ADVERTENCIA] El backend no esta corriendo en http://localhost:3001
    echo.
    echo Por favor inicia el backend en otra terminal:
    echo   cd app/api
    echo   npm run start
    echo.
    echo Presiona cualquier tecla cuando el backend este corriendo...
    pause >nul
) else (
    echo [OK] Backend corriendo en http://localhost:3001
)

echo [OK] Aplicacion corriendo
echo.

echo ========================================
echo   EJECUTANDO TESTS DE EVIDENCIAS
echo ========================================
echo.
echo Esto generara:
echo   - Videos de cada test
echo   - Screenshots en evidence/screenshots/
echo   - Reporte HTML en playwright-report/
echo.
echo Duracion estimada: 3-5 minutos
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

REM Crear carpetas si no existen
if not exist "evidence\screenshots" mkdir evidence\screenshots
if not exist "evidence\videos" mkdir evidence\videos

REM Ejecutar tests
echo.
echo [INFO] Ejecutando tests...
echo.

call npm run test:evidence

if errorlevel 1 (
    echo.
    echo [ERROR] Algunos tests fallaron
    echo Revisa el reporte para mas detalles
) else (
    echo.
    echo [OK] Tests completados exitosamente
)

echo.
echo ========================================
echo   EVIDENCIAS GENERADAS
echo ========================================
echo.

REM Listar screenshots generados
echo Screenshots generados:
dir /b evidence\screenshots\*.png 2>nul
if errorlevel 1 (
    echo   [ADVERTENCIA] No se encontraron screenshots
) else (
    echo.
)

REM Listar videos generados
echo Videos generados:
dir /b /s test-results\*.webm 2>nul
if errorlevel 1 (
    echo   [ADVERTENCIA] No se encontraron videos
) else (
    echo.
)

echo ========================================
echo   ABRIR REPORTE
echo ========================================
echo.
echo Deseas abrir el reporte HTML? (S/N)
set /p abrir_reporte=

if /i "%abrir_reporte%"=="S" (
    echo Abriendo reporte...
    call npm run playwright:report
)

echo.
echo ========================================
echo   COMPLETADO
echo ========================================
echo.
echo Evidencias disponibles en:
echo   - Screenshots: web\evidence\screenshots\
echo   - Videos: web\test-results\
echo   - Reporte: web\playwright-report\
echo.
echo Para ver el reporte en cualquier momento:
echo   npm run playwright:report
echo.
pause

