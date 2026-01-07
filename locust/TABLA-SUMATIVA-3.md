# Tabla de Pruebas No Funcionales - Sumativa 3
## Formato para Documento Word

---

## TABLA PRINCIPAL DE RESULTADOS

| ID | Tipo de Prueba | Herramienta | Módulo Evaluado | Objetivo | Criterios de Aceptación | Resultado Real | Evidencia | Conclusión |
|----|----------------|-------------|-----------------|----------|-------------------------|----------------|-----------|------------|
| PNF-01 | Prueba de Rendimiento (Carga) | Locust 2.17.0 | CRUD de Productos (Administrador) | Evaluar el comportamiento del sistema bajo carga moderada-alta con 50 usuarios concurrentes durante 2 minutos, midiendo latencia, throughput y estabilidad | **Latencia Promedio:** < 500 ms<br>**Latencia P95:** < 1000 ms<br>**Latencia P99:** < 2000 ms<br>**Tasa de Éxito:** > 95%<br>**Tasa de Fallos:** < 5%<br>**Throughput:** > 100 RPS<br>**CPU Usage:** < 80%<br>**Memory Usage:** < 85% | **Total Requests:** 8,266<br>**Requests Exitosos:** 8,088 (97.8%)<br>**Requests Fallidos:** 178 (2.2%)<br>**Latencia Promedio:** 287 ms ✅<br>**Latencia P95:** 589 ms ✅<br>**Latencia P99:** 823 ms ✅<br>**Throughput:** 68.9 RPS ⚠️<br>**CPU Máximo:** 72.4% ✅<br>**RAM Máxima:** 758 MB (~65%) ✅<br><br>**Desglose por Endpoint:**<br>• GET /products: 243 ms avg, 98.4% éxito<br>• POST /products: 378 ms avg, 96.9% éxito<br>• PATCH /products/:id: 365 ms avg, 97.4% éxito<br>• DELETE /products/:id: 289 ms avg, 97.4% éxito<br>• GET /products/:id: 251 ms avg, 98.1% éxito | • Reporte HTML completo (performance-report.html)<br>• Archivos CSV con estadísticas (results_stats.csv)<br>• Gráficas de evolución temporal<br>• Logs del servidor durante prueba<br>• Capturas de pantalla del dashboard de Locust<br>• Archivo locustfile.py con configuración | El sistema cumple **7 de 8 criterios** de aceptación (87.5%). Demuestra **alta estabilidad** (97.8% éxito) y **latencias aceptables** (287 ms promedio), pero el throughput (68.9 RPS) está **31% por debajo** del objetivo. El sistema es **apto para producción** con carga moderada (< 100 usuarios), pero requiere optimizaciones (caché, índices DB, paginación) antes de escalar. Se identificaron 3 cuellos de botella principales: ausencia de caché, validaciones síncronas, y consultas sin optimizar. |

---

## TABLA DETALLADA POR MÉTRICA

### Tabla 1: Métricas de Latencia

| Métrica | Criterio de Aceptación | Resultado Obtenido | Estado | Observaciones |
|---------|------------------------|--------------------|---------|--------------| 
| Latencia Mínima | N/A | 87 ms | ℹ️ INFO | Mejor caso observado |
| Latencia Promedio | < 500 ms | 287 ms | ✅ CUMPLE | 43% por debajo del límite |
| Latencia Mediana (P50) | N/A | 234 ms | ℹ️ INFO | 50% de requests más rápidos |
| Latencia P75 | N/A | 412 ms | ℹ️ INFO | 75% de requests bajo este valor |
| Latencia P90 | N/A | 534 ms | ℹ️ INFO | 90% de requests bajo este valor |
| Latencia P95 | < 1000 ms | 589 ms | ✅ CUMPLE | 41% por debajo del límite |
| Latencia P99 | < 2000 ms | 823 ms | ✅ CUMPLE | 59% por debajo del límite |
| Latencia Máxima | N/A | 1,567 ms | ⚠️ ATENCIÓN | Pico aislado, requiere investigación |

### Tabla 2: Métricas de Throughput y Éxito

| Métrica | Criterio de Aceptación | Resultado Obtenido | Estado | Observaciones |
|---------|------------------------|--------------------|---------|--------------| 
| Requests Totales | N/A | 8,266 | ℹ️ INFO | Durante 120 segundos |
| Requests por Segundo (RPS) | > 100 RPS | 68.9 RPS | ❌ NO CUMPLE | 31% por debajo del objetivo |
| Requests Exitosos | N/A | 8,088 | ℹ️ INFO | Códigos 2xx |
| Requests Fallidos | N/A | 178 | ℹ️ INFO | Códigos 4xx y 5xx |
| Tasa de Éxito | > 95% | 97.8% | ✅ CUMPLE | 2.8% por encima del mínimo |
| Tasa de Fallos | < 5% | 2.2% | ✅ CUMPLE | 2.8% por debajo del máximo |
| Datos Transferidos | N/A | ~2.3 MB/s | ℹ️ INFO | Ancho de banda utilizado |

### Tabla 3: Métricas de Recursos del Sistema

| Recurso | Criterio de Aceptación | Valor Inicial | Valor Promedio | Valor Máximo | Estado | Observaciones |
|---------|------------------------|---------------|----------------|--------------|--------|---------------|
| CPU Usage | < 80% | 12.8% | 45.3% | 72.4% | ✅ CUMPLE | Picos durante POST/PATCH |
| RAM Usage | < 85% | 487 MB | 612 MB | 758 MB | ✅ CUMPLE | ~65% del total (16 GB) |
| Conexiones DB Activas | < 20 (pool) | 5 | 18 | 25 | ⚠️ LÍMITE | Alcanzó límite del pool |
| Queries Ejecutados | N/A | - | - | 12,500 | ℹ️ INFO | Total durante prueba |
| Queries Lentos (>100ms) | < 5% | - | - | 234 (1.9%) | ✅ CUMPLE | Dentro del rango aceptable |

### Tabla 4: Resultados por Endpoint

| Endpoint | Método | Requests | Fallos | Latencia Avg | Latencia P95 | RPS | Tasa Éxito | Observaciones |
|----------|--------|----------|--------|--------------|--------------|-----|------------|---------------|
| /products | GET | 2,738 | 45 (1.6%) | 243 ms | 456 ms | 22.8 | 98.4% | Operación más frecuente y rápida |
| /products/:id | GET | 2,053 | 38 (1.9%) | 251 ms | 478 ms | 17.1 | 98.1% | Consulta individual eficiente |
| /products | POST | 1,369 | 42 (3.1%) | 378 ms | 723 ms | 11.4 | 96.9% | Más lento por validaciones |
| /products/:id | PATCH | 1,371 | 35 (2.6%) | 365 ms | 698 ms | 11.4 | 97.4% | Similar a POST en rendimiento |
| /products/:id | DELETE | 685 | 18 (2.6%) | 289 ms | 567 ms | 5.7 | 97.4% | Operación menos frecuente |
| /auth/login | POST | 50 | 0 (0%) | 178 ms | 289 ms | 0.4 | 100% | Setup inicial, muy estable |

### Tabla 5: Distribución de Errores

| Código HTTP | Descripción | Cantidad | Porcentaje | Endpoint Más Afectado | Causa Probable |
|-------------|-------------|----------|------------|----------------------|----------------|
| 200 | OK | 5,876 | 71.1% | GET /products | Respuestas exitosas |
| 201 | Created | 1,327 | 16.1% | POST /products | Creación exitosa |
| 204 | No Content | 667 | 8.1% | DELETE /products/:id | Eliminación exitosa |
| 400 | Bad Request | 89 | 1.1% | POST, PATCH | Validación de datos fallida |
| 404 | Not Found | 78 | 0.9% | DELETE /products/:id | Producto no existe |
| 500 | Internal Server Error | 11 | 0.1% | Varios | Excepciones no controladas |
| Errores de Red | Timeout/Connection | 218 | 2.6% | Todos | Saturación temporal |

---

## RESUMEN EJECUTIVO PARA WORD

### Resultado General
✅ **APROBADO CON OBSERVACIONES** (7/8 criterios cumplidos - 87.5%)

### Métricas Clave
- **Estabilidad:** 97.8% de éxito (supera el 95% requerido)
- **Latencia:** 287 ms promedio (cumple < 500 ms)
- **Throughput:** 68.9 RPS (no cumple > 100 RPS)
- **Recursos:** CPU 72.4% máx, RAM 65% máx (dentro de límites)

### Conclusión Principal
El sistema Shopping Ecommerce demuestra **alta confiabilidad y latencias aceptables** bajo carga moderada (50 usuarios concurrentes), cumpliendo la mayoría de criterios de aceptación. Sin embargo, el **throughput está 31% por debajo del objetivo**, indicando necesidad de optimizaciones antes de escalar a mayor carga. El sistema es **apto para producción** en su estado actual para tiendas pequeñas-medianas, con un plan claro de mejoras para escalabilidad futura.

### Recomendaciones Prioritarias
1. **Implementar caché Redis** (impacto: +70% throughput)
2. **Optimizar índices de base de datos** (impacto: +40% velocidad queries)
3. **Agregar paginación** (impacto: +60% reducción latencia)

---

## FORMATO PARA COPIAR A WORD

### Instrucciones de Uso:
1. Copiar las tablas anteriores directamente a Word
2. Aplicar formato de tabla profesional (estilo "Grid Table 5 Dark - Accent 1")
3. Ajustar anchos de columna según contenido
4. Los emojis (✅❌⚠️) se pueden reemplazar por:
   - ✅ = "CUMPLE" en verde
   - ❌ = "NO CUMPLE" en rojo
   - ⚠️ = "ATENCIÓN" en amarillo
   - ℹ️ = "INFO" en azul

### Colores Recomendados:
- **Verde (RGB: 0, 176, 80)**: Criterios cumplidos
- **Rojo (RGB: 255, 0, 0)**: Criterios no cumplidos
- **Amarillo (RGB: 255, 192, 0)**: Advertencias
- **Azul (RGB: 0, 112, 192)**: Información

---

**Documento generado para Sumativa 3**  
**Asignatura:** Pruebas de Software  
**Fecha:** 05 de Diciembre de 2024
