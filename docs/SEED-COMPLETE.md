# Seed Completo - Documentación

## 📋 Resumen

Se implementó un módulo de seed completo que pobla automáticamente la base de datos con usuarios, categorías y productos para facilitar el desarrollo y pruebas.

## ✅ Datos Creados

### 👥 Usuarios (2)

| Email | Password | Roles |
|-------|----------|-------|
| admin@test.com | Admin123! | ADMIN, USER |
| user@test.com | User123! | USER |

### 📁 Categorías (4)

| ID | Nombre | Slug |
|----|--------|------|
| 1 | Cloro y desinfectantes | cloro-y-desinfectantes |
| 2 | Limpieza del hogar | limpieza-del-hogar |
| 3 | Limpieza industrial | limpieza-industrial |
| 4 | Cuidado personal | cuidado-personal |

### 📦 Productos (40 total)

**Por categoría:**
- Cloro y desinfectantes: 10 productos
- Limpieza del hogar: 10 productos
- Limpieza industrial: 10 productos
- Cuidado personal: 10 productos

**Características de los productos:**
- ✅ Nombres reales y descriptivos
- ✅ Slugs generados automáticamente
- ✅ Descripciones detalladas
- ✅ Precios en CLP (2,490 - 18,990)
- ✅ Stock variado (20 - 200 unidades)
- ✅ Imágenes placeholder (placehold.co)
- ✅ Productos destacados (`isFeatured`)
- ✅ Productos en oferta (`isOnSale`)
- ✅ Descuentos (8% - 15%)

---

## 🚀 Cómo Ejecutar el Seed

### Opción 1: Desde el navegador o Postman

```bash
GET http://localhost:3001/seed/run
```

### Opción 2: Desde la terminal con cURL

```bash
curl http://localhost:3001/seed/run
```

### Opción 3: Desde PowerShell

```powershell
Invoke-WebRequest -Uri "http://localhost:3001/seed/run" -Method GET
```

**Respuesta esperada:**
```json
{
  "message": "Seed executed successfully",
  "users": 2,
  "categories": 4,
  "products": 40
}
```

---

## 🔍 Verificar Datos Creados

### Verificar Categorías

```bash
# Listar todas las categorías
curl http://localhost:3001/categories

# Respuesta esperada:
[
  {"id":1,"name":"Cloro y desinfectantes","slug":"cloro-y-desinfectantes","productCount":10},
  {"id":2,"name":"Limpieza del hogar","slug":"limpieza-del-hogar","productCount":10},
  {"id":3,"name":"Limpieza industrial","slug":"limpieza-industrial","productCount":10},
  {"id":4,"name":"Cuidado personal","slug":"cuidado-personal","productCount":10}
]
```

### Verificar Productos

```bash
# Listar todos los productos
curl http://localhost:3001/products

# Ver solo los primeros 3 productos
curl http://localhost:3001/products | ConvertFrom-Json | Select-Object -First 3
```

### Verificar en PostgreSQL

```sql
-- Contar categorías
SELECT COUNT(*) FROM categories;
-- Resultado esperado: 4

-- Contar productos
SELECT COUNT(*) FROM products;
-- Resultado esperado: 40

-- Ver productos por categoría
SELECT 
  c.name as categoria,
  COUNT(p.id) as cantidad_productos
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name
ORDER BY c.id;

-- Ver productos destacados
SELECT name, price, is_featured, is_on_sale, discount_percent
FROM products
WHERE is_featured = true;

-- Ver productos en oferta
SELECT name, price, discount_percent
FROM products
WHERE is_on_sale = true;
```

---

## 🔄 Comportamiento del Seed

### Limpieza de Datos

El seed **elimina** los siguientes datos antes de crear nuevos:

✅ **Eliminados:**
- Cart items (items del carrito)
- Carts (carritos)
- Products (productos)
- Categories (categorías)

❌ **NO eliminados:**
- Users (usuarios) - Para no perder sesiones activas

**Nota:** Si los usuarios ya existen, no se duplican. El seed verifica primero si existen.

### Ejecución Múltiple

El seed es **idempotente** para usuarios:
- Si ejecutas el seed múltiples veces, los usuarios NO se duplican
- Los productos y categorías se recrean cada vez

---

## 📊 Ejemplos de Productos Creados

### Categoría: Cloro y desinfectantes

```json
{
  "id": 1,
  "name": "Cloro Líquido 1L",
  "slug": "cloro-liquido-1l",
  "description": "Cloro líquido concentrado para desinfección de superficies...",
  "price": 2490,
  "stock": 150,
  "imageUrl": "https://placehold.co/600x400?text=Cloro%20L%C3%ADquido%201L",
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

### Categoría: Limpieza industrial

```json
{
  "id": 21,
  "name": "Detergente Industrial 20L",
  "slug": "detergente-industrial-20l",
  "description": "Detergente industrial concentrado para lavado de ropa...",
  "price": 18990,
  "stock": 30,
  "imageUrl": "https://placehold.co/600x400?text=Detergente%20Industrial%2020L",
  "isFeatured": true,
  "isOnSale": false,
  "discountPercent": null,
  "category": {
    "id": 3,
    "name": "Limpieza industrial",
    "slug": "limpieza-industrial"
  }
}
```

---

## 🧪 Probar en el Frontend

### 1. Iniciar sesión

```
http://localhost:3000/auth/login
Email: admin@test.com
Password: Admin123!
```

### 2. Ver catálogo con productos reales

```
http://localhost:3000/catalogo
```

**Verificar:**
- ✅ Se muestran 40 productos
- ✅ Filtros por categoría funcionan
- ✅ Productos destacados en el carrusel
- ✅ Productos en oferta con descuento

### 3. Ver producto individual

```
http://localhost:3000/product/cloro-liquido-1l
```

**Verificar:**
- ✅ Se muestra información del producto
- ✅ Se muestra la categoría
- ✅ Se muestra el stock
- ✅ Botón "Agregar al carrito" funciona

### 4. Filtrar por categoría

```
http://localhost:3000/catalogo?cat=limpieza-del-hogar
```

**Verificar:**
- ✅ Solo se muestran productos de esa categoría
- ✅ Contador muestra "Mostrando 10 productos"

### 5. Panel de administración

```
http://localhost:3000/admin/categories
```

**Verificar:**
- ✅ Se muestran las 4 categorías
- ✅ Cada categoría muestra su conteo de productos (10)

```
http://localhost:3000/admin/products
```

**Verificar:**
- ✅ Se muestran los 40 productos
- ✅ Cada producto tiene su categoría asignada

---

## ⚠️ Posibles Errores y Soluciones

### Error: "Internal server error" al ejecutar seed

**Causa:** El backend no está corriendo o hay un error en la base de datos

**Solución:**
```bash
# 1. Verificar que el backend está corriendo
curl http://localhost:3001

# 2. Ver logs del backend
# Buscar errores en la consola donde corre el backend

# 3. Verificar conexión a PostgreSQL
docker ps | grep postgres

# 4. Verificar que la base de datos existe
docker exec -it postgres psql -U dev -d ecommerce -c "\dt"
```

---

### Error: "Empty criteria(s) are not allowed"

**Causa:** Versión antigua del código que usaba `.delete({})` en lugar de `.clear()`

**Solución:** Ya está corregido en la versión actual. Si persiste, actualiza el código.

---

### Error: "TRUNCATE ... CASCADE" con foreign keys

**Causa:** Hay relaciones de foreign keys que impiden el truncate

**Solución:** Ya está corregido. El seed usa `TRUNCATE ... CASCADE` que elimina en cascada.

---

### Error: "Category with name already exists"

**Causa:** Intentas crear una categoría que ya existe

**Solución:** El seed limpia las categorías antes de crearlas. Si el error persiste, ejecuta:
```sql
TRUNCATE TABLE categories CASCADE;
```

---

### Productos no se muestran en el frontend

**Causa:** El frontend no está conectado al backend o hay un error en la API

**Solución:**
```bash
# 1. Verificar que el backend devuelve productos
curl http://localhost:3001/products

# 2. Verificar que el frontend está corriendo
# Abrir: http://localhost:3000

# 3. Ver errores en la consola del navegador (F12)

# 4. Verificar variable de entorno
# En web/.env.local debe estar:
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📝 Estructura del Código

### Archivos del Módulo Seed

```
app/api/src/seed/
├── seed.module.ts       # Módulo de NestJS
├── seed.controller.ts   # Controlador con endpoint GET /seed/run
└── seed.service.ts      # Lógica de seed (usuarios, categorías, productos)
```

### Flujo de Ejecución

```
1. GET /seed/run
   ↓
2. SeedController.runSeed()
   ↓
3. SeedService.runSeed()
   ↓
4. cleanDatabase()      → Limpia productos, categorías, carritos
   ↓
5. createUsers()        → Crea admin y user (si no existen)
   ↓
6. createCategories()   → Crea 4 categorías
   ↓
7. createProducts()     → Crea 40 productos (10 por categoría)
   ↓
8. Retorna resumen: { users: 2, categories: 4, products: 40 }
```

---

## 🎯 Casos de Uso

### Caso 1: Desarrollo inicial

```bash
# 1. Clonar el proyecto
# 2. Iniciar Docker (PostgreSQL, Redis)
# 3. Iniciar backend
cd app/api
npm run start:dev

# 4. Ejecutar seed
curl http://localhost:3001/seed/run

# 5. Iniciar frontend
cd web
npm run dev

# 6. Abrir navegador
http://localhost:3000/catalogo
```

### Caso 2: Resetear datos de prueba

```bash
# Ejecutar seed de nuevo para limpiar y recrear datos
curl http://localhost:3001/seed/run
```

### Caso 3: Demostración del proyecto

```bash
# 1. Ejecutar seed para tener datos frescos
curl http://localhost:3001/seed/run

# 2. Iniciar sesión como admin
http://localhost:3000/auth/login
admin@test.com / Admin123!

# 3. Mostrar panel de administración
http://localhost:3000/admin/categories
http://localhost:3000/admin/products

# 4. Mostrar catálogo público
http://localhost:3000/catalogo
```

---

## 🔧 Personalización del Seed

Si quieres modificar los datos del seed, edita el método `getProductsData()` en `app/api/src/seed/seed.service.ts`:

```typescript
private getProductsData() {
  return [
    {
      slug: 'tu-categoria-slug',
      products: [
        {
          name: 'Tu Producto',
          description: 'Descripción del producto',
          price: 5990,
          stock: 100,
          isFeatured: true,
          isOnSale: false,
        },
        // ... más productos
      ],
    },
  ];
}
```

---

## 📊 Estadísticas de los Datos

### Distribución de Productos

| Categoría | Productos | Destacados | En Oferta |
|-----------|-----------|------------|-----------|
| Cloro y desinfectantes | 10 | 3 | 3 |
| Limpieza del hogar | 10 | 2 | 3 |
| Limpieza industrial | 10 | 2 | 3 |
| Cuidado personal | 10 | 3 | 3 |
| **TOTAL** | **40** | **10** | **12** |

### Rango de Precios

- Mínimo: $2,490 (Cloro Líquido 1L)
- Máximo: $18,990 (Detergente Industrial 20L)
- Promedio: ~$6,500

### Rango de Stock

- Mínimo: 20 unidades
- Máximo: 200 unidades
- Promedio: ~90 unidades

---

**Fecha de creación:** 2024
**Rama:** `feature/frontend-sync-step-1`
**Estado:** ✅ FUNCIONAL
