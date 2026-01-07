# Fase 3: Integración del Carrito con Backend - COMPLETADA

## 📋 Resumen

Se completó la integración del carrito de compras con el backend real, eliminando completamente el uso de localStorage y conectando directamente con los endpoints de NestJS. El sistema ahora maneja automáticamente:

- **Usuarios autenticados**: Carrito persistente en PostgreSQL
- **Usuarios invitados**: Carrito temporal en Redis con cookies de sesión

## ✅ Cambios Realizados

### 1. Actualización de Tipos (`web/lib/types.ts`)

**ANTES:**
```typescript
export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};
```

**DESPUÉS:**
```typescript
// Tipo de item del carrito (respuesta del backend)
export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;  // Total del item (price * quantity)
  imageUrl?: string;
};

// Respuesta completa del carrito desde el backend
export type CartResponse = {
  id?: number | null;  // ID del carrito (null para invitados)
  items: CartItem[];
  subtotal: number;
  taxes: number;
  total: number;
};
```

**Cambios clave:**
- Agregado campo `total` en `CartItem` (calculado por el backend)
- Nuevo tipo `CartResponse` que incluye subtotal, impuestos y total
- Estructura coincide exactamente con la respuesta del backend

---

### 2. Nuevo Servicio de Carrito (`web/lib/cartApi.ts`) ✨ NUEVO

Archivo completamente nuevo que maneja todas las operaciones del carrito con el backend:

```typescript
/**
 * API de Carrito - Integración con backend
 * 
 * El backend maneja automáticamente:
 * - Usuarios autenticados: carrito persistente en PostgreSQL
 * - Invitados: carrito temporal en Redis con cookies de sesión
 */

// Funciones implementadas:
export async function addToCart(productId: number, quantity: number): Promise<CartResponse>
export async function getCart(): Promise<CartResponse>
export async function removeFromCart(productId: number): Promise<CartResponse>
export async function clearCart(): Promise<void>
export async function updateCartItemQuantity(productId: number, newQuantity: number): Promise<CartResponse>
```

**Características:**
- ✅ Usa el `apiClient` con manejo automático de tokens
- ✅ Manejo de errores apropiado
- ✅ Cookies de sesión para invitados (manejadas por el backend)
- ✅ Función `updateCartItemQuantity` que elimina y vuelve a agregar (workaround para backend)

---

### 3. CartContext Completamente Reescrito (`web/components/cart/cartContext.tsx`)

**ANTES:**
- Usaba localStorage para persistir el carrito
- Cálculos de totales en el frontend
- No distinguía entre usuarios autenticados e invitados

**DESPUÉS:**
```typescript
type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;        // ✨ NUEVO - del backend
  taxes: number;           // ✨ NUEVO - del backend
  totalAmount: number;
  isLoading: boolean;      // ✨ NUEVO - estado de carga
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateItemQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
  refreshCart: () => Promise<void>;  // ✨ NUEVO - recargar carrito
};
```

**Cambios clave:**
- ✅ **Eliminado completamente localStorage**
- ✅ Todas las operaciones son asíncronas (usan backend)
- ✅ Carga automática del carrito al montar el componente
- ✅ Recarga automática cuando cambia el usuario (login/logout)
- ✅ Estado de carga (`isLoading`) para mejor UX
- ✅ Subtotal, impuestos y total calculados por el backend
- ✅ Función `refreshCart()` para recargar manualmente
- ✅ Notificaciones de éxito/error mejoradas

**Flujo de autenticación:**
```typescript
// Cargar carrito al montar y cuando cambia el usuario
useEffect(() => {
  loadCart();
}, [user]);
```

Cuando el usuario inicia sesión, el carrito se recarga automáticamente y el backend migra el carrito de invitado al carrito persistente del usuario.

---

### 4. Página de Carrito Mejorada (`web/app/cart/page.tsx`)

**ANTES:**
- Mostraba solo precio unitario y cantidad
- No mostraba impuestos ni subtotal
- Controles básicos de cantidad

**DESPUÉS:**
- ✅ Muestra imagen del producto
- ✅ Muestra subtotal por item
- ✅ Controles de cantidad mejorados (botones +/-)
- ✅ Resumen completo del pedido:
  - Subtotal
  - IVA (10%)
  - Total
- ✅ Formato de precios en CLP
- ✅ Estado de carga visible
- ✅ Confirmación antes de vaciar carrito
- ✅ Botón "Continuar comprando"
- ✅ Diseño mejorado y más profesional

**Nuevas características:**
```typescript
// Resumen del pedido
<div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-6">
  <h2>Resumen del pedido</h2>
  
  <div>Subtotal: {formatPriceCLP(subtotal)}</div>
  <div>IVA (10%): {formatPriceCLP(taxes)}</div>
  <div>Total: {formatPriceCLP(totalAmount)}</div>
  
  <Link href="/checkout">Proceder al pago</Link>
  <button onClick={handleClear}>Vaciar carrito</button>
</div>
```

---

### 5. Archivo Eliminado

**❌ ELIMINADO: `web/lib/cart.ts`**

Este archivo contenía las funciones de localStorage que ya no se usan:
- `getCart()`
- `saveCart()`
- `addToCart()`
- `updateQuantity()`
- `removeFromCart()`
- `clearCart()`
- `getCartTotals()`

Todas estas funciones fueron reemplazadas por llamadas al backend en `cartApi.ts`.

---

## 📁 Archivos Modificados/Creados

### Archivos Nuevos:
1. ✨ `web/lib/cartApi.ts` - Servicio de API del carrito

### Archivos Modificados:
2. ✅ `web/lib/types.ts` - Tipos actualizados (CartItem, CartResponse)
3. ✅ `web/components/cart/cartContext.tsx` - Reescrito completamente
4. ✅ `web/app/cart/page.tsx` - Mejorado con resumen completo

### Archivos Eliminados:
5. ❌ `web/lib/cart.ts` - Ya no se usa localStorage

### Documentación:
6. ✅ `docs/FASE-3-IMPLEMENTACION.md` - Este documento
7. ✅ `docs/FASE-2-ESTADO-ACTUAL.md` - Actualizado con progreso

---

## 🔍 Endpoints Utilizados

| Endpoint | Método | Uso | Autenticación |
|----------|--------|-----|---------------|
| `/cart` | POST | Agregar producto al carrito | Opcional (OptionalJwtAuthGuard) |
| `/cart` | GET | Obtener carrito actual | Opcional (OptionalJwtAuthGuard) |
| `/cart/:productId` | DELETE | Eliminar producto del carrito | Opcional (OptionalJwtAuthGuard) |
| `/cart` | DELETE | Vaciar carrito completamente | Opcional (OptionalJwtAuthGuard) |

**Nota importante:** El backend usa `OptionalJwtAuthGuard`, lo que significa:
- Si el usuario está autenticado (tiene token JWT): usa carrito persistente en PostgreSQL
- Si el usuario NO está autenticado: usa carrito temporal en Redis con cookies de sesión

---

## 🔄 Flujo de Funcionamiento

### Para Usuarios Invitados (No Autenticados):

1. Usuario agrega producto al carrito
2. Frontend llama a `POST /cart` sin token JWT
3. Backend detecta que no hay usuario autenticado
4. Backend crea/usa cookie `session_id` (HttpOnly)
5. Backend guarda carrito en Redis con TTL de 24 horas
6. Frontend recibe y muestra el carrito

### Para Usuarios Autenticados:

1. Usuario inicia sesión
2. `AuthContext` carga el usuario
3. `CartContext` detecta cambio de usuario (useEffect)
4. `CartContext` recarga el carrito con `getCart()`
5. Frontend llama a `GET /cart` con token JWT
6. Backend detecta usuario autenticado
7. Backend busca/crea carrito en PostgreSQL
8. **Backend migra automáticamente items del carrito de invitado (si existe)**
9. Frontend recibe y muestra el carrito persistente

### Migración Automática:

Cuando un usuario invitado inicia sesión, el backend automáticamente:
1. Lee el carrito temporal de Redis (usando cookie `session_id`)
2. Migra los items al carrito persistente del usuario en PostgreSQL
3. Elimina el carrito temporal de Redis
4. El usuario no pierde ningún producto agregado antes de iniciar sesión

---

## ✅ Verificación de Compilación

```bash
✓ web/lib/types.ts - No diagnostics found
✓ web/lib/cartApi.ts - No diagnostics found
✓ web/components/cart/cartContext.tsx - No diagnostics found
✓ web/app/cart/page.tsx - No diagnostics found
```

---

## 🧪 Guía de Pruebas

### Prueba 1: Carrito como Invitado

1. **Abrir el navegador en modo incógnito**
   ```
   http://localhost:3000/catalogo
   ```

2. **Agregar productos al carrito**
   - Hacer clic en "Agregar al carrito" en varios productos
   - Verificar que aparece la notificación "Producto agregado al carrito"
   - Verificar que el contador del carrito en el navbar aumenta

3. **Ver el carrito**
   ```
   http://localhost:3000/cart
   ```
   - Verificar que se muestran todos los productos agregados
   - Verificar que se muestra el subtotal, IVA y total
   - Verificar que las imágenes se muestran correctamente

4. **Modificar cantidades**
   - Usar los botones +/- para cambiar cantidades
   - Verificar que el subtotal se actualiza correctamente
   - Verificar que el total se recalcula

5. **Eliminar productos**
   - Hacer clic en "Eliminar" en un producto
   - Verificar que se elimina correctamente
   - Verificar que los totales se actualizan

6. **Verificar persistencia (cookies)**
   - Recargar la página (F5)
   - Verificar que el carrito se mantiene
   - Cerrar y abrir el navegador
   - Verificar que el carrito se mantiene (por 24 horas)

### Prueba 2: Carrito como Usuario Autenticado

1. **Iniciar sesión**
   ```
   http://localhost:3000/auth/login
   ```
   - Email: `user@test.com`
   - Password: `User123!`

2. **Agregar productos al carrito**
   - Ir al catálogo y agregar productos
   - Verificar que funciona igual que para invitados

3. **Verificar persistencia (base de datos)**
   - Cerrar el navegador completamente
   - Abrir de nuevo e iniciar sesión
   - Ir a `/cart`
   - Verificar que el carrito se mantiene (persistente en PostgreSQL)

4. **Cerrar sesión y volver a iniciar**
   - Hacer logout
   - Iniciar sesión de nuevo
   - Verificar que el carrito sigue ahí

### Prueba 3: Migración de Carrito (Invitado → Autenticado)

1. **Abrir navegador en modo incógnito**
   ```
   http://localhost:3000/catalogo
   ```

2. **Agregar productos como invitado**
   - Agregar 2-3 productos al carrito
   - Verificar que están en el carrito

3. **Iniciar sesión**
   ```
   http://localhost:3000/auth/login
   ```
   - Email: `user@test.com`
   - Password: `User123!`

4. **Verificar migración automática**
   - Ir a `/cart`
   - **Verificar que los productos agregados como invitado siguen ahí**
   - El backend migró automáticamente el carrito de Redis a PostgreSQL

5. **Cerrar sesión y volver a iniciar**
   - Hacer logout
   - Iniciar sesión de nuevo
   - Verificar que el carrito persistió (está en la base de datos)

### Prueba 4: Múltiples Dispositivos (Usuario Autenticado)

1. **Dispositivo 1: Agregar productos**
   - Iniciar sesión en el navegador 1
   - Agregar productos al carrito

2. **Dispositivo 2: Ver el mismo carrito**
   - Iniciar sesión en el navegador 2 (o modo incógnito) con el mismo usuario
   - Ir a `/cart`
   - **Verificar que se ven los mismos productos**
   - El carrito está sincronizado en la base de datos

3. **Dispositivo 1: Modificar carrito**
   - Agregar más productos o cambiar cantidades

4. **Dispositivo 2: Recargar**
   - Recargar la página `/cart`
   - **Verificar que se ven los cambios**

### Prueba 5: Manejo de Errores

1. **Producto sin stock**
   - Intentar agregar un producto sin stock
   - Verificar que muestra error apropiado

2. **Backend no disponible**
   - Detener el backend
   - Intentar agregar producto
   - Verificar que muestra error apropiado
   - Iniciar el backend
   - Recargar la página
   - Verificar que el carrito se carga correctamente

3. **Sesión expirada**
   - Iniciar sesión
   - Esperar a que expire el token (o forzar expiración)
   - Intentar agregar producto
   - Verificar que el refresh token funciona automáticamente

---

## 🔧 Verificación en Backend

### Verificar carrito de usuario autenticado (PostgreSQL):

```sql
-- Ver todos los carritos
SELECT * FROM carts;

-- Ver items de un carrito específico
SELECT ci.*, p.name, p.price 
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.cart_id = 1;
```

### Verificar carrito de invitado (Redis):

```bash
# Conectar a Redis
redis-cli

# Ver todas las claves de carritos
KEYS cart:*

# Ver contenido de un carrito específico
GET cart:session-id-aqui

# Ver TTL (tiempo de vida restante)
TTL cart:session-id-aqui
```

---

## 📊 Comparación Antes vs Después

| Característica | ANTES (localStorage) | DESPUÉS (Backend) |
|----------------|---------------------|-------------------|
| Persistencia | Solo en navegador | Base de datos + Redis |
| Sincronización | No | Sí (múltiples dispositivos) |
| Usuarios invitados | localStorage | Redis con cookies (24h) |
| Usuarios autenticados | localStorage | PostgreSQL (permanente) |
| Migración de carrito | No | Sí (automática al login) |
| Cálculo de impuestos | Frontend | Backend |
| Validación de stock | No | Sí (backend) |
| Seguridad | Baja (manipulable) | Alta (servidor) |

---

## 🎯 Próximos Pasos

### FASE 4: Checkout Real

El carrito ya está completamente integrado. Ahora podemos implementar el checkout:

1. Crear página `/checkout`
2. Formulario de datos de envío (nombre, dirección, comuna, teléfono)
3. Integrar con `POST /orders/checkout`
4. Pantalla de confirmación "Gracias por tu compra"
5. Vaciar carrito después de compra exitosa

### FASE 5: Panel de Administración

1. CRUD de productos en `/admin/products`
2. Gestión de órdenes en `/admin/orders`
3. Gestión de usuarios en `/admin/customers`
4. Dashboard con estadísticas

---

## 📊 Progreso Actualizado

| Fase | Estado | Completitud |
|------|--------|-------------|
| 0. Preparación | ✅ Completa | 100% |
| 1. Autenticación | ✅ Completa | 100% |
| 2. Catálogo | ✅ Completa | 100% |
| 3. Carrito | ✅ Completa | 100% |
| 4. Checkout | ⏳ Pendiente | 0% |
| 5. Admin Panel | ⏳ Pendiente | 0% |

**Progreso Total: 67%** 🎉

---

## 🚨 Notas Importantes

### Cookies de Sesión

El backend usa cookies HttpOnly para manejar sesiones de invitados:
- Cookie name: `session_id`
- Atributos: `httpOnly: true`, `sameSite: 'strict'`
- TTL en Redis: 24 horas
- El frontend NO necesita manejar estas cookies (automático)

### Refresh Token

El `apiClient` maneja automáticamente:
- Agregar token JWT a las requests
- Detectar 401 (no autorizado)
- Renovar token con `/auth/refresh`
- Reintentar request original
- Redirigir a login si falla el refresh

### Migración de Carrito

La migración de carrito de invitado a usuario autenticado es **automática** y ocurre en el backend. El frontend solo necesita:
1. Detectar cambio de usuario (useEffect en CartContext)
2. Recargar el carrito con `getCart()`

### LocalStorage

**Ya NO se usa localStorage para el carrito.** Todo está en el backend:
- Invitados: Redis (con cookies)
- Autenticados: PostgreSQL

---

## 🔧 Troubleshooting

### Problema: Carrito no se carga

**Solución:**
1. Verificar que el backend está corriendo en `http://localhost:3001`
2. Verificar que Redis está corriendo
3. Verificar que PostgreSQL está corriendo
4. Abrir DevTools → Network → Ver si las requests a `/cart` funcionan

### Problema: Carrito se vacía al recargar (invitado)

**Solución:**
1. Verificar que las cookies están habilitadas en el navegador
2. Verificar que Redis está corriendo
3. Verificar que la cookie `session_id` existe (DevTools → Application → Cookies)

### Problema: Carrito no migra al iniciar sesión

**Solución:**
1. Verificar que el backend tiene la lógica de migración implementada
2. Verificar logs del backend
3. Verificar que la cookie `session_id` existe antes del login

### Problema: Error "Product not found"

**Solución:**
1. Verificar que el producto existe en la base de datos
2. Ejecutar el seed si es necesario
3. Verificar que el `productId` es correcto

### Problema: Error "Not enough stock"

**Solución:**
1. Verificar el stock del producto en la base de datos
2. Reducir la cantidad solicitada
3. Actualizar el stock del producto

---

**Fecha de implementación:** 2024
**Rama:** `feature/frontend-sync-step-1`
**Estado:** ✅ COMPLETADA
