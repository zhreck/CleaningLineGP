# ⚡ EJECUTAR EVIDENCIAS AHORA
## Tarea 7 - 3 Pasos Simples

---

## 🚀 PASO 1: Verificar Aplicación

### Abrir 2 Terminales:

**Terminal 1 - Backend:**
```bash
cd app/api
npm run start
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```

### Verificar en Navegador:
- ✅ http://localhost:3000 (Frontend)
- ✅ http://localhost:3001 (Backend)

---

## 🎬 PASO 2: Ejecutar Tests

### Abrir Terminal 3:

```bash
cd web
.\ejecutar-evidencias.bat
```

**O manualmente:**
```bash
cd web
npm run test:evidence
```

### Esperar 3-5 minutos ⏱️

---

## 📸 PASO 3: Ver Resultados

### Screenshots:
```
web/evidence/screenshots/
├── checkout-success.png    ✅ Compra exitosa
├── checkout-error.png      ❌ Error validación
└── out-of-stock.png        ❌ Sin stock
```

### Videos:
```
web/test-results/
├── checkout-flow-chromium/video.webm
└── invalid-cases-chromium/video.webm
```

### Reporte HTML:
```bash
npm run playwright:report
```

---

## ✅ LISTO!

Ahora tienes:
- 📹 2 videos de evidencia
- 📸 11+ screenshots
- 📊 Reporte HTML completo

**Para tu informe:**
1. Copia screenshots de `evidence/screenshots/`
2. Inserta en Word con pie de foto
3. Agrega videos a PowerPoint
4. Usa `TAREA-7-COMPLETA.md` como referencia

---

## ❌ ¿Problemas?

### Error: "Application not running"
```bash
# Asegúrate que ambos estén corriendo:
# Terminal 1: cd app/api && npm run start
# Terminal 2: cd web && npm run dev
```

### Error: "Playwright not installed"
```bash
cd web
npm install --save-dev @playwright/test
npx playwright install chromium
```

---

## 📞 Comandos Rápidos

```bash
# Ejecutar todo
cd web && .\ejecutar-evidencias.bat

# Ver reporte
cd web && npm run playwright:report

# Limpiar y volver a ejecutar
cd web
rmdir /s /q test-results
npm run test:evidence
```

---

**Tiempo total:** 5-10 minutos  
**Dificultad:** ⭐ Muy fácil

¡Éxito! 🎓
