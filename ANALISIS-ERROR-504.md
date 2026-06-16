# Análisis del Error 504 (Gateway Timeout)

## Problema Identificado

El frontend está recibiendo **error 504 (Gateway Timeout)** al cargar el sitio. La causa raíz es un **problema de configuración de URLs** cuando se ejecuta en Docker.

---

## 📋 Configuración Actual

### 1. **Archivo `.env.local`** (web/)
```
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### 2. **Archivos que usan esta variable:**
- `lib/api.ts` - Línea 3
- `lib/apiClient.ts` - Línea 7  
- `lib/mediaApi.ts` - Línea 8

Todas usan:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
```

### 3. **Páginas que hacen llamadas al backend:**
- `app/page.tsx` - **Server Component** (ejecuta en el servidor)
  ```typescript
  export default async function HomePage() {
    const products = await fetchProducts(); // ❌ Llamada desde servidor
  }
  ```
- `app/product/[slug]/page.tsx` - Cliente

### 4. **Configuración en Docker Compose** (docker-compose.prod.yml)
```yaml
# Backend
api:
  ports:
    - "3002:3002"  # Puerto 3002

# Frontend  
web:
  environment:
    NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:3002}
  ports:
    - "3000:3000"
```

---

## 🔴 ¿Por qué falla?

### En Desarrollo Local: ✅ Funciona
- Frontend en `localhost:3000`
- Backend en `localhost:3002`
- Ambos están en la máquina local
- `localhost` se refiere a la misma máquina

### En Docker: ❌ **FALLA con 504**
- Frontend corre en **contenedor web**
- Backend corre en **contenedor api** 
- Cuando el frontend intenta conectar a `http://localhost:3002`:
  - `localhost` dentro del contenedor web se refiere **solo al contenedor web**
  - NO puede alcanzar el contenedor api
  - **Timeout después de 60 segundos = Error 504**

### El flujo que causa el error:
1. Cliente accede a `http://localhost:3000/`
2. Next.js (servidor) renderiza `page.tsx`
3. Se ejecuta `await fetchProducts()`
4. Intenta conectar a `http://localhost:3002`
5. ❌ No hay servicio en `localhost:3002` dentro del contenedor
6. Espera 60 segundos sin respuesta
7. ⚠️ **Error 504 Gateway Timeout**

---

## ✅ Soluciones

### Opción 1: Usar el nombre del servicio en Docker (RECOMENDADO)

**Modificar `lib/api.ts`, `lib/apiClient.ts` y `lib/mediaApi.ts`:**

```typescript
// Detectar si estamos en Docker (variable de entorno)
const API_URL = (() => {
  const env = process.env.NEXT_PUBLIC_API_URL;
  
  // En servidor (Next.js SSR/SSG)
  if (typeof window === 'undefined') {
    // Usar nombre del servicio para Docker
    if (process.env.NODE_ENV === 'production') {
      return 'http://api:3002'; // ← Usa el nombre del servicio Docker
    }
  }
  
  // En cliente o desarrollo
  return env || 'http://localhost:3002';
})();
```

**O más simple: Usar variable de entorno específica para servidor**

En `docker-compose.prod.yml`:
```yaml
web:
  environment:
    NODE_ENV: production
    NEXT_PUBLIC_API_URL: http://localhost:3002  # Para cliente
    API_URL_INTERNAL: http://api:3002          # Para servidor
```

Luego en `lib/api.ts`:
```typescript
// Cuando se ejecuta en servidor (Node.js), usar URL interna
// Cuando se ejecuta en cliente (navegador), usar URL pública
const API_URL = typeof window === 'undefined' 
  ? (process.env.API_URL_INTERNAL || 'http://api:3002')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002');
```

### Opción 2: Usar proxy reverso (Nginx)

Ya tienen configurado Nginx en `docker-compose.prod.yml`, se puede usar para:
```nginx
# En nginx.conf
location /api {
  proxy_pass http://api:3002;
}
```

Entonces el frontend solo conectaría a `/api` en lugar de una URL externa.

### Opción 3: Usar rewrites en Next.js

En `next.config.ts`:
```typescript
async rewrites() {
  return {
    beforeFiles: [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'http://api:3002/:path*'
          : 'http://localhost:3002/:path*',
      },
    ],
  };
},
```

---

## 📌 Recomendación

**Usar la Opción 1** (variable `API_URL_INTERNAL`) porque:
- ✅ Simple de implementar
- ✅ No requiere cambios en el middleware
- ✅ Funciona en desarrollo y producción
- ✅ Sigue la práctica estándar de Next.js
- ✅ Compatible con SSR/SSG

---

## 🔧 Archivos que necesitan cambios

1. **web/lib/api.ts** - Añadir lógica condicional para URL
2. **web/lib/apiClient.ts** - Ídem
3. **web/lib/mediaApi.ts** - Ídem
4. **docker-compose.prod.yml** - Añadir `API_URL_INTERNAL`
5. **web/.env.local** - Verificar que esté correcto (OK)

---

## 🧪 Verificación

Después de los cambios:

### En desarrollo:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3002 npm run dev
# Debe conectar a http://localhost:3002
```

### En Docker:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
# Debe conectar a http://api:3002 (desde el contenedor)
# Y a http://localhost:3002 (desde el navegador cliente)
```

---

## 🎯 Resumen

| Contexto | Problema | Solución |
|----------|----------|----------|
| **Servidor Next.js en Docker** | No puede alcanzar `localhost:3002` | Usar `http://api:3002` |
| **Cliente en navegador** | Necesita `localhost` para conectar | Usar `http://localhost:3002` |
| **Desarrollo local** | `localhost` funciona siempre | No cambiar |
