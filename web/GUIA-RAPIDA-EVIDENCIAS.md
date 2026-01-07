# Guía Rápida - Generación de Evidencias
## Tarea 7 - Sumativa 3

---

## 🚀 Inicio Rápido (3 Pasos)

### 1️⃣ Asegúrate que la aplicación esté corriendo

```bash
# Terminal 1: Backend
cd app/api
npm run start

# Terminal 2: Frontend
cd web
npm run dev
```

Verifica:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:3001

### 2️⃣ Ejecuta el script automático

```bash
# Opción A: Doble clic en el archivo
ejecutar-evidencias.bat

# Opción B: Desde terminal
cd web
.\ejecutar-evidencias.bat
```

### 3️⃣ Espera 3-5 minutos

El script:
- ✅ Ejecuta todos los tests
- ✅ Genera videos
- ✅ Genera screenshots
- ✅ Crea reporte HTML

---

## 📁 Dónde Encontrar las Evidencias

### Screenshots (Imágenes)

**Ubicación:** `web/evidence/screenshots/`

**Archivos clave:**
- ✅ `checkout-success.png` - Compra exitosa
- ❌ `checkout-error.png` - Error de validación
- ❌ `out-of-stock.png` - Producto sin stock

**Total:** ~11 screenshots

### Videos

**Ubicación:** `web/test-results/[nombre-test]/video.webm`

**Archivos:**
- 📹 `checkout-flow-chromium/video.webm` - Flujo completo exitoso
- 📹 `invalid-cases-chromium/video.webm` - Casos de error

### Reporte HTML

**Ubicación:** `web/playwright-report/index.html`

**Ver reporte:**
```bash
npm run playwright:report
```

---

## 🎯 Tests Incluidos

### Test 1: Flujo Exitoso ✅

**Duración:** ~60 segundos

**Pasos:**
1. Ver catálogo de productos
2. Seleccionar producto
3. Agregar al carrito
4. Ir al checkout
5. Completar datos
6. Finalizar compra
7. Ver confirmación

**Screenshots generados:** 7

### Test 2: Casos Inválidos ❌

**Duración:** ~90 segundos

**Casos:**
1. Checkout sin datos → Error de validación
2. Producto sin stock → Botón deshabilitado
3. Carrito vacío → Sin opción de checkout

**Screenshots generados:** 5

---

## 📊 Para tu Informe Académico

### Insertar Screenshots en Word

1. **Insertar → Imagen → Desde archivo**
2. Seleccionar de `web/evidence/screenshots/`
3. Agregar pie de foto:
   ```
   Figura X: [Descripción]
   Fuente: Elaboración propia mediante Playwright
   ```

### Insertar Videos en PowerPoint

1. **Insertar → Video → Video en Mi PC**
2. Seleccionar archivo `.webm` de `test-results/`
3. Configurar reproducción automática

### Tabla de Evidencias (Ejemplo)

| ID | Tipo de Prueba | Resultado | Evidencia |
|----|----------------|-----------|-----------|
| E2E-01 | Checkout exitoso | ✅ Exitoso | checkout-success.png |
| E2E-02 | Validación de formulario | ✅ Exitoso | checkout-error.png |
| E2E-03 | Producto sin stock | ✅ Exitoso | out-of-stock.png |

---

## 🔧 Comandos Útiles

### Ejecutar solo un test

```bash
# Solo flujo exitoso
npx playwright test checkout-flow.spec.ts

# Solo casos inválidos
npx playwright test invalid-cases.spec.ts
```

### Ver test en modo visual

```bash
npm run test:evidence:headed
```

### Ver reporte

```bash
npm run playwright:report
```

### Limpiar resultados anteriores

```bash
# Windows
rmdir /s /q test-results
rmdir /s /q playwright-report
del /q evidence\screenshots\*.png

# PowerShell
Remove-Item -Recurse -Force test-results, playwright-report
Remove-Item evidence\screenshots\*.png
```

---

## ❌ Solución de Problemas

### "Application not running"

**Problema:** Frontend o backend no están corriendo

**Solución:**
```bash
# Terminal 1
cd app/api
npm run start

# Terminal 2
cd web
npm run dev

# Terminal 3
cd web
npm run test:evidence
```

### "Timeout waiting for element"

**Problema:** Selectores no coinciden con tu aplicación

**Solución:**
1. Abre `tests/evidence/checkout-flow.spec.ts`
2. Actualiza los selectores según tu HTML
3. Ejecuta de nuevo

### No se generan screenshots

**Problema:** Carpeta no existe

**Solución:**
```bash
mkdir evidence\screenshots
```

### Videos no se reproducen

**Problema:** Formato WebM no compatible

**Solución:**
```bash
# Convertir a MP4 con FFmpeg
ffmpeg -i video.webm video.mp4
```

---

## ✅ Checklist de Entrega

Antes de entregar, verifica:

- [ ] ✅ Tests ejecutados sin errores
- [ ] 📸 Screenshots generados (mínimo 3):
  - [ ] checkout-success.png
  - [ ] checkout-error.png
  - [ ] out-of-stock.png
- [ ] 📹 Videos generados (2):
  - [ ] Flujo exitoso
  - [ ] Casos inválidos
- [ ] 📊 Reporte HTML generado
- [ ] 📄 Screenshots insertados en documento Word
- [ ] 🎥 Videos listos para presentación

---

## 📞 Resumen de Comandos

```bash
# Ejecutar todo (recomendado)
.\ejecutar-evidencias.bat

# Ejecutar manualmente
npm run test:evidence

# Ver con interfaz visual
npm run test:evidence:headed

# Ver reporte
npm run playwright:report

# Limpiar y volver a ejecutar
rmdir /s /q test-results
npm run test:evidence
```

---

## 🎓 Estructura del Informe Sugerida

### 1. Introducción
- Objetivo de las pruebas E2E
- Herramienta utilizada (Playwright)
- Alcance de las pruebas

### 2. Metodología
- Configuración de Playwright
- Casos de prueba diseñados
- Criterios de aceptación

### 3. Resultados
- **3.1 Flujo Exitoso**
  - Descripción del flujo
  - Screenshots paso a paso
  - Resultado: ✅ Exitoso
  
- **3.2 Casos Inválidos**
  - Validación de formularios
  - Manejo de stock
  - Carrito vacío
  - Screenshots de errores
  - Resultado: ✅ Exitoso

### 4. Evidencias
- Tabla resumen de pruebas
- Links a videos (si es digital)
- Screenshots completos en anexo

### 5. Conclusiones
- Cobertura de pruebas
- Calidad del sistema
- Recomendaciones

---

**Tiempo total estimado:** 10-15 minutos  
**Dificultad:** Fácil  
**Requisitos:** Aplicación corriendo

¡Éxito con tu Tarea 7! 🎓
