# CRUD de Productos - Documentación Completa

## 📋 Resumen

Sistema completo de gestión de productos con paginación, filtros y formulario modal integrado con el backend real.

---

## 🔌 Endpoints Necesarios

### Backend (NestJS)

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/products` | GET | Listar todos los productos | Público |
| `/products/:id` | GET | Obtener un producto por ID | Público |
| `/products` | POST | Crear nuevo producto | Admin |
| `/products/:id` | PUT | Actualizar producto | Admin |
| `/products/:id` | DELETE | Eliminar producto | Admin |
| `/categories` | GET | Listar categorías | Público |

### Request/Response

**POST /products**
```json
Request:
{
  "name": "Cloro Líquido 1L",
  "description": "Cloro concentrado...",
  "price": 2490,
  "stock": 150,
  "imageUrl": "https://placehold.co/600x400?text=Cloro",
  "categoryId": 1,
  "isFeatured": true,
  "isOnSale": true,
  "discountPercent": 10
}

Response:
{
  "id": 41,
  "name": "Cloro Líquido 1L",
  "slug": "cloro-liquido-1l",
  "description": "Cloro concentrado...",
  "price": 2490,
  "stock": 150,
  "imageUrl": "https://placehold.co/600x400?text=Cloro",
  "isFeatured": true,
  "isOnSale": true,
  "discountPercent": 10,
  "category": {
    "id": 1,
    "name": "Cloro y desinfectantes",
    "slug": "cloro-y-desinfectantes"
  }
}
```

**PUT /products/:id**
```json
Request:
{
  "price": 2990,
  "stock": 200
}

Response:
{
  "id": 41,
  "name": "Cloro Líquido 1L",
  "price": 2990,  // Actualizado
  "stock": 200,   // Actualizado
  ...
}
```

**DELETE /products/:id**
```
Response: 204 No Content
```

---

## 🔄 Flujo de Funcionamiento

### 1. Carga Inicial

```
Usuario → Admin Products Page
  ↓
Cargar productos (GET /products)
Cargar categorías (GET /categories)
  ↓
Mostrar primeros 10 productos (página 1)
```

### 2. Filtros

```
Usuario escribe en búsqueda
  ↓
Filtrar productos en cliente
  ↓
Resetear a página 1
  ↓
Mostrar resultados filtrados
```

```
Usuario selecciona categoría
  ↓
Filtrar productos por category.slug
  ↓
Resetear a página 1
  ↓
Mostrar resultados filtrados
```

### 3. Paginación

```
Total productos: 40
Items por página: 10
Total páginas: 4

Página 1: productos 1-10
Página 2: productos 11-20
Página 3: productos 21-30
Página 4: productos 31-40
```

**Cálculo:**
```typescript
const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
```

### 4. Crear Producto

```
Usuario → Click "+ Nuevo Producto"
  ↓
Abrir modal con formulario vacío
  ↓
Usuario llena campos
  ↓
Click "Guardar"
  ↓
Validar campos requeridos
  ↓
POST /products
  ↓
Cerrar modal
  ↓
Mostrar notificación "Producto creado"
  ↓
Recargar lista de productos
```

### 5. Editar Producto

```
Usuario → Click "Editar" en fila
  ↓
Abrir modal con datos del producto
  ↓
Usuario modifica campos
  ↓
Click "Guardar"
  ↓
Validar campos
  ↓
PUT /products/:id
  ↓
Cerrar modal
  ↓
Mostrar notificación "Producto actualizado"
  ↓
Recargar lista de productos
```

### 6. Eliminar Producto

```
Usuario → Click "Eliminar" en fila
  ↓
Mostrar confirmación
  ↓
Usuario confirma
  ↓
DELETE /products/:id
  ↓
Mostrar notificación "Producto eliminado"
  ↓
Recargar lista de productos
```

---

## 🧪 Pruebas Manuales

### Prueba 1: Listar Productos

```bash
# 1. Iniciar sesión como admin
http://localhost:3000/auth/login
Email: admin@test.com
Password: Admin123!

# 2. Ir al panel de productos
http://localhost:3000/admin/products

# 3. Verificar:
✅ Se muestran 10 productos en la primera página
✅ Hay 4 botones de página (1, 2, 3, 4)
✅ Contador muestra "40 productos encontrados"
✅ Cada producto muestra: imagen, nombre, slug, categoría, precio, stock
✅ Badges de destacado (⭐) y oferta (🏷️) visibles
```

### Prueba 2: Paginación

```bash
# 1. Verificar página 1
✅ Botón "1" está resaltado
✅ Botón "Anterior" está deshabilitado
✅ Muestra "Mostrando 1 a 10 de 40 productos"

# 2. Click en botón "2"
✅ Se muestran productos 11-20
✅ Botón "2" está resaltado
✅ Muestra "Mostrando 11 a 20 de 40 productos"
✅ Botón "Anterior" está habilitado

# 3. Click en "Siguiente"
✅ Avanza a página 3
✅ Muestra productos 21-30

# 4. Click en "Anterior"
✅ Retrocede a página 2
```

### Prueba 3: Filtro por Búsqueda

```bash
# 1. Escribir "cloro" en el buscador
✅ Solo muestra productos que contienen "cloro"
✅ Contador actualizado (ej: "10 productos encontrados")
✅ Paginación se ajusta (1 página si hay 10 o menos)
✅ Página actual se resetea a 1

# 2. Escribir "limpiador"
✅ Solo muestra productos con "limpiador"
✅ Contador actualizado

# 3. Limpiar búsqueda
✅ Vuelven a aparecer todos los productos (40)
✅ Paginación vuelve a 4 páginas
```

### Prueba 4: Filtro por Categoría

```bash
# 1. Seleccionar "Cloro y desinfectantes"
✅ Solo muestra productos de esa categoría (10)
✅ Contador: "10 productos encontrados"
✅ Paginación: 1 página
✅ Página actual se resetea a 1

# 2. Seleccionar "Limpieza industrial"
✅ Solo muestra productos de esa categoría (10)

# 3. Seleccionar "Todas las categorías"
✅ Vuelven a aparecer todos los productos (40)
✅ Paginación: 4 páginas
```

### Prueba 5: Filtros Combinados

```bash
# 1. Buscar "limpiador"
# 2. Seleccionar "Limpieza del hogar"
✅ Solo muestra productos que:
   - Contienen "limpiador" en nombre/slug
   - Y pertenecen a "Limpieza del hogar"
✅ Contador actualizado según resultados
```

### Prueba 6: Crear Producto

```bash
# 1. Click en "+ Nuevo Producto"
✅ Se abre modal
✅ Título: "Nuevo Producto"
✅ Todos los campos vacíos

# 2. Llenar campos:
Nombre: Producto de Prueba
Descripción: Descripción de prueba
Precio: 5990
Stock: 100
Categoría: Limpieza del hogar
URL imagen: https://placehold.co/600x400?text=Test
☑ Producto destacado
☑ En oferta
Descuento: 15%

# 3. Click en "Guardar"
✅ Modal se cierra
✅ Notificación verde: "Producto creado correctamente"
✅ Producto aparece en la lista
✅ Lista se recarga automáticamente

# 4. Verificar en backend
curl http://localhost:3001/products
✅ El nuevo producto aparece con ID 41
```

### Prueba 7: Validaciones del Formulario

```bash
# 1. Abrir formulario de crear
# 2. Dejar nombre vacío
# 3. Click en "Guardar"
✅ Error rojo debajo del campo: "El nombre es requerido"
✅ Modal NO se cierra

# 4. Llenar nombre
# 5. Poner precio en 0
# 6. Click en "Guardar"
✅ Error: "El precio debe ser mayor a 0"

# 7. Llenar precio
# 8. No seleccionar categoría
# 9. Click en "Guardar"
✅ Error: "La categoría es requerida"

# 10. Llenar todos los campos requeridos
# 11. Click en "Guardar"
✅ Producto se crea correctamente
```

### Prueba 8: Editar Producto

```bash
# 1. Click en "Editar" en cualquier producto
✅ Se abre modal
✅ Título: "Editar Producto"
✅ Campos pre-llenados con datos del producto

# 2. Modificar campos:
Precio: 6990 (cambiar)
Stock: 50 (cambiar)

# 3. Click en "Guardar"
✅ Modal se cierra
✅ Notificación verde: "Producto actualizado correctamente"
✅ Cambios se reflejan en la tabla
✅ Lista se recarga

# 4. Verificar en backend
curl http://localhost:3001/products/1
✅ Los cambios están guardados
```

### Prueba 9: Eliminar Producto

```bash
# 1. Click en "Eliminar" en cualquier producto
✅ Aparece confirmación:
   "¿Estás seguro de eliminar [nombre]?
    Esta acción no se puede deshacer."

# 2. Click en "Cancelar"
✅ No se elimina nada
✅ Modal se cierra

# 3. Click en "Eliminar" de nuevo
# 4. Click en "Aceptar"
✅ Notificación verde: "Producto eliminado correctamente"
✅ Producto desaparece de la tabla
✅ Lista se recarga

# 5. Verificar en backend
curl http://localhost:3001/products
✅ El producto ya no aparece
```

### Prueba 10: Campo Condicional de Descuento

```bash
# 1. Abrir formulario de crear/editar
# 2. Checkbox "En oferta" está desmarcado
✅ Campo "Descuento (%)" NO es visible

# 3. Marcar checkbox "En oferta"
✅ Campo "Descuento (%)" aparece
✅ Valor por defecto: 0

# 4. Cambiar descuento a 20
# 5. Guardar producto
✅ Producto se guarda con descuento 20%

# 6. Desmarcar "En oferta"
✅ Campo "Descuento (%)" desaparece
```

---

## ⚠️ Errores Comunes

### Error 1: "Error al cargar datos"

**Causa:** Backend no está corriendo o no responde

**Solución:**
```bash
# Verificar que el backend está corriendo
curl http://localhost:3001/products

# Si no responde, iniciar backend
cd app/api
npm run start:dev
```

---

### Error 2: "Error al crear producto"

**Causa:** No tienes permisos de admin o faltan campos requeridos

**Solución:**
```bash
# 1. Verificar que estás logueado como admin
# 2. Verificar que todos los campos requeridos están llenos:
   - Nombre
   - Precio > 0
   - Stock >= 0
   - URL de imagen
   - Categoría seleccionada

# 3. Ver errores en consola del navegador (F12)
```

---

### Error 3: "La categoría es requerida"

**Causa:** No seleccionaste una categoría en el formulario

**Solución:**
```bash
# Seleccionar una categoría del dropdown
# No dejar en "Seleccionar..."
```

---

### Error 4: Paginación no funciona

**Causa:** Hay menos de 10 productos después de filtrar

**Solución:**
```bash
# Esto es normal
# Si hay 8 productos filtrados, solo habrá 1 página
# Limpiar filtros para ver más productos
```

---

### Error 5: Filtros no funcionan

**Causa:** Búsqueda es case-sensitive o hay espacios extra

**Solución:**
```bash
# La búsqueda es case-insensitive (no importan mayúsculas)
# Asegúrate de escribir correctamente
# Ejemplo: "cloro" encontrará "Cloro Líquido 1L"
```

---

### Error 6: Modal no se cierra

**Causa:** Hay un error al guardar en el backend

**Solución:**
```bash
# 1. Ver mensaje de error en el formulario
# 2. Corregir los datos según el error
# 3. Intentar guardar de nuevo

# Si persiste:
# 4. Abrir consola del navegador (F12)
# 5. Ver errores en la pestaña Console
# 6. Ver requests fallidos en la pestaña Network
```

---

## 📊 Cómo Funciona la Paginación

### Concepto

La paginación divide una lista grande de productos en páginas más pequeñas para mejorar la experiencia del usuario.

### Configuración

```typescript
const ITEMS_PER_PAGE = 10;  // Productos por página
```

### Cálculo de Páginas

```typescript
// Total de páginas
const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

// Ejemplo:
// 40 productos / 10 por página = 4 páginas
// 35 productos / 10 por página = 4 páginas (3.5 redondeado)
// 10 productos / 10 por página = 1 página
```

### Obtener Productos de la Página Actual

```typescript
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const endIndex = startIndex + ITEMS_PER_PAGE;
const paginatedProducts = products.slice(startIndex, endIndex);

// Ejemplo para página 2:
// startIndex = (2 - 1) * 10 = 10
// endIndex = 10 + 10 = 20
// paginatedProducts = products[10...19] (productos 11-20)
```

### Navegación

```typescript
// Ir a página anterior
setCurrentPage((p) => Math.max(1, p - 1));

// Ir a página siguiente
setCurrentPage((p) => Math.min(totalPages, p + 1));

// Ir a página específica
setCurrentPage(pageNumber);
```

### Reseteo Automático

```typescript
// Cuando cambian los filtros, volver a página 1
useEffect(() => {
  setCurrentPage(1);
}, [search, categoryFilter]);
```

### Contador de Resultados

```typescript
const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
const end = Math.min(currentPage * ITEMS_PER_PAGE, products.length);

// Muestra: "Mostrando 1 a 10 de 40 productos"
```

---

## 🎯 Características Implementadas

### ✅ Funcionalidades

- [x] Listar productos (GET /products)
- [x] Paginación de 10 productos por página
- [x] Filtro por búsqueda (nombre, slug, categoría)
- [x] Filtro por categoría
- [x] Crear producto (POST /products)
- [x] Editar producto (PUT /products/:id)
- [x] Eliminar producto (DELETE /products/:id)
- [x] Formulario modal completo
- [x] Validaciones en frontend
- [x] Notificaciones de éxito/error
- [x] Confirmación antes de eliminar
- [x] Recarga automática después de operaciones
- [x] Sin localStorage (todo en backend)

### ✅ Validaciones

**Frontend:**
- Nombre requerido
- Precio > 0
- Stock >= 0
- URL de imagen requerida
- Categoría requerida
- Descuento 0-100% (solo si está en oferta)

**Backend:**
- Validación con class-validator
- Slug generado automáticamente
- Verificación de categoría existente
- Protección con guards (solo admin)

---

## 📁 Estructura de Archivos

```
web/
├── lib/
│   ├── productsApi.ts          # Servicio de API
│   ├── categoriesApi.ts        # Servicio de categorías
│   ├── apiClient.ts            # Cliente HTTP con tokens
│   └── types.ts                # Tipos TypeScript
├── components/
│   ├── admin/
│   │   └── ProductForm.tsx     # Formulario modal
│   └── ui/
│       └── useToast.ts         # Hook de notificaciones
└── app/
    └── admin/
        └── products/
            └── page.tsx        # Página principal
```

---

## 🚀 Próximas Mejoras

1. **Paginación en backend**: Implementar `?page=1&limit=10` en el endpoint
2. **Ordenamiento**: Ordenar por nombre, precio, stock, fecha
3. **Búsqueda avanzada**: Filtros por rango de precio, stock bajo, etc.
4. **Carga de imágenes**: Integrar con MinIO o servicio de imágenes
5. **Edición en línea**: Editar precio/stock directamente en la tabla
6. **Acciones masivas**: Eliminar/editar múltiples productos
7. **Exportar/Importar**: CSV/Excel
8. **Historial de cambios**: Auditoría de modificaciones

---

**Fecha de creación:** 2024
**Rama:** `feature/frontend-sync-step-1`
**Estado:** ✅ COMPLETADO
