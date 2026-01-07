# Solución Rápida - "Failed to fetch"

## ✅ Backend Está Funcionando

El backend está corriendo correctamente en http://localhost:3001 con todos los endpoints de autenticación implementados.

## 🔧 Solución al Error "Failed to fetch"

### Paso 1: Verificar que el Frontend Esté Corriendo

```bash
# En una nueva terminal, ir a la carpeta web
cd web

# Instalar dependencias (si es necesario)
npm install

# Iniciar el frontend
npm run dev
```

El frontend debería iniciar en http://localhost:3000

### Paso 2: Verificar Variables de Entorno

Asegúrate de que existe el archivo `web/.env.local` con:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

### Paso 3: Reiniciar el Frontend

Si el frontend ya estaba corriendo, necesitas reiniciarlo para que tome las nuevas variables de entorno:

1. Detener el servidor (Ctrl+C)
2. Volver a iniciar: `npm run dev`

### Paso 4: Limpiar Caché del Navegador

1. Abrir DevTools (F12)
2. Ir a la pestaña "Application" o "Aplicación"
3. Limpiar:
   - Local Storage
   - Session Storage
   - Cookies
4. Recargar la página (Ctrl+Shift+R)

## 🧪 Probar el Login

### Credenciales de Prueba

**Admin:**
- Email: `admin@test.com`
- Password: `Admin123!`

**Usuario Regular:**
- Email: `user@test.com`
- Password: `User123!`

### Pasos:

1. Ir a http://localhost:3000/auth/login
2. Ingresar credenciales
3. Click en "Ingresar"
4. Deberías ser redirigido a /profile
5. El navbar debería mostrar tu email

## 🐛 Si Sigue Fallando

### Verificar en DevTools

1. Abrir DevTools (F12)
2. Ir a la pestaña "Network" o "Red"
3. Intentar hacer login
4. Buscar la request a `/auth/login`
5. Verificar:
   - ¿La URL es correcta? (http://localhost:3001/auth/login)
   - ¿Hay error de CORS?
   - ¿Qué error específico muestra?

### Verificar CORS

El backend ya está configurado para permitir http://localhost:3000. Si hay error de CORS, verifica que:

1. El frontend esté en http://localhost:3000 (no en otro puerto)
2. El backend esté en http://localhost:3001

### Verificar que el Backend Responde

Desde PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/auth/login" -Method POST -Body '{"email":"admin@test.com","password":"Admin123!"}' -ContentType "application/json"
```

Deberías ver:
```
access_token
------------
eyJhbGc...
```

## 📝 Checklist de Verificación

- [ ] Backend corriendo en http://localhost:3001
- [ ] Frontend corriendo en http://localhost:3000
- [ ] Archivo `.env.local` existe en carpeta `web/`
- [ ] Variables de entorno correctas
- [ ] Frontend reiniciado después de crear `.env.local`
- [ ] Caché del navegador limpiado
- [ ] DevTools abierto para ver errores

## 🎯 Resultado Esperado

Después de seguir estos pasos:

1. ✅ Login funciona
2. ✅ Navbar muestra usuario
3. ✅ Redirección a /profile funciona
4. ✅ Sesión persiste al recargar

## 💡 Nota Importante

El error "Failed to fetch" generalmente significa que:
- El frontend no puede conectarse al backend
- La URL del backend es incorrecta
- El backend no está corriendo
- Hay un problema de CORS

En tu caso, el backend SÍ está funcionando, así que el problema es que el frontend necesita:
1. Tener las variables de entorno correctas
2. Ser reiniciado para tomar esas variables
3. Estar corriendo en el puerto 3000
