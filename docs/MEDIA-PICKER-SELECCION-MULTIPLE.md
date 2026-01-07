# Media Picker - Selección Múltiple

## 📋 COMPORTAMIENTO ACTUAL (CORRECTO)

El MediaPicker ya está implementado correctamente para selección múltiple. Aquí está cómo funciona:

### Flujo Actual

```
1. Usuario tiene 2 imágenes seleccionadas: [img1, img2]
   ↓
2. Usuario abre MediaPicker
   ↓
3. MediaPicker muestra img1 e img2 como seleccionadas (initialSelection)
   ↓
4. Usuario puede:
   - Agregar img3 → Selección: [img1, img2, img3]
   - Quitar img1 → Selección: [img2]
   - Agregar img3 y img4 → Selección: [img1, img2, img3, img4]
   ↓
5. Usuario hace clic en "Select"
   ↓
6. handleImagesSelected recibe el array completo
   ↓
7. FormData se actualiza con el array completo
```

### Código Actual

**ProductForm.tsx:**
```typescript
const handleImagesSelected = (urls: string[]) => {
    setFormData({ ...formData, imageUrl: urls });
    setIsMediaPickerOpen(false);
};

<MediaPicker
    open={isMediaPickerOpen}
    multiple={true}
    initialSelection={formData.imageUrl}  // ← Pasa imágenes actuales
    onSelect={handleImagesSelected}
    onClose={() => setIsMediaPickerOpen(false)}
/>
```

**MediaPicker.tsx:**
```typescript
useEffect(() => {
    if (open) {
        loadImages();
        setSelectedUrls(initialSelection);  // ← Carga selección inicial
    }
}, [open, loadImages, initialSelection]);

const handleToggleSelect = useCallback((url: string) => {
    setSelectedUrls((prev) => {
        if (multiple) {
            if (prev.includes(url)) {
                return prev.filter((u) => u !== url);  // ← Quitar
            } else {
                return [...prev, url];  // ← Agregar
            }
        }
        // ...
    });
}, [multiple]);
```

## ✅ CARACTERÍSTICAS ACTUALES

- ✅ Selección múltiple habilitada (`multiple={true}`)
- ✅ Imágenes previas se muestran como seleccionadas (`initialSelection`)
- ✅ Usuario puede agregar más imágenes
- ✅ Usuario puede quitar imágenes
- ✅ Toggle funciona correctamente (click para agregar/quitar)
- ✅ Array completo se pasa al confirmar

## 🎯 EJEMPLO DE USO

### Escenario 1: Agregar Imágenes
```
Estado inicial: [img1.jpg, img2.jpg]
  ↓
Usuario abre MediaPicker
  ↓
Ve img1 y img2 con checkmark ✓
  ↓
Click en img3 → Ahora: [img1, img2, img3] ✓
  ↓
Click en img4 → Ahora: [img1, img2, img3, img4] ✓
  ↓
Click "Select"
  ↓
Estado final: [img1.jpg, img2.jpg, img3.jpg, img4.jpg]
```

### Escenario 2: Quitar Imágenes
```
Estado inicial: [img1.jpg, img2.jpg, img3.jpg]
  ↓
Usuario abre MediaPicker
  ↓
Ve img1, img2, img3 con checkmark ✓
  ↓
Click en img2 → Ahora: [img1, img3] (img2 sin ✓)
  ↓
Click "Select"
  ↓
Estado final: [img1.jpg, img3.jpg]
```

### Escenario 3: Reemplazar Todas
```
Estado inicial: [img1.jpg, img2.jpg]
  ↓
Usuario abre MediaPicker
  ↓
Ve img1, img2 con checkmark ✓
  ↓
Click en img1 → Quitar (sin ✓)
Click en img2 → Quitar (sin ✓)
Click en img3 → Agregar ✓
Click en img4 → Agregar ✓
  ↓
Click "Select"
  ↓
Estado final: [img3.jpg, img4.jpg]
```

## 🔍 VERIFICACIÓN DEL COMPORTAMIENTO

Para verificar que funciona correctamente:

1. **Crear producto con 2 imágenes:**
   - Abrir MediaPicker
   - Seleccionar img1 y img2
   - Click "Select"
   - Verificar que se muestran 2 thumbnails

2. **Agregar más imágenes:**
   - Click en botón "Seleccionar Imagen"
   - MediaPicker se abre con img1 e img2 ya seleccionadas (✓)
   - Seleccionar img3
   - Click "Select"
   - Verificar que ahora hay 3 thumbnails

3. **Quitar una imagen:**
   - Click en botón "Seleccionar Imagen"
   - MediaPicker se abre con img1, img2, img3 seleccionadas (✓)
   - Click en img2 para deseleccionar
   - Click "Select"
   - Verificar que ahora hay 2 thumbnails (img1 e img3)

## 📝 NOTAS IMPORTANTES

### ¿Por qué `handleImagesSelected` reemplaza el array?

Esto es **correcto** porque:
- El MediaPicker ya maneja la selección múltiple internamente
- `initialSelection` pasa las imágenes actuales al abrir
- El usuario puede agregar/quitar dentro del picker
- Al confirmar, el picker retorna el array completo (no solo las nuevas)
- El formulario actualiza con el array completo

### ¿Qué pasa si quiero solo agregar nuevas imágenes?

Si quisieras un comportamiento donde solo se agreguen las nuevas (sin poder quitar), necesitarías:

```typescript
const handleImagesSelected = (urls: string[]) => {
    // Opción 1: Agregar solo nuevas (mantener todas las anteriores)
    const newImages = urls.filter(url => !formData.imageUrl.includes(url));
    setFormData({ 
        ...formData, 
        imageUrl: [...formData.imageUrl, ...newImages] 
    });
    
    // Opción 2: Reemplazar completo (actual - correcto)
    setFormData({ ...formData, imageUrl: urls });
    
    setIsMediaPickerOpen(false);
};
```

**Pero esto NO es recomendado** porque:
- El usuario no podría quitar imágenes desde el picker
- Sería confuso (el picker muestra selección pero no se puede deseleccionar)
- El comportamiento actual es más intuitivo

## ✅ CONCLUSIÓN

El comportamiento actual es **correcto y completo**:

- ✅ Permite seleccionar múltiples imágenes
- ✅ Mantiene selección previa al abrir
- ✅ Permite agregar más imágenes
- ✅ Permite quitar imágenes
- ✅ Muestra visualmente qué está seleccionado
- ✅ Actualiza correctamente el formulario

**No se necesitan cambios adicionales.**

---

**Estado**: ✅ FUNCIONANDO CORRECTAMENTE
**Comportamiento**: Selección múltiple con toggle (agregar/quitar)
**Archivos**: 
- `web/components/admin/ProductForm.tsx` - Maneja array de imágenes
- `web/components/admin/media/MediaPicker.tsx` - Selección múltiple con initialSelection
