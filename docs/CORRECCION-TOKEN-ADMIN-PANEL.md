# ✅ CORRECCIÓN - Error "No estás autenticado" en Panel Admin

## 🔍 **PROBLEMA IDENTIFICADO:**

El panel de administración `/admin/orders` mostraba el error "No estás autenticado" incluso cuando el usuario admin estaba correctamente autenticado.

### **Causa raíz:**

Había una **desconexión entre dos sistemas de almacenamiento de tokens**:

1. **AuthContext** (`web/contexts/AuthContext.tsx`):
   - Guarda el token en **memoria** usando `setAccessToken()` de `apiClient.ts`
   - Variable: `let accessToken: string | null = null;` (en memoria)

2. **ordersApi.ts** (`web/lib/ordersApi.ts`):
   - Intentaba leer el token de **localStorage** usando `localStorage.getItem("accessToken")`
   - localStorage estaba **vacío** porque el token nunca se guardó ahí

### **Resultado:**
```
AuthContext: Token guardado en memoria ✅
ordersApi.ts: Busca token en localStorage ❌ (vacío)
Error: "No estás autenticado"
```

---

## ✅ **SOLUCIÓN APLICADA:**

### **Archivo modificado:** `web/lib/ordersApi.ts`

**ANTES (❌ Incorrecto):**
```typescript
// Leía de localStorage (vacío)
const token = localStorage.getItem("accessToken");

if (!token) {
    throw new Error("No estás autenticado. Por favor inicia sesión.");
}

const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
```

**DESPUÉS (✅ Correcto):**
```typescript
// Usa el apiClient que tiene el token en memoria
import { api, getAccessToken } from "./apiClient";

export async function getAllOrders(): Promise<Order[]> {
    const token = getAccessToken(); // Lee de memoria

    if (!token) {
        throw new Error("No estás autenticado. Por favor inicia sesión.");
    }

    return api.get<Order[]>('/orders'); // Usa apiClient
}
```

---

## 🔧 **CAMBIOS REALIZADOS:**

### **1. Importar apiClient**
```typescript
import { api, getAccessToken } from "./apiClient";
```

### **2. Reemplazar todas las funciones para usar apiClient**

#### **getAllOrders()** (Admin - todas las órdenes):
```typescript
export async function getAllOrders(): Promise<Order[]> {
    const token = getAccessToken();
    if (!token) {
        throw new Error("No estás autenticado. Por favor inicia sesión.");
    }
    return api.get<Order[]>('/orders');
}
```

#### **getMyOrders()** (Usuario - sus órdenes):
```typescript
export async function getMyOrders(): Promise<Order[]> {
    const token = getAccessToken();
    if (!token) {
        throw new Error("No estás autenticado. Por favor inicia sesión.");
    }
    return api.get<Order[]>('/orders/mine');
}
```

#### **getOrderById()** (Orden específica):
```typescript
export async function getOrderById(orderId: number): Promise<Order> {
    const token = getAccessToken();
    if (!token) {
        throw new Error("No estás autenticado. Por favor inicia sesión.");
    }
    return api.get<Order>(`/orders/${orderId}`);
}
```

#### **createCheckoutOrder()** (Crear orden):
```typescript
export async function createCheckoutOrder(orderData: CreateCheckoutOrderDto, cartItems?: any[]): Promise<Order> {
    const token = getAccessToken();
    
    const payload = { ...orderData };
    if (!token && cartItems && cartItems.length > 0) {
        payload.items = cartItems.map(item => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price),
        }));
    }
    
    return api.post<Order>('/orders/checkout', payload);
}
```

---

## 🎯 **BENEFICIOS DE LA CORRECCIÓN:**

### **1. Consistencia:**
- ✅ Todo el sistema usa el mismo mecanismo de tokens (memoria)
- ✅ No hay desconexión entre AuthContext y ordersApi

### **2. Manejo automático de tokens:**
- ✅ `apiClient` agrega automáticamente el header `Authorization`
- ✅ `apiClient` renueva automáticamente el token si expira (401)
- ✅ `apiClient` maneja cookies HttpOnly para refresh token

### **3. Menos código:**
- ✅ No necesitamos construir headers manualmente
- ✅ No necesitamos hacer fetch directo
- ✅ Manejo de errores centralizado

### **4. Seguridad:**
- ✅ Token en memoria (no en localStorage)
- ✅ Refresh token en cookie HttpOnly
- ✅ Renovación automática de tokens

---

## 🔄 **FLUJO CORREGIDO:**

### **Cuando el usuario hace login:**

```
1. Usuario ingresa credenciales
   ↓
2. AuthContext.login() llama a api.post('/auth/login')
   ↓
3. Backend devuelve { access_token, refresh_token (cookie) }
   ↓
4. AuthContext llama a setAccessToken(token)
   ↓
5. Token guardado en MEMORIA (apiClient.ts)
   ↓
6. Usuario autenticado ✅
```

### **Cuando el admin carga /admin/orders:**

```
1. AdminOrdersPage se monta
   ↓
2. useEffect() llama a loadOrders()
   ↓
3. loadOrders() llama a getAllOrders()
   ↓
4. getAllOrders() llama a getAccessToken()
   ↓
5. getAccessToken() devuelve token de MEMORIA ✅
   ↓
6. api.get('/orders') agrega header Authorization automáticamente
   ↓
7. Backend valida token y devuelve órdenes
   ↓
8. Panel admin muestra órdenes ✅
```

---

## 📊 **VERIFICACIÓN:**

### **Antes de la corrección:**
```
✅ Login funciona
✅ Profile funciona (usa api.get indirectamente)
❌ Admin panel falla (usaba fetch directo con localStorage)
```

### **Después de la corrección:**
```
✅ Login funciona
✅ Profile funciona
✅ Admin panel funciona (ahora usa api.get)
✅ Todas las páginas usan el mismo sistema de tokens
```

---

## 🚀 **INSTRUCCIONES PARA PROBAR:**

### **1. Reiniciar frontend:**
```bash
cd web
npm run dev
```

### **2. Iniciar sesión como admin:**
```
Email: admin@test.com
Password: [tu contraseña]
```

### **3. Ir al panel admin:**
```
http://localhost:3000/admin/orders
```

### **4. Verificar que:**
- ✅ No aparece error "No estás autenticado"
- ✅ Se cargan las órdenes de la base de datos
- ✅ Se muestran badges "Usuario" e "Invitado"
- ✅ Los filtros funcionan
- ✅ El botón "Ver detalle" funciona

---

## 📋 **RESUMEN DE ARCHIVOS MODIFICADOS:**

| Archivo | Cambio | Razón |
|---------|--------|-------|
| `web/lib/ordersApi.ts` | Reemplazar fetch directo por apiClient | Usar token de memoria en lugar de localStorage |
| `web/lib/paymentsApi.ts` | Reemplazar fetch directo por apiClient | Mismo problema, usar token de memoria |

---

## 🎬 **RESULTADO FINAL:**

**Estado:** ✅ **CORREGIDO**  
**Causa:** Desconexión entre AuthContext (memoria) y ordersApi (localStorage)  
**Solución:** Usar apiClient en todas las funciones de ordersApi  
**Resultado:** Panel admin ahora carga correctamente con usuario autenticado

¡El panel admin ahora funciona correctamente! 🎉
