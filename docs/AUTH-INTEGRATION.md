# Integración de Autenticación Real - Frontend

## 📋 Resumen

Se ha implementado un sistema completo de autenticación real que reemplaza el sistema mock basado en localStorage. La nueva implementación utiliza JWT tokens (access + refresh) con cookies HttpOnly, siguiendo las mejores prácticas de seguridad.

## 🏗️ Arquitectura

### Flujo de Tokens

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. POST /auth/login
       │    { email, password }
       ▼
┌─────────────┐
│   Backend   │
│  (NestJS)   │
└──────┬──────┘
       │
       │ 2. Responde con:
       │    - access_token (JSON)
       │    - refresh_token (Cookie HttpOnly)
       ▼
┌─────────────┐
│   Frontend  │
│  - Access token → Memory
│  - Refresh token → Cookie
└─────────────┘
```

### Renovación Automática

```
Request con 401
     │
     ▼
¿Hay refresh token?
     │
     ├─ NO → Redirigir a /auth/login
     │
     └─ SÍ → POST /auth/refresh
              │
              ├─ Success → Nuevo access token
              │            Reintentar request original
              │
              └─ Error → Redirigir a /auth/login
```

## 📁 Archivos Creados/Modificados

### Nuevos Archivos

1. **`web/lib/apiClient.ts`**
   - Cliente HTTP con interceptor de tokens
   - Renovación automática de access token
   - Manejo de errores 401

2. **`web/contexts/AuthContext.tsx`**
   - Nuevo contexto de autenticación con backend real
   - Gestión de estado de usuario
   - Métodos: login, register, logout, refreshUser

3. **`web/middleware.ts`**
   - Middleware de Next.js para proteger rutas
   - Verifica presencia de refresh token
   - Redirige a login si no hay token

### Archivos Modificados

4. **`web/app/layout.tsx`**
   - Actualizado para usar nuevo AuthProvider

5. **`web/components/auth/requireAuth.tsx`**
   - Actualizado para usar nuevo AuthContext
   - Mejores estados de loading
   - Redirección con parámetro `redirect`

6. **`web/components/auth/requireAdmin.tsx`**
   - Actualizado para usar nuevo AuthContext
   - Mejores estados de loading

7. **`web/app/auth/login/page.tsx`**
   - Integración con API real
   - Manejo de errores mejorado
   - Redirección después del login

8. **`web/app/auth/register/page.tsx`**
   - Integración con API real
   - Validación de contraseñas
   - Confirmación de contraseña

9. **`web/app/profile/page.tsx`**
   - Muestra datos reales del usuario
   - Botón para ir a admin (si es admin)
   - Logout funcional

10. **`web/components/navbar/navbar.tsx`**
    - Muestra usuario logueado
    - Dropdown con opciones de usuario
    - Link a admin para admins
    - Botón de logout

## 🔐 Seguridad

### Access Token
- **Almacenamiento:** Memory state (variable en `apiClient.ts`)
- **Duración:** Corta (ej: 15 minutos)
- **Uso:** Se envía en header `Authorization: Bearer <token>`
- **Ventaja:** No persiste en localStorage, más seguro contra XSS

### Refresh Token
- **Almacenamiento:** Cookie HttpOnly
- **Duración:** Larga (ej: 7 días)
- **Uso:** Se envía automáticamente en requests a `/auth/refresh`
- **Ventaja:** No accesible desde JavaScript, protegido contra XSS

### Protección de Rutas

**Middleware (SSR):**
- Verifica presencia de refresh token en cookies
- Redirige a login si no hay token
- Protege rutas `/profile` y `/admin`

**Componentes (CSR):**
- `RequireAuth`: Protege rutas que requieren autenticación
- `RequireAdmin`: Protege rutas que requieren rol admin

## 🔄 Flujos Implementados

### 1. Flujo de Login

```typescript
// Usuario ingresa credenciales
await login(email, password)
  ↓
// POST /auth/login
{
  email: "user@test.com",
  password: "User123!"
}
  ↓
// Backend responde
{
  access_token: "eyJhbGc...",
  // + Cookie: refreshToken=xyz; HttpOnly; Secure
}
  ↓
// Frontend guarda
- setAccessToken(access_token) → Memory
- Cookie guardada automáticamente por browser
  ↓
// Decodifica token y extrae user
const payload = JSON.parse(atob(token.split('.')[1]))
setUser({
  id: payload.sub,
  email: payload.email,
  roles: payload.roles
})
  ↓
// Redirige a /profile o página solicitada
```

### 2. Flujo de Logout

```typescript
// Usuario hace click en "Cerrar sesión"
await logout()
  ↓
// POST /auth/logout
// (envía cookie refresh token automáticamente)
  ↓
// Backend limpia refresh token
  ↓
// Frontend limpia estado
setAccessToken(null)
setUser(null)
  ↓
// Redirige a /
```

### 3. Flujo de Refresh Token

```typescript
// Request falla con 401
api.get('/orders/mine')
  ↓
// Interceptor detecta 401
if (response.status === 401 && accessToken) {
  ↓
  // Intenta renovar token
  POST /auth/refresh
  // (envía cookie refresh token)
    ↓
    // Backend responde con nuevo access token
    { access_token: "eyJhbGc..." }
      ↓
      // Guarda nuevo token
      setAccessToken(newToken)
        ↓
        // Reintenta request original
        api.get('/orders/mine')
          ↓
          // Success!
}
```

### 4. Flujo de Carga Inicial

```typescript
// App se monta
useEffect(() => {
  loadUser()
}, [])
  ↓
// Intenta obtener nuevo access token
POST /auth/refresh
// (envía cookie refresh token si existe)
  ↓
  ├─ Success
  │   ↓
  │   setAccessToken(newToken)
  │   fetchUser()
  │   setUser(userData)
  │
  └─ Error (no hay sesión)
      ↓
      setUser(null)
      setAccessToken(null)
```

## 🧪 Pruebas

### Pruebas Manuales con Navegador

#### 1. Registro de Usuario

```
1. Ir a http://localhost:3000/auth/register
2. Ingresar:
   - Email: test@example.com
   - Password: Test123!
   - Confirmar password: Test123!
3. Click en "Registrarme"
4. Verificar mensaje de éxito
5. Verificar redirección a /auth/login
```

#### 2. Login

```
1. Ir a http://localhost:3000/auth/login
2. Ingresar:
   - Email: user@test.com
   - Password: User123!
3. Click en "Ingresar"
4. Verificar redirección a /profile
5. Verificar que navbar muestra usuario
```

#### 3. Navegación Autenticada

```
1. Estando logueado, ir a /profile
2. Verificar que muestra datos del usuario
3. Ir a /catalogo
4. Verificar que navbar sigue mostrando usuario
5. Recargar página
6. Verificar que sesión persiste
```

#### 4. Logout

```
1. Estando logueado, click en dropdown de usuario
2. Click en "Cerrar sesión"
3. Verificar redirección a /
4. Verificar que navbar muestra "Iniciar sesión"
5. Intentar ir a /profile
6. Verificar redirección a /auth/login
```

#### 5. Admin Access

```
1. Login con admin@test.com / Admin123!
2. Verificar que navbar muestra "Panel de admin"
3. Ir a /admin
4. Verificar acceso permitido
5. Logout
6. Login con user@test.com / User123!
7. Intentar ir a /admin
8. Verificar redirección a /
```

### Pruebas con Postman

#### 1. Login

```http
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "User123!"
}

# Respuesta esperada:
{
  "access_token": "eyJhbGc..."
}
# + Cookie: refreshToken=xyz; HttpOnly
```

#### 2. Refresh Token

```http
POST http://localhost:3001/auth/refresh
# (Cookie refreshToken se envía automáticamente)

# Respuesta esperada:
{
  "access_token": "eyJhbGc..."
}
```

#### 3. Logout

```http
POST http://localhost:3001/auth/logout
# (Cookie refreshToken se envía automáticamente)

# Respuesta esperada:
{
  "message": "Logout exitoso"
}
```

#### 4. Request Protegido

```http
GET http://localhost:3001/orders/mine
Authorization: Bearer eyJhbGc...

# Respuesta esperada:
[
  {
    "id": 1,
    "total": 50000,
    ...
  }
]
```

### Pruebas con Playwright

```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test('Login flow', async ({ page }) => {
  // Ir a login
  await page.goto('http://localhost:3000/auth/login');
  
  // Llenar formulario
  await page.fill('input[type="email"]', 'user@test.com');
  await page.fill('input[type="password"]', 'User123!');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Verificar redirección
  await expect(page).toHaveURL('http://localhost:3000/profile');
  
  // Verificar que muestra usuario
  await expect(page.locator('text=user@test.com')).toBeVisible();
});

test('Protected route redirect', async ({ page }) => {
  // Intentar acceder a ruta protegida sin login
  await page.goto('http://localhost:3000/profile');
  
  // Verificar redirección a login
  await expect(page).toHaveURL(/\/auth\/login/);
});

test('Logout flow', async ({ page, context }) => {
  // Login primero
  await page.goto('http://localhost:3000/auth/login');
  await page.fill('input[type="email"]', 'user@test.com');
  await page.fill('input[type="password"]', 'User123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/profile');
  
  // Hacer logout
  await page.click('button:has-text("Cerrar sesión")');
  
  // Verificar redirección
  await expect(page).toHaveURL('http://localhost:3000/');
  
  // Verificar que no hay cookies de sesión
  const cookies = await context.cookies();
  const refreshToken = cookies.find(c => c.name === 'refreshToken');
  expect(refreshToken).toBeUndefined();
});
```

## 🐛 Troubleshooting

### Problema: "Session expired" constante

**Causa:** El refresh token expiró o no se está enviando

**Solución:**
1. Verificar que el backend está configurando la cookie correctamente
2. Verificar que `credentials: 'include'` está en todas las requests
3. Verificar que el dominio de la cookie coincide

### Problema: CORS errors

**Causa:** Backend no permite cookies cross-origin

**Solución:**
```typescript
// backend: main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### Problema: Token no se renueva automáticamente

**Causa:** El interceptor no está funcionando

**Solución:**
1. Verificar que todas las requests usan `api.get/post/etc` de `apiClient.ts`
2. Verificar que el access token está en memory
3. Verificar logs en consola

### Problema: Usuario no persiste al recargar

**Causa:** El `loadUser()` no se está ejecutando

**Solución:**
1. Verificar que `AuthProvider` está en el layout
2. Verificar que el `useEffect` se ejecuta
3. Verificar que el refresh token existe en cookies

## 📝 Notas Importantes

1. **No usar localStorage para tokens** - Todo está en memory o cookies HttpOnly

2. **Access token en memory** - Se pierde al recargar, pero se renueva automáticamente

3. **Refresh token en cookie** - Persiste entre recargas y sesiones

4. **Middleware solo verifica presencia** - La verificación real de rol se hace en componentes

5. **TODO: Implementar GET /auth/me** - Actualmente se decodifica el token en frontend, mejor tener endpoint dedicado

## 🚀 Próximos Pasos

1. **Implementar GET /auth/me en backend**
   - Retorna datos completos del usuario actual
   - Más seguro que decodificar token en frontend

2. **Mejorar middleware**
   - Verificar rol de usuario en servidor
   - Mejor manejo de redirecciones

3. **Agregar rate limiting**
   - Proteger endpoints de auth contra brute force

4. **Implementar "Remember me"**
   - Refresh token con duración más larga

5. **Agregar 2FA (opcional)**
   - Autenticación de dos factores

6. **Mejorar manejo de errores**
   - Mensajes más específicos
   - Logging de errores

## 📚 Referencias

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [HttpOnly Cookies](https://owasp.org/www-community/HttpOnly)
