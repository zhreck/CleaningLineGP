# Quick Start - Autenticación Real

## 🚀 Inicio Rápido

### 1. Iniciar Backend
```bash
cd app/api
npm run start:dev
```

### 2. Ejecutar Seed (primera vez)
```bash
# PowerShell
Invoke-WebRequest -Uri http://localhost:3001/seed -Method GET

# O con curl
curl http://localhost:3001/seed
```

### 3. Iniciar Frontend
```bash
cd web
npm run dev
```

### 4. Abrir en Navegador
```
http://localhost:3000
```

## 👤 Credenciales de Prueba

### Usuario Regular
- **Email:** `user@test.com`
- **Password:** `User123!`

### Usuario Admin
- **Email:** `admin@test.com`
- **Password:** `Admin123!`

### Usuario 2
- **Email:** `user2@test.com`
- **Password:** `User123!`

## ✅ Verificación Rápida

### 1. Login
```
1. Ir a http://localhost:3000/auth/login
2. Usar: user@test.com / User123!
3. ✓ Debe redirigir a /profile
4. ✓ Navbar debe mostrar usuario
```

### 2. Navbar
```
1. ✓ Debe mostrar email del usuario
2. ✓ Debe mostrar dropdown al hacer click
3. ✓ Dropdown debe tener "Mi perfil" y "Cerrar sesión"
4. ✓ Si es admin, debe mostrar "Panel de admin"
```

### 3. Profile
```
1. Ir a http://localhost:3000/profile
2. ✓ Debe mostrar email, ID y roles
3. ✓ Botón "Cerrar sesión" debe funcionar
```

### 4. Admin (solo con admin@test.com)
```
1. Login con admin@test.com / Admin123!
2. Ir a http://localhost:3000/admin
3. ✓ Debe permitir acceso
4. ✓ Debe mostrar dashboard
```

### 5. Logout
```
1. Click en dropdown de usuario
2. Click en "Cerrar sesión"
3. ✓ Debe redirigir a /
4. ✓ Navbar debe mostrar "Iniciar sesión"
```

### 6. Persistencia
```
1. Login con cualquier usuario
2. Recargar página (F5)
3. ✓ Sesión debe persistir
4. ✓ Usuario debe seguir logueado
```

## 🐛 Troubleshooting Rápido

### Backend no inicia
```bash
# Verificar que PostgreSQL está corriendo
# Verificar variables de entorno en .env
cd app/api
npm install
npm run start:dev
```

### Frontend no inicia
```bash
cd web
npm install
npm run dev
```

### "Cannot connect to backend"
```
1. Verificar que backend está en http://localhost:3001
2. Verificar CORS en backend (debe permitir localhost:3000)
3. Verificar que seed se ejecutó correctamente
```

### "Session expired" constante
```
1. Limpiar cookies del navegador
2. Hacer logout
3. Hacer login de nuevo
4. Verificar que backend está configurando cookies correctamente
```

### Usuario no aparece en navbar
```
1. Abrir DevTools → Console
2. Buscar errores
3. Verificar que AuthProvider está en layout.tsx
4. Verificar que backend responde correctamente en /auth/refresh
```

## 📝 Archivos Importantes

### Frontend
- `web/contexts/AuthContext.tsx` - Contexto de autenticación
- `web/lib/apiClient.ts` - Cliente HTTP con tokens
- `web/middleware.ts` - Protección de rutas
- `web/components/navbar/navbar.tsx` - Navbar con usuario

### Backend
- `app/api/src/auth/auth.controller.ts` - Endpoints de auth
- `app/api/src/auth/auth.service.ts` - Lógica de auth
- `app/api/src/auth/strategies/jwt.strategy.ts` - Estrategia JWT

### Documentación
- `docs/AUTH-INTEGRATION.md` - Guía completa
- `docs/FRONTEND-COMPLETE-ANALYSIS.md` - Análisis del frontend
- `docs/IMPLEMENTATION-SUMMARY.md` - Resumen de implementación

## 🎯 Próximos Pasos

Después de verificar que la autenticación funciona:

1. **Integrar Carrito con Backend**
2. **Implementar Checkout**
3. **Gestión de Órdenes**
4. **Completar Admin Panel**

Ver `docs/IMPLEMENTATION-SUMMARY.md` para más detalles.

## 💬 Soporte

Si encuentras problemas:
1. Revisar `docs/AUTH-INTEGRATION.md` sección Troubleshooting
2. Verificar logs del backend
3. Verificar console del navegador
4. Verificar que todas las dependencias están instaladas
