# Pruebas de Rendimiento con Locust
## Shopping Ecommerce - Módulo CRUD de Productos

### 🚀 INICIO RÁPIDO

**¿Primera vez usando Locust? Lee primero:**
- 📖 **GUIA-RAPIDA.md** - Paso a paso para principiantes
- 👀 **QUE-ESPERAR.md** - Qué verás al ejecutar Locust
- ⚡ **ejecutar-locust.bat** - Script automático para Windows

**Comando rápido:**
```bash
# Terminal 1: Inicia el backend
cd app/api
npm run start:dev

# Terminal 2: Ejecuta Locust
cd locust
locust -f locustfile.py --host http://localhost:3001

# Navegador: Abre http://localhost:8089
# Configura: 50 usuarios, spawn rate 5
# Click: Start swarming
```

---

### Descripción
Este directorio contiene las pruebas de rendimiento (no funcionales) para el módulo de administración de productos del sistema Shopping Ecommerce, desarrolladas con Locust como herramienta principal.

---

## Requisitos Previos

### 1. Instalación de Locust
```bash
pip install locust
```

### 2. Verificar instalación
```bash
locust --version
```

Versión recomendada: Locust 2.x o superior

---

## Estructura de Archivos

```
locust/
├── locustfile.py           # Archivo principal de pruebas
├── README.md               # Este archivo
├── PERFORMANCE-REPORT.md   # Reporte completo de resultados
└── ACADEMIC-ANALYSIS.md    # Análisis académico detallado
```

---

## Instrucciones de Ejecución

### Opción 1: Interfaz Web (Recomendado)

1. **Iniciar el backend de la aplicación**
   ```bash
   cd app/api
   npm run start:dev
   ```
   
   Verificar que el servidor esté corriendo en `http://localhost:3001`

2. **Ejecutar Locust con interfaz web**
   ```bash
   locust -f locustfile.py --host http://localhost:3001
   ```

3. **Abrir el navegador**
   - URL: `http://localhost:8089`
   - Configurar parámetros:
     - **Number of users**: 50
     - **Spawn rate**: 5 usuarios/segundo
     - **Host**: http://localhost:3001

4. **Iniciar prueba**
   - Click en "Start swarming"
   - Duración recomendada: 2 minutos (120 segundos)
   - Monitorear métricas en tiempo real

5. **Detener y descargar resultados**
   - Click en "Stop"
   - Descargar estadísticas en formato CSV o HTML

---

### Opción 2: Modo Headless (Sin interfaz)

Para ejecución automatizada o en CI/CD:

```bash
locust -f locustfile.py \
  --host http://localhost:3001 \
  --users 50 \
  --spawn-rate 5 \
  --run-time 2m \
  --headless \
  --html report.html \
  --csv results
```

**Parámetros explicados:**
- `--users 50`: Número total de usuarios concurrentes
- `--spawn-rate 5`: Velocidad de creación de usuarios (5 por segundo)
- `--run-time 2m`: Duración total de la prueba (2 minutos)
- `--headless`: Ejecutar sin interfaz web
- `--html report.html`: Generar reporte HTML
- `--csv results`: Generar archivos CSV con estadísticas

---

## Configuración de Pruebas

### Parámetros Recomendados

| Parámetro | Valor | Justificación |
|-----------|-------|---------------|
| **Usuarios** | 50 | Simula carga moderada-alta para un sistema de e-commerce |
| **Spawn Rate** | 5 usuarios/seg | Incremento gradual para observar degradación |
| **Duración** | 2 minutos | Tiempo suficiente para estabilizar métricas |
| **Host** | http://localhost:3001 | Backend NestJS en desarrollo |

### Escenarios de Prueba

El `locustfile.py` incluye dos clases de usuarios:

#### 1. **ProductCRUDUser** (Usuario principal)
Simula operaciones CRUD con pesos diferentes:
- `GET /products` - Peso 4 (40% de las operaciones)
- `POST /products` - Peso 2 (20% de las operaciones)
- `PATCH /products/:id` - Peso 2 (20% de las operaciones)
- `GET /products/:id` - Peso 3 (30% de las operaciones)
- `DELETE /products/:id` - Peso 1 (10% de las operaciones)

#### 2. **AdminWorkflowUser** (Flujo completo)
Simula un flujo completo de administración:
1. Listar productos
2. Crear producto
3. Actualizar producto
4. Consultar producto específico
5. Eliminar producto

---

## Métricas Evaluadas

### Métricas Principales
- **Total de Requests**: Número total de peticiones realizadas
- **Requests por Segundo (RPS)**: Throughput del sistema
- **Latencia Promedio**: Tiempo medio de respuesta
- **Latencia Máxima**: Peor tiempo de respuesta
- **Percentil 95 (P95)**: 95% de requests por debajo de este tiempo
- **Percentil 99 (P99)**: 99% de requests por debajo de este tiempo
- **Tasa de Fallos**: Porcentaje de requests fallidos
- **Tasa de Éxito**: Porcentaje de requests exitosos

### Métricas del Sistema
- **CPU Usage**: Consumo de CPU del servidor
- **Memory Usage**: Consumo de RAM del servidor
- **Network I/O**: Tráfico de red generado

---

## Criterios de Aceptación

Para que las pruebas sean consideradas exitosas:

| Métrica | Criterio de Aceptación |
|---------|------------------------|
| Latencia Promedio | < 500 ms |
| Latencia P95 | < 1000 ms |
| Latencia P99 | < 2000 ms |
| Tasa de Éxito | > 95% |
| Tasa de Fallos | < 5% |
| Throughput | > 100 RPS |
| CPU Usage | < 80% |
| Memory Usage | < 85% |

---

## Troubleshooting

### Error: "Connection refused"
**Causa**: El backend no está corriendo
**Solución**: 
```bash
cd app/api
npm run start:dev
```

### Error: "401 Unauthorized"
**Causa**: Token de autenticación inválido
**Solución**: Verificar que el endpoint `/auth/login` esté funcionando correctamente

### Error: "Too many open files"
**Causa**: Límite de archivos abiertos del sistema operativo
**Solución** (Linux/Mac):
```bash
ulimit -n 10000
```

### Latencias muy altas
**Posibles causas**:
- Base de datos no optimizada
- Falta de índices en tablas
- Consultas N+1
- Falta de caché

---

## Análisis de Resultados

Después de ejecutar las pruebas, revisar:

1. **PERFORMANCE-REPORT.md**: Reporte completo con todas las métricas
2. **ACADEMIC-ANALYSIS.md**: Análisis académico con interpretación de resultados
3. Archivos CSV generados (si se usó modo headless)
4. Reporte HTML (si se usó modo headless)

---

## Recomendaciones

### Antes de ejecutar
- Asegurar que la base de datos esté poblada con datos de prueba
- Cerrar aplicaciones innecesarias para liberar recursos
- Ejecutar en un entorno lo más similar posible a producción

### Durante la ejecución
- Monitorear el uso de recursos del sistema (CPU, RAM, disco)
- Observar los logs del backend para detectar errores
- Tomar capturas de pantalla de las métricas en tiempo real

### Después de ejecutar
- Analizar los resultados con criterio académico
- Identificar cuellos de botella
- Proponer mejoras basadas en datos reales
- Documentar hallazgos para la entrega académica

---

## Referencias

- [Documentación oficial de Locust](https://docs.locust.io/)
- [Best Practices for Performance Testing](https://locust.io/best-practices)
- [NestJS Performance Optimization](https://docs.nestjs.com/techniques/performance)

---

## Autor

**Proyecto**: Shopping Ecommerce  
**Módulo**: Administración de Productos  
**Asignatura**: Sumativa 3 - Pruebas de Software  
**Fecha**: Diciembre 2024
