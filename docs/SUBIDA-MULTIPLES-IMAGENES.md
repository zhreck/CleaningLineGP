# Subida de Múltiples Imágenes en Media Picker

## 📋 RESUMEN

Se ha implementado la funcionalidad de subida de múltiples imágenes en el Media Picker del panel admin, permitiendo seleccionar y subir hasta 10 imágenes simultáneamente.

## ✅ CAMBIOS REALIZADOS

### 1. Backend (`app/api/src/media/media.controller.ts`)

**Agregado nuevo endpoint para múltiples archivos:**

```typescript
@Post('upload-multiple')
@UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
): Promise<{ urls: string[] }> {
    // Valida y sube múltiples archivos
    // Retorna array de URLs
}
```

**Características:**
- ✅ Acepta hasta 10 archivos simultáneamente
- ✅ Usa `FilesInterceptor('files', 10)` de NestJS
- ✅ Valida tamaño de cada archivo (5MB max)
- ✅ Sube todos los archivos en paralelo con `Promise.all()`
- ✅ Retorna array de URLs: `{ urls: string[] }`
- ✅ Manejo de errores por archivo

### 2. Frontend API (`web/lib/mediaApi.ts`)

**Nueva función `uploadImages()`:**

```typescript
export async function uploadImages(files: File[]): Promise<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file); // Nota: 'files' (plural)
    });
    
    const response = await fetch(`${API_BASE_URL}/media/upload-multiple`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
    });
    
    return await response.json(); // { urls: string[] }
}
```

**Características:**
- ✅ Acepta array de archivos
- ✅ Usa `formData.append('files', file)` para cada archivo
- ✅ Llama al endpoint `/media/upload-multiple`
- ✅ Retorna array de URLs subidas
- ✅ Manejo de errores con mensajes claros

### 3. Componente MediaUpload (`web/components/admin/media/MediaUpload.tsx`)

**Cambios principales:**

#### Input con `multiple`
```typescript
<input
    type="file"
    multiple  // ← Permite selección múltiple
    accept="image/jpeg,image/png,image/webp,image/gif"
    onChange={handleFileSelect}
/>
```

#### Estado actualizado
```typescript
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);  // Array de archivos
const [previews, setPreviews] = useState<string[]>([]);          // Array de previews
```

#### Validación de múltiples archivos
```typescript
const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Valida cada archivo
    for (const file of files) {
        if (!validTypes.includes(file.type)) {
            errors.push(`${file.name}: Invalid file type`);
            continue;
        }
        if (file.size > maxSize) {
            errors.push(`${file.name}: Exceeds 5MB limit`);
            continue;
        }
        validFiles.push(file);
    }
    
    // Genera previews para todos los archivos válidos
    Promise.all(previewPromises).then((previewUrls) => {
        setPreviews(previewUrls);
    });
};
```

#### Grid de previews
```typescript
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
    {previews.map((preview, index) => (
        <div key={index} className="relative group">
            <img src={preview} />
            <button onClick={() => handleRemoveFile(index)}>
                Remove
            </button>
            <p>{selectedFiles[index]?.name}</p>
        </div>
    ))}
</div>
```

#### Subida de múltiples archivos
```typescript
const handleUpload = async () => {
    const response = await uploadImages(selectedFiles);
    
    // Notifica cada URL subida
    response.urls.forEach((url) => {
        onUploaded(url);
    });
};
```

## 🎯 FLUJO DE USUARIO

### 1. Selección de Imágenes
```
Usuario hace clic en "Click to select images (multiple)"
  ↓
Explorador de archivos se abre con selección múltiple habilitada
  ↓
Usuario selecciona 5 imágenes (Ctrl+Click o Shift+Click)
  ↓
Validación automática de tipo y tamaño
  ↓
Grid de previews muestra las 5 imágenes
```

### 2. Gestión de Selección
```
Usuario ve grid con 5 imágenes
  ↓
Hover sobre imagen → Botón "X" aparece
  ↓
Click en "X" → Imagen removida del grid
  ↓
Contador actualizado: "4 files selected"
```

### 3. Subida
```
Usuario hace clic en "Upload 4 Images"
  ↓
Botón muestra "Uploading 4 files..."
  ↓
Backend procesa las 4 imágenes en paralelo
  ↓
Cada URL se agrega a la galería
  ↓
Tab cambia automáticamente a "Media Library"
  ↓
Usuario ve las 4 imágenes recién subidas
```

## 📊 CARACTERÍSTICAS

### Validación
- ✅ Tipo de archivo: JPEG, PNG, WebP, GIF
- ✅ Tamaño máximo: 5MB por archivo
- ✅ Cantidad máxima: 10 archivos
- ✅ Mensajes de error específicos por archivo

### UI/UX
- ✅ Grid responsivo de previews (2/3/4 columnas)
- ✅ Botón "X" para remover archivos individuales
- ✅ Botón "Clear All" para limpiar selección
- ✅ Contador de archivos seleccionados
- ✅ Nombres de archivo truncados
- ✅ Loading state durante subida
- ✅ Feedback visual con hover effects

### Performance
- ✅ Subida paralela de archivos (Promise.all)
- ✅ Previews generadas asíncronamente
- ✅ Validación antes de subir
- ✅ Limpieza automática después de subir

## 🔧 CONFIGURACIÓN

### Límites Ajustables

**Backend (media.controller.ts):**
```typescript
@UseInterceptors(FilesInterceptor('files', 10)) // ← Cambiar límite de archivos
```

**Tamaño máximo por archivo:**
```typescript
const maxSize = 5 * 1024 * 1024; // ← Cambiar a 10MB: 10 * 1024 * 1024
```

**Frontend (MediaUpload.tsx):**
```typescript
const maxSize = 5 * 1024 * 1024; // ← Debe coincidir con backend
```

## 📝 ENDPOINTS

### Endpoint Original (mantiene compatibilidad)
```
POST /media/upload
Content-Type: multipart/form-data

FormData:
  file: <single-file>

Response:
  { url: "https://..." }
```

### Nuevo Endpoint (múltiples archivos)
```
POST /media/upload-multiple
Content-Type: multipart/form-data

FormData:
  files: <file-1>
  files: <file-2>
  files: <file-3>
  ...

Response:
  { urls: ["https://...", "https://...", "https://..."] }
```

## ✅ VERIFICACIÓN

- ✅ Input tiene atributo `multiple`
- ✅ Backend acepta `FilesInterceptor('files')`
- ✅ FormData usa `append('files', file)` (plural)
- ✅ Grid de previews responsivo
- ✅ Botones de remover individuales
- ✅ Contador de archivos
- ✅ Validación por archivo
- ✅ Subida paralela
- ✅ Sin errores de TypeScript
- ✅ Sin errores de compilación

## 🎯 RESULTADO FINAL

**Antes:**
- ❌ Solo 1 imagen a la vez
- ❌ Proceso lento para múltiples imágenes
- ❌ Muchos clicks necesarios

**Ahora:**
- ✅ Hasta 10 imágenes simultáneamente
- ✅ Subida paralela (más rápido)
- ✅ Grid de previews
- ✅ Gestión individual de archivos
- ✅ Mejor experiencia de usuario

---

**Estado**: ✅ COMPLETADO
**Archivos modificados**: 3
- `app/api/src/media/media.controller.ts` - Nuevo endpoint
- `web/lib/mediaApi.ts` - Nueva función uploadImages()
- `web/components/admin/media/MediaUpload.tsx` - Soporte múltiple

**Límites actuales**:
- Máximo 10 archivos por subida
- Máximo 5MB por archivo
- Tipos: JPEG, PNG, WebP, GIF
