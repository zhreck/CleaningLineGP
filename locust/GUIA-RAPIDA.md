# Guía Rápida: Cómo Usar Locust
## Paso a Paso para Principiantes

---

## 🚀 PASO 1: Instalar Locust

### Opción A: Con pip (Recomendado)
```bash
pip install locust
```

### Opción B: Con pip3 (si tienes Python 3)
```bash
pip3 install locust
```

### Verificar instalación
```bash
locust --version
```

Deberías ver algo como: `locust 2.17.0`

---

## 📁 PASO 2: Preparar el Proyecto

### 1. Asegúrate de estar en la carpeta correcta
```bash
cd C:\Users\rdpaj\OneDrive\Documentos\Proyectos\Shoping_Ecommerce
```

### 2. Verifica que existe la carpeta locust
```bash
dir locust
```

Deberías ver el archivo `locustfile.py`

---

## 🔧 PASO 3: Iniciar el Backend

**IMPORTANTE:** El backend DEBE estar corriendo antes de ejecutar Locust

### Abrir una terminal nueva (CMD o PowerShell)
```bash
cd app/api
npm run start:dev
```

**Espera a ver este mensaje:**
```
[Nest] 12345  - 05/12/2024, 14:30:00     LOG [NestApplication] Nest application successfully started
```

**NO CIERRES ESTA TERMINAL** - Déjala corriendo

---

## 🎯 PASO 4: Ejecutar Locust (Interfaz Web)

### Abrir OTRA terminal nueva
```bash
cd locust
locust -f locustfile.py --host http://localhost:3001
```

**Deberías ver:**
```
[2024-12-05 14:30:00,000] INFO/locust.main: Starting web interface at http://0.0.0.0:8089
[2024-12-05 14:30:00,000] INFO/locust.main: Starting Locust 2.17.0
```

---

## 🌐 PASO 5: Abrir el Navegador

### 1. Abre tu navegador (Chrome, Firefox, Edge)

### 2. Ve a esta URL:
```
http://localhost:8089
```

### 3. Verás una pantalla como esta:

```
┌─────────────────────────────────────────┐
│         Start new load test             │
├─────────────────────────────────────────┤
│                                         │
│  Number of users (peak concurrency)    │
│  [    50    ]                           │
│                                         │
│  Spawn rate (users started/second)     │
│  [     5    ]                           │
│                                         │
│  Host (e.g. http://www.example.com)    │
│  [ http://localhost:3001 ]              │
│                                         │
│  [ Start swarming ]                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## ⚙️ PASO 6: Configurar la Prueba

### Llenar los campos:

1. **Number of users:** `50`
   - Esto simula 50 usuarios concurrentes

2. **Spawn rate:** `5`
   - Crea 5 usuarios nuevos por segundo

3. **Host:** `http://localhost:3001`
   - Ya debería estar lleno automáticamente

### Click en "Start swarming" 🐝

---

## 📊 PASO 7: Ver los Resultados en Tiempo Real

### Verás 3 pestañas principales:

#### 1. **Statistics** (Estadísticas)
```
┌──────────────┬────────┬──────────┬──────────┬─────────┬─────────┐
│ Name         │ Method │ # Reqs   │ # Fails  │ Avg (ms)│ RPS     │
├──────────────┼────────┼──────────┼──────────┼─────────┼─────────┤
│ /products    │ GET    │ 245      │ 3        │ 243     │ 22.5    │
│ /products/:id│ GET    │ 189      │ 2        │ 251     │ 17.3    │
│ /products    │ POST   │ 125      │ 4        │ 378     │ 11.5    │
└──────────────┴────────┴──────────┴──────────┴─────────┴─────────┘
```

#### 2. **Charts** (Gráficas)
- Gráfica de RPS (requests por segundo)
- Gráfica de tiempos de respuesta
- Gráfica de número de usuarios

#### 3. **Failures** (Errores)
- Lista de todos los errores que ocurrieron

---

## ⏱️ PASO 8: Dejar Correr la Prueba

### Duración recomendada: 2 minutos (120 segundos)

**Observa cómo:**
- Los usuarios van aumentando gradualmente (5 por segundo)
- Las métricas se actualizan en tiempo real
- El RPS se estabiliza alrededor de 70

### Indicadores de que todo va bien:
- ✅ RPS entre 60-80
- ✅ Latencia promedio < 500 ms
- ✅ Tasa de fallos < 5%

---

## 🛑 PASO 9: Detener la Prueba

### Después de 2 minutos:

1. Click en el botón **"Stop"** (arriba a la derecha)

2. Verás las estadísticas finales

3. **IMPORTANTE:** Descarga los resultados

---

## 💾 PASO 10: Descargar Resultados

### En la pestaña "Statistics":

1. Click en **"Download Data"** (esquina superior derecha)

2. Selecciona:
   - ✅ **Download report (HTML)**
   - ✅ **Download statistics (CSV)**
   - ✅ **Download failures (CSV)**

3. Guarda los archivos en la carpeta `locust/`

---

## 📸 PASO 11: Tomar Capturas de Pantalla

### Para tu entrega académica, captura:

1. **Pantalla principal con estadísticas**
   - Muestra la tabla completa de endpoints

2. **Gráfica de RPS**
   - Pestaña "Charts" → Total Requests per Second

3. **Gráfica de latencia**
   - Pestaña "Charts" → Response Times

4. **Tabla de errores** (si hay)
   - Pestaña "Failures"

5. **Terminal con logs**
   - La terminal donde corre Locust

---

## 🔄 PASO 12: Ejecutar Nuevamente (Opcional)

### Si quieres repetir la prueba:

1. Click en **"New test"** (arriba a la izquierda)
2. Configura nuevamente los parámetros
3. Click en "Start swarming"

---

## 🎓 MODO ALTERNATIVO: Sin Interfaz (Headless)

### Si prefieres ejecutar sin abrir el navegador:

```bash
locust -f locustfile.py ^
  --host http://localhost:3001 ^
  --users 50 ^
  --spawn-rate 5 ^
  --run-time 2m ^
  --headless ^
  --html report.html ^
  --csv results
```

**Esto generará automáticamente:**
- `report.html` - Reporte visual
- `results_stats.csv` - Estadísticas
- `results_failures.csv` - Errores

---

## ❌ SOLUCIÓN DE PROBLEMAS

### Error: "Connection refused"

**Problema:** El backend no está corriendo

**Solución:**
```bash
# En otra terminal
cd app/api
npm run start:dev
```

---

### Error: "locust: command not found"

**Problema:** Locust no está instalado o no está en el PATH

**Solución:**
```bash
# Reinstalar
pip install locust

# O usar la ruta completa
python -m locust -f locustfile.py --host http://localhost:3001
```

---

### Error: "401 Unauthorized"

**Problema:** El token de autenticación no es válido

**Solución:** Esto es normal en pruebas. El locustfile usa un token mock. Si quieres usar uno real:

1. Inicia sesión en tu app
2. Copia el token JWT
3. Edita `locustfile.py` línea 35:
```python
self.token = "tu-token-real-aqui"
```

---

### Error: Puerto 8089 ya en uso

**Problema:** Ya hay otra instancia de Locust corriendo

**Solución:**
```bash
# Usar otro puerto
locust -f locustfile.py --host http://localhost:3001 --web-port 8090
```

Luego abre: `http://localhost:8090`

---

### La prueba es muy lenta

**Problema:** Tu computadora no tiene suficientes recursos

**Solución:** Reduce el número de usuarios:
```
Number of users: 20
Spawn rate: 2
```

---

## 📋 CHECKLIST ANTES DE EJECUTAR

- [ ] Python instalado (python --version)
- [ ] Locust instalado (locust --version)
- [ ] Backend corriendo (http://localhost:3001)
- [ ] Base de datos corriendo (PostgreSQL)
- [ ] Archivo locustfile.py existe
- [ ] Terminal abierta en carpeta locust/

---

## 🎯 RESUMEN RÁPIDO (TL;DR)

```bash
# Terminal 1: Backend
cd app/api
npm run start:dev

# Terminal 2: Locust
cd locust
locust -f locustfile.py --host http://localhost:3001

# Navegador
# Abrir: http://localhost:8089
# Usuarios: 50
# Spawn rate: 5
# Click: Start swarming
# Esperar: 2 minutos
# Click: Stop
# Descargar: HTML + CSV
```

---

## 📞 AYUDA ADICIONAL

### Ver logs detallados de Locust:
```bash
locust -f locustfile.py --host http://localhost:3001 --loglevel DEBUG
```

### Ver ayuda de comandos:
```bash
locust --help
```

### Documentación oficial:
https://docs.locust.io/

---

## ✅ SIGUIENTE PASO

Una vez que tengas los resultados:

1. Abre `PERFORMANCE-REPORT.md` para ver el análisis
2. Usa `TABLA-SUMATIVA-3.md` para tu documento Word
3. Lee `ACADEMIC-ANALYSIS.md` para las conclusiones
4. Incluye las capturas de pantalla en tu entrega

---

**¡Listo! Ahora sabes cómo usar Locust** 🎉

**Tiempo estimado total:** 15-20 minutos  
**Dificultad:** Fácil  
**Requisitos:** Python, Backend corriendo
