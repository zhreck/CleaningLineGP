# Qué Esperar al Ejecutar Locust
## Guía Visual Paso a Paso

---

## 🖥️ PANTALLA 1: Inicio de Locust en Terminal

Cuando ejecutes `locust -f locustfile.py --host http://localhost:3001`, verás:

```
C:\...\Shoping_Ecommerce\locust> locust -f locustfile.py --host http://localhost:3001

[2024-12-05 14:30:00,123] INFO/locust.main: Starting web interface at http://0.0.0.0:8089 (accepting connections from all network interfaces)
[2024-12-05 14:30:00,124] INFO/locust.main: Starting Locust 2.17.0
```

**✅ Esto significa que Locust está corriendo correctamente**

---

## 🌐 PANTALLA 2: Interfaz Web Inicial

Al abrir `http://localhost:8089` en tu navegador, verás:

```
╔═══════════════════════════════════════════════════════════╗
║                    🐝 LOCUST                              ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Start new load test                                      ║
║                                                           ║
║  Number of users (peak concurrency)                       ║
║  ┌─────────────────────────────────────────────┐         ║
║  │ 50                                          │         ║
║  └─────────────────────────────────────────────┘         ║
║                                                           ║
║  Spawn rate (users started/second)                        ║
║  ┌─────────────────────────────────────────────┐         ║
║  │ 5                                           │         ║
║  └─────────────────────────────────────────────┘         ║
║                                                           ║
║  Host (e.g. http://www.example.com)                      ║
║  ┌─────────────────────────────────────────────┐         ║
║  │ http://localhost:3001                       │         ║
║  └─────────────────────────────────────────────┘         ║
║                                                           ║
║  ┌─────────────────────────────────────────────┐         ║
║  │         Start swarming                      │         ║
║  └─────────────────────────────────────────────┘         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Llena los campos y haz click en "Start swarming"**

---

## 📊 PANTALLA 3: Prueba en Ejecución - Pestaña Statistics

Verás una tabla como esta (se actualiza cada segundo):

```
╔═══════════════════════════════════════════════════════════════════════════════════╗
║  Type    Name                # Reqs  # Fails  Median  Average  Min  Max   RPS     ║
╠═══════════════════════════════════════════════════════════════════════════════════╣
║  GET     /products           245     3        185     243      87   1245  22.5    ║
║  GET     /products/:id       189     2        198     251      92   1189  17.3    ║
║  POST    /products           125     4        312     378      145  1567  11.5    ║
║  PATCH   /products/:id       128     3        298     365      138  1498  11.7    ║
║  DELETE  /products/:id       63      1        245     289      112  1234  5.8     ║
║  POST    /auth/login         5       0        156     178      98   345   0.5     ║
╠═══════════════════════════════════════════════════════════════════════════════════╣
║  Total                       755     13       234     287      87   1567  69.3    ║
╚═══════════════════════════════════════════════════════════════════════════════════╝

Current users: 50
Total RPS: 69.3
Failures: 1.7%
```

**Columnas importantes:**
- **# Reqs**: Número total de peticiones
- **# Fails**: Número de peticiones fallidas
- **Average**: Latencia promedio en milisegundos
- **RPS**: Requests por segundo

---

## 📈 PANTALLA 4: Prueba en Ejecución - Pestaña Charts

### Gráfica 1: Total Requests per Second

```
RPS
100 │                    ╭─────╮
 90 │                ╭───╯     ╰───╮
 80 │            ╭───╯               ╰───╮
 70 │        ╭───╯                       ╰───╮
 60 │    ╭───╯                               ╰───╮
 50 │╭───╯                                       ╰───╮
    └─────────────────────────────────────────────────
    0s   20s   40s   60s   80s  100s  120s
```

**Interpretación:**
- Inicio: Ramp-up gradual (usuarios aumentando)
- Medio: Estabilización (todos los usuarios activos)
- Final: Posible degradación

### Gráfica 2: Response Times (ms)

```
ms
600 │                                    ╭───╮
500 │                            ╭───────╯   ╰───╮
400 │                    ╭───────╯               ╰───
300 │            ╭───────╯
200 │    ╭───────╯
100 │────╯
    └─────────────────────────────────────────────────
    0s   20s   40s   60s   80s  100s  120s
```

**Interpretación:**
- Verde: Latencia baja (< 500 ms) ✅
- Amarillo: Latencia media (500-1000 ms) ⚠️
- Rojo: Latencia alta (> 1000 ms) ❌

### Gráfica 3: Number of Users

```
Users
50 │                    ╭─────────────────────────────╮
40 │                ╭───╯                             ╰───
30 │            ╭───╯
20 │        ╭───╯
10 │    ╭───╯
 0 │────╯
    └─────────────────────────────────────────────────
    0s   20s   40s   60s   80s  100s  120s
```

**Interpretación:**
- Muestra cómo se van agregando usuarios gradualmente
- Debería llegar a 50 en 10 segundos (5 usuarios/segundo)

---

## ⚠️ PANTALLA 5: Pestaña Failures (si hay errores)

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║  # Occurrences  Method  Name              Error                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║  45             GET     /products         404 Not Found                       ║
║  38             POST    /products         400 Bad Request: Invalid categoryId ║
║  11             PATCH   /products/:id     500 Internal Server Error           ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

**Tipos de errores comunes:**
- **404**: Recurso no encontrado (normal en pruebas)
- **400**: Datos inválidos (normal en pruebas)
- **500**: Error del servidor (requiere investigación)
- **Connection timeout**: Servidor saturado

---

## 🎯 PANTALLA 6: Indicadores en Tiempo Real (Arriba)

```
┌─────────────────────────────────────────────────────────────┐
│ State: RUNNING  Users: 50  RPS: 69.3  Failures: 1.7%       │
│ [Stop] [New test] [Edit] [Download Data]                   │
└─────────────────────────────────────────────────────────────┘
```

**Indicadores:**
- **State**: RUNNING (corriendo) o STOPPED (detenido)
- **Users**: Número actual de usuarios simulados
- **RPS**: Requests por segundo actual
- **Failures**: Porcentaje de errores

---

## ✅ PANTALLA 7: Después de Detener (Click en Stop)

```
╔═══════════════════════════════════════════════════════════════════════════════════╗
║  FINAL STATISTICS                                                                 ║
╠═══════════════════════════════════════════════════════════════════════════════════╣
║  Type    Name                # Reqs  # Fails  Median  Average  Min  Max   RPS     ║
╠═══════════════════════════════════════════════════════════════════════════════════╣
║  GET     /products           2738    45       185     243      87   1245  22.8    ║
║  GET     /products/:id       2053    38       198     251      92   1189  17.1    ║
║  POST    /products           1369    42       312     378      145  1567  11.4    ║
║  PATCH   /products/:id       1371    35       298     365      138  1498  11.4    ║
║  DELETE  /products/:id       685     18       245     289      112  1234  5.7     ║
║  POST    /auth/login         50      0        156     178      98   345   0.4     ║
╠═══════════════════════════════════════════════════════════════════════════════════╣
║  Total                       8266    178      234     287      87   1567  68.9    ║
╚═══════════════════════════════════════════════════════════════════════════════════╝

Test duration: 120 seconds
Total requests: 8,266
Success rate: 97.8%
```

**Ahora puedes descargar los resultados**

---

## 💾 PANTALLA 8: Descargar Resultados

Click en **"Download Data"** (arriba a la derecha):

```
┌─────────────────────────────────────────┐
│  Download Data                          │
├─────────────────────────────────────────┤
│  ☑ Download report (HTML)               │
│  ☑ Download statistics (CSV)            │
│  ☑ Download failures (CSV)              │
│  ☑ Download exceptions (CSV)            │
│                                         │
│  [Download]                             │
└─────────────────────────────────────────┘
```

**Archivos que se descargarán:**
- `report_YYYYMMDD_HHMMSS.html` - Reporte visual completo
- `statistics_YYYYMMDD_HHMMSS.csv` - Datos en CSV
- `failures_YYYYMMDD_HHMMSS.csv` - Errores en CSV

---

## 📱 PANTALLA 9: Terminal Durante la Ejecución

En la terminal donde ejecutaste Locust verás logs como:

```
[2024-12-05 14:30:10] INFO: All users spawned
[2024-12-05 14:30:15] INFO: Current RPS: 65.3
[2024-12-05 14:30:20] INFO: Current RPS: 68.7
[2024-12-05 14:30:30] INFO: Current RPS: 71.2
[2024-12-05 14:30:45] INFO: Current RPS: 69.8
[2024-12-05 14:31:00] INFO: Current RPS: 70.5
[2024-12-05 14:31:30] INFO: Current RPS: 68.3
[2024-12-05 14:32:00] INFO: Current RPS: 55.7
[2024-12-05 14:32:10] INFO: Stopping test...
[2024-12-05 14:32:10] INFO: Test completed
```

**No cierres esta terminal hasta que termines**

---

## 🎨 COLORES EN LA INTERFAZ

### Verde ✅
- Tasa de éxito > 95%
- Latencia < 500 ms
- Todo funcionando bien

### Amarillo ⚠️
- Tasa de éxito 90-95%
- Latencia 500-1000 ms
- Atención requerida

### Rojo ❌
- Tasa de éxito < 90%
- Latencia > 1000 ms
- Problemas serios

---

## 📊 VALORES ESPERADOS (Normales)

### ✅ Buenos Resultados
```
Total Requests:     8,000 - 9,000
Success Rate:       > 95%
Average Latency:    200 - 400 ms
RPS:                60 - 80
Failures:           < 5%
```

### ⚠️ Resultados Aceptables
```
Total Requests:     6,000 - 8,000
Success Rate:       90 - 95%
Average Latency:    400 - 600 ms
RPS:                40 - 60
Failures:           5 - 10%
```

### ❌ Resultados Problemáticos
```
Total Requests:     < 6,000
Success Rate:       < 90%
Average Latency:    > 600 ms
RPS:                < 40
Failures:           > 10%
```

---

## 🔔 NOTIFICACIONES QUE VERÁS

### Durante el Ramp-Up (primeros 10 segundos)
```
[INFO] Spawning 5 users...
[INFO] Spawning 5 users... (10 total)
[INFO] Spawning 5 users... (15 total)
...
[INFO] All users spawned (50 total)
```

### Durante la Prueba
```
[INFO] Current RPS: 69.3
[INFO] Current failures: 1.7%
```

### Si Hay Problemas
```
[WARNING] High failure rate detected: 15.3%
[ERROR] Connection timeout for GET /products
[ERROR] 500 Internal Server Error for POST /products
```

---

## 🎯 CHECKLIST: ¿Está Todo Bien?

Durante la ejecución, verifica:

- [ ] **Users**: Llega a 50 en ~10 segundos
- [ ] **RPS**: Se mantiene entre 60-80
- [ ] **Average Latency**: < 500 ms
- [ ] **Failures**: < 5%
- [ ] **Gráficas**: Sin caídas abruptas
- [ ] **Terminal**: Sin errores rojos
- [ ] **Backend**: Sigue corriendo sin crashear

---

## 🚨 SEÑALES DE ALERTA

### ⚠️ Atención si ves:
- RPS cayendo constantemente
- Latencia aumentando > 1000 ms
- Failures > 10%
- Muchos errores 500
- Backend usando 100% CPU

### 🛑 Detén la prueba si:
- Backend se cae/crashea
- Computadora se congela
- Failures > 50%
- No hay respuestas (timeout constante)

---

## 📸 CAPTURAS RECOMENDADAS PARA TU ENTREGA

1. **Pantalla de configuración inicial** (antes de Start swarming)
2. **Tabla de estadísticas completa** (después de detener)
3. **Gráfica de RPS** (pestaña Charts)
4. **Gráfica de Response Times** (pestaña Charts)
5. **Terminal con logs** (mostrando inicio y fin)
6. **Reporte HTML descargado** (abierto en navegador)

---

## ✨ TIPS FINALES

### Para Mejores Resultados:
- Cierra otras aplicaciones pesadas
- No uses la computadora durante la prueba
- Asegúrate de tener buena conexión
- Deja que la prueba complete los 2 minutos

### Para la Entrega Académica:
- Toma capturas en alta resolución
- Anota la hora de inicio y fin
- Guarda todos los archivos CSV
- Documenta cualquier error que veas

---

**¡Ahora sabes exactamente qué esperar!** 🎉

Cuando ejecutes Locust, todo debería verse como se muestra aquí.
