@echo off
REM Script completo para ejecutar tests de evidencias - Tarea 7
REM Incluye construcción del backend y verificaciones

echo ========================================
echo   TAREA 7 - SETUP COMPLETO + TESTS
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

echo [INFO] Verificando estructura del proyecto...

REM Verificar que existe el backend
if not exist "..\app\api\package.json" (
    echo [ERROR] No se encontro el backend en ..\app\api\
    echo Verifica la estructura del proyecto
    pause
    exit /b 1
)

echo [OK] Estructura del proyecto correcta
echo.

echo ========================================
echo   PASO 1: CONSTRUIR BACKEND
echo ========================================
echo.
echo Construyendo el backend NestJS...
echo Esto puede tomar 1-2 minutos...
echo.

cd ..\app\api
call npm run build

if errorlevel 1 (
    echo [ERROR] Fallo la construccion del backend
    echo Revisa los errores arriba
    pause
    exit /b 1
)

echo [OK] Backend construido exitosamente
echo.

echo ========================================
echo   PASO 2: VERIFICAR SERVICIOS
echo ========================================
echo.

echo Verificando que los servicios esten corriendo...
echo.

REM Volver al directorio web
cd ..\..\web

REM Verificar frontend
echo Verificando frontend en http://localhost:3000...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5 -UseBasicParsing; exit 0 } catch { exit 1 }"
if errorlevel 1 (
    echo [ADVERTENCIA] El frontend no esta corriendo
    echo.
    echo Por favor inicia el frontend en otra terminal:
    echo   cd web
    echo   npm run dev
    echo.
    echo Presiona cualquier tecla cuando este corriendo...
    pause >nul
) else (
    echo [OK] Frontend corriendo
)

REM Verificar backend
echo Verificando backend en http://localhost:3001...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001' -TimeoutSec 5 -UseBasicParsing; exit 0 } catch { exit 1 }"
if errorlevel 1 (
    echo [ADVERTENCIA] El backend no esta corriendo
    echo.
    echo Por favor inicia el backend en otra terminal:
    echo   cd app/api
    echo   npm run start
    echo.
    echo Presiona cualquier tecla cuando este corriendo...
    pause >nul
) else (
    echo [OK] Backend corriendo
)

REM Verificar que la pagina del catalogo funcione
echo Verificando pagina del catalogo...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/catalogo' -TimeoutSec 10 -UseBasicParsing; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if errorlevel 1 (
    echo [ERROR] La pagina del catalogo no funciona correctamente
    echo Posibles causas:
    echo - Backend no conecta con la base de datos
    echo - Servicios no estan completamente iniciados
    echo.
    echo Revisa los logs del backend y frontend
    pause
    exit /b 1
) else (
    echo [OK] Pagina del catalogo funcionando
)

echo.
echo [OK] Todos los servicios estan corriendo correctamente
echo.

echo ========================================
echo   PASO 3: EJECUTAR TESTS
echo ========================================
echo.
echo Esto generara:
echo   - Videos de cada test (2)
echo   - Screenshots (11+)
echo   - Reporte HTML completo
echo.
echo Duracion estimada: 3-5 minutos
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

REM Crear carpetas si no existen
if not exist "evidence\screenshots" mkdir evidence\screenshots
if not exist "evidence\videos" mkdir evidence\videos

REM Ejecutar tests con timeouts aumentados
echo.
echo [INFO] Ejecutando tests con configuracion mejorada...
echo.

call npm run test:evidence

if errorlevel 1 (
    echo.
    echo [ADVERTENCIA] Algunos tests fallaron
    echo Esto puede ser normal si hay problemas de timing
    echo Revisa el reporte para mas detalles
) else (
    echo.
    echo [OK] Todos los tests completados exitosamente
)

echo.
echo ========================================
echo   RESULTADOS
echo ========================================
echo.

REM Contar screenshots generados
set /a screenshot_count=0
for %%f in (evidence\screenshots\*.png) do set /a screenshot_count+=1

echo Screenshots generados: %screenshot_count%
if %screenshot_count% gtr 0 (
    echo.
    dir /b evidence\screenshots\*.png
    echo.
) else (
    echo   [ADVERTENCIA] No se generaron screenshots
)

REM Verificar videos
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
echo   - Screenshots: web\evidence\screenshots\ (%screenshot_count% archivos)
echo   - Videos: web\test-results\
echo   - Reporte: web\playwright-report\
echo.
echo Para ver el reporte en cualquier momento:
echo   npm run playwright:report
echo.
echo Para volver a ejecutar solo los tests:
echo   npm run test:evidence
echo.
pause