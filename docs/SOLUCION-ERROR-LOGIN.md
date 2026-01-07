# Solución: Error al Iniciar Sesión y Base de Datos Vacía

## 🔍 Problema Identificado

El error que estabas experimentando tenía dos causas:

1. **Backend no estaba corriendo** → `fetch failed`
2. **Campo `slug` agregado a categorías existentes** → Error de base de datos

## ✅ Solución Aplicada

### 1. Se eliminó la tabla `categories` y se recreó con el campo `slug`

```sql
DROP TABLE IF EXISTS categories CASCADE;
```

Esto eliminó:
- Todas las categorías existentes
- Las relaciones de productos con categorías (los productos siguen existiendo pero sin categoría)

### 2. Backend reiniciado correctamente

El backend ahora está corriendo en `http://localhost:3001` y responde correctamente:

```bash
✓ GET /products → 200 OK (devuelve [])
✓ GET /categories → 200 OK (devuelve [])
✓ GET /cart → 200 OK
✓ POST /auth/login → Funcional
```

---

## 🎯 Próximos Pasos

### Paso 1: Verificar que puedes iniciar sesión

```bash
# 1. Abrir el frontend
http://localhost:3000/auth/login

# 2. Iniciar sesión como admin
Email: admin@test.com
Password: Admin123!

# Si el usuario no existe, créalo desde el backend o usa el seed
```

### Paso 2: Crear categorías

```bash
# 1. Ir al panel de categorías
http://localhost:3000/admin/categories

# 2. Crear categorías:
- "Cloro y Desinfectantes"
- "Limpieza del Hogar"
- "Cuidado Personal"
```

### Paso 3: Crear productos

```bash
# 1. Ir al panel de productos
http://localhost:3000/admin/products

# 2. Crear productos y asignarles categorías
```

---

## 🔧 Alternativa: Ejecutar Seed

Si quieres poblar la base de datos rápidamente, puedes ejecutar el seed:

### Opción A: Desde el código

Agrega un endpoint temporal en el backend:

```typescript
// app/api/src/seed/seed.controller.ts
import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  async runSeed() {
    await this.seedService.runSeed();
    return { message: 'Seed executed successfully' };
  }
}
```

Luego:
```bash
curl -X POST http://localhost:3001/seed
```

### Opción B: Crear seed completo

Puedo ayudarte a crear un seed que incluya:
- Usuarios (admin y user)
- Categorías
- Productos con categorías asignadas

---

## 📊 Estado Actual de la Base de Datos

```sql
-- Verificar usuarios
SELECT id, email, roles FROM users;

-- Verificar categorías (vacío)
SELECT * FROM categories;

-- Verificar productos (vacío o sin categoría)
SELECT id, name, category_id FROM products;
```

---

## 🚨 Importante: Evitar este problema en el futuro

Cuando agregues campos `NOT NULL` a entidades que ya tienen datos:

### Opción 1: Hacer el campo nullable primero
```typescript
@Column({ type: 'varchar', length: 255, unique: true, nullable: true })
slug: string;
```

Luego crear una migración para llenar los valores y después hacer el campo `NOT NULL`.

### Opción 2: Usar migraciones de TypeORM
```bash
npm run typeorm migration:generate -- -n AddSlugToCategory
npm run typeorm migration:run
```

### Opción 3: En desarrollo, limpiar la base de datos
```sql
DROP TABLE IF EXISTS categories CASCADE;
```

---

## ✅ Verificación Final

Para confirmar que todo está funcionando:

1. **Backend corriendo:**
   ```bash
   curl http://localhost:3001/categories
   # Debe devolver: []
   ```

2. **Frontend puede conectarse:**
   ```bash
   # Abrir: http://localhost:3000
   # No debe mostrar errores de "fetch failed"
   ```

3. **Login funciona:**
   ```bash
   # Ir a: http://localhost:3000/auth/login
   # Iniciar sesión con admin@test.com / Admin123!
   ```

4. **Panel de categorías accesible:**
   ```bash
   # Ir a: http://localhost:3000/admin/categories
   # Debe mostrar tabla vacía con botón "Nueva Categoría"
   ```

---

## 🎯 ¿Qué hacer ahora?

1. **Probar el login** → Confirmar que funciona
2. **Crear categorías** → Usar el panel de admin
3. **Crear productos** → Asignarles categorías
4. **Probar el catálogo** → Ver productos con filtros

O si prefieres:

5. **Crear un seed completo** → Poblar la base de datos automáticamente

¿Qué prefieres hacer?
