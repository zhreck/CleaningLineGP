# Correcciones del Backend - Autenticación

## Problemas Encontrados y Solucionados

### 1. Código Duplicado en main.ts
**Problema:** Había código duplicado para iniciar el servidor en dos puertos diferentes.

**Solución:** Eliminado código duplicado, dejando solo el puerto 3001.

### 2. Relación Duplicada en Product Entity
**Problema:** La entidad Product tenía la relación `category` definida dos veces.

**Solución:** Eliminada la relación duplicada, dejando solo una con tipo `Category | null`.

### 3. Endpoints de Autenticación Faltantes
**Problema:** El AuthController solo tenía el endpoint `/auth/login`.

**Solución:** Agregados todos los endpoints necesarios:
- ✅ POST /auth/login
- ✅ POST /auth/register
- ✅ POST /auth/logout
- ✅ POST /auth/refresh

### 4. AuthService Incompleto
**Problema:** El AuthService solo tenía el método `login()`.

**Solución:** Implementados todos los métodos:
- ✅ `login()` - Con generación de access y refresh tokens
- ✅ `register()` - Con validación de email duplicado
- ✅ `logout()` - Con limpieza de refresh token
- ✅ `refresh()` - Con renovación de access token

### 5. DTO de Registro Faltante
**Problema:** No existía el DTO para el registro.

**Solución:** Creado `RegisterDto` con validaciones:
```typescript
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

### 6. Campo hashedRefreshToken Faltante
**Problema:** La entidad User no tenía el campo para guardar el refresh token.

**Solución:** Agregado campo `hashedRefreshToken` a la entidad User:
```typescript
@Column({ name: 'hashed_refresh_token', type: 'varchar', length: 255, nullable: true, select: false })
hashedRefreshToken?: string | null;
```

### 7. JwtPayload con Campo Incorrecto
**Problema:** La interfaz JwtPayload usaba `id` en lugar del estándar `sub`.

**Solución:** Actualizada interfaz para usar `sub`:
```typescript
export interface JwtPayload {
  sub: number; // ID del usuario (estándar JWT)
  email: string;
  roles: Role[];
}
```

### 8. JwtStrategy con Campo Incorrecto
**Problema:** La estrategia JWT buscaba `payload.id` en lugar de `payload.sub`.

**Solución:** Actualizada para usar `payload.sub`.

### 9. Imports de Express Incorrectos
**Problema:** TypeScript requería `import type` para tipos de Express.

**Solución:** Cambiados imports a `import type { Response, Request } from 'express'`.

## Estado Actual

### ✅ Backend Funcionando Correctamente

**Endpoints Disponibles:**
```
POST /auth/login      - Login con email/password
POST /auth/register   - Registro de nuevos usuarios
POST /auth/logout     - Logout con limpieza de tokens
POST /auth/refresh    - Renovación de access token
GET  /products        - Listar productos
POST /cart            - Agregar al carrito
GET  /cart            - Obtener carrito
... (otros endpoints)
```

**Puerto:** http://localhost:3001

**CORS:** Configurado para permitir http://localhost:3000

**Cookies:** HttpOnly habilitadas para refresh tokens

## Prueba de Funcionamiento

### Login Exitoso
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'

# Respuesta:
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
# + Cookie: refreshToken=xyz; HttpOnly
```

### Registro Exitoso
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"Test123!"}'

# Respuesta:
{
  "id": 16,
  "email": "newuser@test.com",
  "roles": ["user"]
}
```

## Próximos Pasos

1. ✅ Backend funcionando
2. ⏳ Frontend necesita reiniciarse para conectarse
3. ⏳ Probar flujo completo de autenticación
4. ⏳ Verificar que cookies HttpOnly funcionan correctamente

## Notas

- El backend está corriendo en http://localhost:3001
- CORS está configurado para http://localhost:3000
- Los usuarios ya existen en la base de datos (admin@test.com, user@test.com)
- Las contraseñas se hashean automáticamente en la entidad User
- Los refresh tokens se guardan hasheados en la base de datos
