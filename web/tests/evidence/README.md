# Tarea 7 - Pruebas E2E con Playwright
## Sumativa 3 - Shopping Ecommerce

---

## 📋 Descripción

Suite de pruebas End-to-End (E2E) con Playwright para generar evidencias académicas de:
- ✅ Flujo de checkout exitoso
- ❌ Casos de error y validaciones

---

## 🎯 Objetivos

1. **Documentar flujo exitoso** de compra completa
2. **Documentar manejo de errores** en validaciones
3. **Generar evidencias visuales** (videos + screenshots)
4. **Crear material** para informe académico

---

## 📁 Estructura de Archivos

```
web/
├── playwright.config.ts          # Configuración de Playwright
├── tests/
│   └── evidence/
│       ├── README.md             # Este archivo
│       ├── checkout-flow.spec.ts # Test de flujo exitoso
│       └── invalid-cases.spec.ts # Tests de casos inválidos
├── evidence/
│   ├── screenshots/              # Screenshots generados
│   └── videos/                   # Videos generados
├── test-results/                 # Resultados de tests
└── playwright-report/            # Reporte HTML
```

---

## 🚀 Instalación

### Prerequisitos

- Node.js instalado
- Aplicación web corriendo en `http://localhost:3000`
- Backend API corriendo en `http://localhost:3001`

### Instalar Dependencias

```bash
cd web
npm install
```

### Instalar Navegadores de Playwright

```bash
npx playwright install chromium
```

---

## ▶️ Ejecución de Tests

### Opción 1: Ejecutar Todos los Tests de Evidencia

```bash
npm run test:evidence
```

### Opción 2: Ejecutar con Interfaz Visual (Recomendado)

```bash
npm run test:evidence:headed
```

### Opción 3: Ejecutar Test Específico

```bash
# Solo flujo exitoso
npx playwright test checkout-flow.spec.ts

# Solo casos inválidos
npx playwright test invalid-cases.spec.ts
```

### Opción 4: Modo Debug

```bash
npx playwright test --debug
```

---

## 📊 Evidencias Generadas

### 1. Videos

**Ubicación:** `web/test-results/`

Cada test genera un video completo de la ejecución:
- `checkout-flow-chromium/video.webm` - Flujo exitoso
- `invalid-cases-chromium/video.webm` - Casos de error

**Formato:** WebM (compatible con navegadores y editores de video)

### 2. Screenshots

**Ubicación:** `web/evidence/screenshots/`

#### Flujo Exitoso:
- `01-products-catalog.png` - Catálogo de productos
- `02-product-detail.png` - Detalle del producto
- `03-added-to-cart.png` - Producto agregado al carrito
- `04-cart-view.png` - Vista del carrito
- `05-checkout-form.png` - Formulario de checkout
- `06-form-filled.png` - Formulario completado
- `checkout-success.png` - ✅ Confirmación de compra

#### Casos Inválidos:
- `07-empty-checkout-form.png` - Formulario vacío
- `checkout-error.png` - ❌ Errores de validación
- `08-products-catalog.png` - Catálogo para producto sin stock
- `09-product-detail-no-stock.png` - Producto sin stock
- `out-of-stock.png` - ❌ Error de stock
- `10-empty-cart.png` - Carrito vacío
- `11-empty-cart-no-checkout.png` - Sin opción de checkout

### 3. Traces

**Ubicación:** `web/test-results/`

Archivos `.zip` con trazas completas de ejecución.

**Ver trace:**
```bash
npx playwright show-trace test-results/[nombre-del-test]/trace.zip
```

### 4. Reporte HTML

**Ubicación:** `web/playwright-report/`

**Ver reporte:**
```bash
npm run playwright:report
```

---

## 📝 Tests Implementados

### Test 1: Flujo de Checkout Exitoso

**Archivo:** `checkout-flow.spec.ts`

**Pasos:**
1. ✅ Navegar a `/products`
2. ✅ Ver detalle del primer producto
3. ✅ Agregar producto al carrito
4. ✅ Ir al carrito
5. ✅ Proceder al checkout
6. ✅ Completar datos válidos:
   - Nombre: Juan Pérez
   - Email: juan.perez@example.com
   - Teléfono: +56912345678
   - Dirección: Av. Libertador Bernardo O'Higgins 1234
   - Ciudad: Santiago
   - Región: Región Metropolitana
   - Código Postal: 8320000
7. ✅ Finalizar compra
8. ✅ Verificar confirmación

**Duración estimada:** ~60 segundos

---

### Test 2: Casos Inválidos

**Archivo:** `invalid-cases.spec.ts`

#### Caso 2.1: Checkout sin Datos
**Pasos:**
1. ❌ Agregar producto al carrito
2. ❌ Ir al checkout
3. ❌ Intentar enviar formulario vacío
4. ✅ Verificar mensajes de error

#### Caso 2.2: Producto Sin Stock
**Pasos:**
1. ❌ Buscar producto sin stock
2. ❌ Intentar agregar al carrito
3. ✅ Verificar botón deshabilitado o mensaje de error

#### Caso 2.3: Carrito Vacío
**Pasos:**
1. ❌ Navegar al carrito vacío
2. ✅ Verificar mensaje de carrito vacío
3. ✅ Verificar que no hay opción de checkout

**Duración estimada:** ~90 segundos

---

## 🎬 Configuración de Grabación

### Video

```typescript
video: 'on'  // Siempre grabar
```

- **Formato:** WebM
- **Calidad:** Alta
- **FPS:** 25
- **Resolución:** 1280x720

### Screenshots

```typescript
screenshot: 'on'  // Siempre capturar
```

- **Formato:** PNG
- **Calidad:** Alta
- **Modo:** Full page (página completa)

### Trace

```typescript
trace: 'on'  // Siempre activado
```

- Incluye: Network, Console, DOM snapshots
- Útil para debugging

---

## 🔧 Configuración Avanzada

### Cambiar Velocidad de Ejecución

En `playwright.config.ts`:

```typescript
launchOptions: {
  slowMo: 500, // Milisegundos de delay entre acciones
}
```

- `0` = Velocidad normal (rápido)
- `500` = Medio (recomendado para evidencias)
- `1000` = Lento (muy visual)

### Cambiar Resolución

```typescript
viewport: { width: 1280, height: 720 }
```

Opciones comunes:
- `1920x1080` - Full HD
- `1280x720` - HD (recomendado)
- `1024x768` - Estándar

---

## 📸 Uso de Screenshots en Informe

### Formato Recomendado para Word

1. **Insertar imagen:**
   - Insertar → Imagen → Desde archivo
   - Seleccionar screenshot de `evidence/screenshots/`

2. **Agregar pie de foto:**
   ```
   Figura X: [Descripción del screenshot]
   Fuente: Elaboración propia mediante Playwright
   ```

3. **Tamaño recomendado:**
   - Ancho: 15 cm
   - Mantener proporción

### Ejemplo de Descripción

```
Figura 1: Catálogo de productos del sistema Shopping Ecommerce
Fuente: Elaboración propia mediante pruebas E2E con Playwright

La imagen muestra el catálogo completo de productos disponibles,
incluyendo nombre, precio, y botón de agregar al carrito.
```

---

## 🎥 Uso de Videos en Presentación

### Convertir WebM a MP4 (Opcional)

```bash
# Usando FFmpeg
ffmpeg -i video.webm -c:v libx264 -c:a aac video.mp4
```

### Insertar en PowerPoint

1. Insertar → Video → Video en Mi PC
2. Seleccionar archivo `.webm` o `.mp4`
3. Configurar reproducción automática

---

## 🐛 Solución de Problemas

### Error: "Application not running"

**Solución:**
```bash
# Terminal 1: Iniciar backend
cd app/api
npm run start

# Terminal 2: Iniciar frontend
cd web
npm run dev

# Terminal 3: Ejecutar tests
cd web
npm run test:evidence
```

### Error: "Timeout waiting for element"

**Causa:** Selectores no coinciden con la aplicación real

**Solución:**
1. Inspeccionar elemento en el navegador
2. Actualizar selectores en el test
3. Agregar `await page.waitForSelector()`

### Videos no se generan

**Solución:**
```bash
# Reinstalar Playwright
npm install --save-dev @playwright/test
npx playwright install chromium
```

### Screenshots borrosos

**Solución:**
En el test, usar:
```typescript
await page.screenshot({ 
  path: 'screenshot.png',
  fullPage: true,
  scale: 'device' // Usar escala del dispositivo
});
```

---

## 📊 Métricas de Cobertura

### Flujos Cubiertos

- ✅ Navegación de productos
- ✅ Detalle de producto
- ✅ Agregar al carrito
- ✅ Ver carrito
- ✅ Checkout invitado
- ✅ Validación de formularios
- ✅ Manejo de errores
- ✅ Productos sin stock
- ✅ Carrito vacío

### Validaciones Implementadas

- ✅ URLs correctas
- ✅ Elementos visibles
- ✅ Botones habilitados/deshabilitados
- ✅ Mensajes de error
- ✅ Mensajes de éxito
- ✅ Navegación entre páginas

---

## 📚 Referencias

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Video Recording](https://playwright.dev/docs/videos)
- [Screenshots](https://playwright.dev/docs/screenshots)

---

## ✅ Checklist de Entrega

- [ ] Tests ejecutados exitosamente
- [ ] Videos generados en `test-results/`
- [ ] Screenshots generados en `evidence/screenshots/`
- [ ] Screenshot `checkout-success.png` presente
- [ ] Screenshot `checkout-error.png` presente
- [ ] Screenshot `out-of-stock.png` presente
- [ ] Reporte HTML generado
- [ ] Videos convertidos a MP4 (opcional)
- [ ] Screenshots insertados en documento Word
- [ ] Descripciones agregadas a cada imagen

---

**Tarea 7:** ✅ LISTA PARA EJECUTAR  
**Evidencias:** 📹 Videos + 📸 Screenshots  
**Formato:** ✅ Listo para informe académico

¡Éxito con tu entrega! 🎓
