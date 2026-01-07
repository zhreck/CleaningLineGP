# Corrección: Subida Múltiple de Imágenes - Auto-selección

## 📋 PROBLEMA IDENTIFICADO

Cuando el usuario subía múltiples imágenes desde el MediaPicker:
- ✅ Las imágenes se subían correctamente (todas)
- ✅ Aparecían en la galería
- ❌ NO se auto-seleccionaban
- ❌ El usuario tenía que hacer clic manualmente en cada una para seleccionarlas

## ✅ SOLUCIÓN IMPLEMENTADA

Se modificó el MediaPicker para **auto-seleccionar** las imágenes recién subidas.

### Cambio en `web/components/admin/media/MediaPicker.tsx`

**Antes:**
```typescript
const handleImageUploaded = useCallback((url: string) => {
    setImages((prev) => [url, ...prev]);
    setActiveTab('library');
}, []);
```

**Después:**
```typescript
const handleImageUploaded = useCallback((url: string) => {
    setImages((prev) => [url, ...prev]);
    // Auto-select newly uploaded image
    setSelectedUrls((prev) => [...prev, url]);  // ← NUEVO
    setActiveTab('library');
}, []);
```

## 🎯 FLUJO COMPLETO CORREGIDO

### Escenario: Usuario con 2 imágenes quiere agregar 3 más

```
1. Estado inicial del producto: [img1.jpg, img2.jpg]
   ↓
2. Usuario abre MediaPicker
   ↓
3. MediaPicker carga con initialSelection: [img1.jpg, img2.jpg]
   → img1 y img2 aparecen con checkmark ✓
   ↓
4. Usuario va a tab "Upload File"
   ↓
5. Usuario selecciona 3 archivos desde su PC (Ctrl+Click)
   → file1.jpg, file2.jpg, file3.jpg
   ↓
6. Usuario ve 3 previews en grid
   ↓
7. Usuario hace clic en "Upload 3 Images"
   ↓
8. MediaUpload.handleUpload():
   - Llama uploadImages([file1, file2, file3])
   - Backend sube las 3 imágenes en paralelo
   - Retorna { urls: [url1, url2, url3] }
   - Llama onUploaded(url1)
   - Llama onUploaded(url2)
   - Llama onUploaded(url3)
   ↓
9. MediaPicker.handleImageUploaded() (3 veces):
   - Primera llamada:
     * Agrega url1 a galería
     * Agrega url1 a selectedUrls → [img1, img2, url1] ✓
   - Segunda llamada:
     * Agrega url2 a galería
     * Agrega url2 a selectedUrls → [img1, img2, url1, url2] ✓
   - Tercera llamada:
     * Agrega url3 a galería
     * Agrega url3 a selectedUrls → [img1, img2, url1, url2, url3] ✓
   - Cambia a tab "Media Library"
   ↓
10. Usuario ve galería con 5 imágenes seleccionadas ✓
    ↓
11. Usuario hace clic en "Select (5)"
    ↓
12. ProductForm.handleImagesSelected([img1, img2, url1, url2, url3])
    - Actualiza formData.imageUrl con las 5 URLs
    ↓
13. Estado final del producto: [img1.jpg, img2.jpg, url1.jpg, url2.jpg, url3.jpg]
```

## ✅ CARACTERÍSTICAS CORREGIDAS

### Antes de la Corrección
- ✅ Subida múltiple funcionaba
- ✅ Imágenes aparecían en galería
- ❌ Usuario tenía que seleccionar manualmente cada imagen nueva
- ❌ Flujo lento y tedioso

### Después de la Corrección
- ✅ Subida múltiple funciona
- ✅ Imágenes aparecen en galería
- ✅ **Imágenes se auto-seleccionan automáticamente**
- ✅ **Flujo rápido y fluido**
- ✅ **Mantiene selección previa**
- ✅ **Combina viejas + nuevas**

## 🔍 VERIFICACIÓN DEL FLUJO

### Test 1: Agregar imágenes a producto nuevo
```
1. Crear nuevo producto
2. Click "Seleccionar Imagen"
3. Tab "Upload File"
4. Seleccionar 3 imágenes (Ctrl+Click)
5. Click "Upload 3 Images"
6. Verificar:
   ✓ Tab cambia a "Media Library"
   ✓ 3 imágenes aparecen con checkmark
   ✓ Contador muestra "Select (3)"
7. Click "Select (3)"
8. Verificar:
   ✓ 3 thumbnails en formulario
```

### Test 2: Agregar más imágenes a producto existente
```
1. Editar producto con 2 imágenes
2. Click "Seleccionar Imagen"
3. Verificar:
   ✓ 2 imágenes ya seleccionadas
4. Tab "Upload File"
5. Seleccionar 2 imágenes nuevas
6. Click "Upload 2 Images"
7. Verificar:
   ✓ Tab cambia a "Media Library"
   ✓ 4 imágenes con checkmark (2 viejas + 2 nuevas)
   ✓ Contador muestra "Select (4)"
8. Click "Select (4)"
9. Verificar:
   ✓ 4 thumbnails en formulario
```

### Test 3: Subir y deseleccionar
```
1. Producto con 1 imagen
2. Click "Seleccionar Imagen"
3. Tab "Upload File"
4. Subir 2 imágenes nuevas
5. Verificar:
   ✓ 3 imágenes seleccionadas
6. Click en una de las nuevas para deseleccionar
7. Verificar:
   ✓ Contador muestra "Select (2)"
8. Click "Select (2)"
9. Verificar:
   ✓ 2 thumbnails en formulario
```

## 📊 COMPONENTES INVOLUCRADOS

### 1. MediaUpload.tsx
```typescript
// Sube múltiples archivos
const response = await uploadImages(selectedFiles);

// Notifica cada URL individualmente
response.urls.forEach((url) => {
    onUploaded(url);  // ← Llama al callback por cada imagen
});
```

### 2. MediaPicker.tsx
```typescript
// Recibe cada URL y la auto-selecciona
const handleImageUploaded = useCallback((url: string) => {
    setImages((prev) => [url, ...prev]);           // ← Agrega a galería
    setSelectedUrls((prev) => [...prev, url]);     // ← Auto-selecciona
    setActiveTab('library');                        // ← Cambia a galería
}, []);
```

### 3. ProductForm.tsx
```typescript
// Recibe array completo (viejas + nuevas)
const handleImagesSelected = (urls: string[]) => {
    setFormData({ ...formData, imageUrl: urls });  // ← Actualiza con todas
    setIsMediaPickerOpen(false);
};
```

## 🎯 COMPORTAMIENTO FINAL

### ✅ Lo que funciona ahora:
1. ✅ Seleccionar múltiples archivos desde el sistema (Ctrl+Click)
2. ✅ Subir todas las imágenes en paralelo
3. ✅ Auto-seleccionar todas las imágenes subidas
4. ✅ Mantener selección previa (no reemplazar)
5. ✅ Combinar viejas + nuevas en un solo array
6. ✅ Mostrar todas en el formulario
7. ✅ Permitir deseleccionar si el usuario quiere

### ❌ Lo que NO hace (correcto):
- ❌ No reemplaza imágenes anteriores automáticamente
- ❌ No requiere selección manual después de subir
- ❌ No pierde la selección previa

## 📝 NOTAS TÉCNICAS

### ¿Por qué auto-seleccionar?

**Razón 1: UX mejorada**
- El usuario sube imágenes porque quiere usarlas
- Auto-seleccionar ahorra clicks
- Flujo más rápido

**Razón 2: Consistencia**
- Si el usuario sube 5 imágenes, espera que se agreguen
- No tiene sentido subirlas y luego tener que seleccionarlas manualmente

**Razón 3: Mantiene control**
- El usuario aún puede deseleccionar si quiere
- Puede ver todas las seleccionadas antes de confirmar
- Tiene control total

### ¿Por qué no reemplazar el array?

El `handleImagesSelected` recibe el array completo porque:
- El MediaPicker maneja la selección internamente
- `initialSelection` pasa las imágenes actuales al abrir
- Las nuevas se agregan a la selección existente
- Al confirmar, retorna el estado final completo
- Esto permite tanto agregar como quitar

## ✅ RESULTADO FINAL

**Flujo completo:**
```
Usuario con 2 imágenes → Abre picker → Sube 3 nuevas → 
Auto-seleccionadas → Click "Select (5)" → 5 imágenes en producto
```

**Sin clicks extra, sin confusión, flujo natural.**

---

**Estado**: ✅ CORREGIDO
**Archivo modificado**: `web/components/admin/media/MediaPicker.tsx`
**Cambio**: Auto-selección de imágenes recién subidas
**Líneas agregadas**: 1 (`setSelectedUrls((prev) => [...prev, url]);`)
