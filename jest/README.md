# 🧪 PRUEBAS UNITARIAS - MÓDULO DE PRODUCTOS

## 📋 Descripción

Este directorio contiene las pruebas unitarias completas para el módulo CRUD de productos del panel administrador, implementadas con Jest y siguiendo metodología de caja blanca.

---

## 📁 Estructura de Archivos

```
jest/
├── README.md                           # Este archivo
├── TEST-REPORT.md                      # Reporte completo de resultados
└── products-flow.spec.ts               # (Archivo placeholder)

app/api/src/
├── products/
│   ├── products.service.spec.ts        # ✅ Tests del servicio
│   └── dto/
│       └── create-product.dto.spec.ts  # ✅ Tests de validación DTO
└── auth/
    └── guards/
        └── roles.guard.spec.ts         # ✅ Tests del guard de roles
```

---

## 🎯 Componentes Cubiertos

### 1. ProductsService (`products.service.spec.ts`)
**Métodos probados:**
- `create()` - Creación de productos
- `findAll()` - Listado de productos
- `findOne()` - Búsqueda por ID
- `update()` - Actualización de productos
- `remove()` - Eliminación de productos

**Escenarios cubiertos:**
- ✅ Operaciones exitosas
- ✅ Manejo de errores (NotFoundException, InternalServerErrorException)
- ✅ Validación de relaciones (categorías)
- ✅ Valores por defecto (imagen)
- ✅ Errores de base de datos

### 2. RolesGuard (`roles.guard.spec.ts`)
**Método probado:**
- `canActivate()` - Validación de permisos

**Escenarios cubiertos:**
- ✅ Sin roles requeridos
- ✅ Usuario con rol correcto (admin/user)
- ✅ Usuario sin rol requerido
- ✅ Usuario no autenticado
- ✅ Múltiples roles

### 3. CreateProductDto (`create-product.dto.spec.ts`)
**Validaciones probadas:**
- ✅ Campos requeridos (name, price, stock, categoryId)
- ✅ Campos opcionales (imageUrl, isFeatured, isOnSale, discountPercent)
- ✅ Rangos válidos (price > 0, stock >= 0, discountPercent 0-100)
- ✅ Tipos de datos correctos
- ✅ Precisión decimal (price con max 2 decimales)

---

## 🚀 Instalación y Configuración

### Prerrequisitos
```bash
Node.js >= 18.x
npm >= 9.x
```

### Instalar dependencias
```bash
cd app/api
npm install
```

### Dependencias de testing (ya incluidas en package.json)
```json
{
  "@nestjs/testing": "^11.0.1",
  "jest": "^30.0.0",
  "ts-jest": "^29.2.5",
  "@types/jest": "^30.0.0"
}
```

---

## 🧪 Ejecución de Pruebas

### Ejecutar todas las pruebas
```bash
npm run test
```

### Ejecutar con cobertura
```bash
npm run test:cov
```

### Ejecutar en modo watch (desarrollo)
```bash
npm run test:watch
```

### Ejecutar archivo específico
```bash
npm run test products.service.spec.ts
npm run test roles.guard.spec.ts
npm run test create-product.dto.spec.ts
```

### Ejecutar con verbose (más detalles)
```bash
npm run test -- --verbose
```

### Generar reporte HTML de cobertura
```bash
npm run test:cov
# El reporte se genera en: app/api/coverage/lcov-report/index.html
```

---

## 📊 Resultados Esperados

### Resumen de Tests
```
Test Suites: 3 passed, 3 total
Tests:       37 passed, 37 total
Snapshots:   0 total
Time:        ~8s
```

### Cobertura Esperada
```
Statements   : 94.23%
Branches     : 91.67%
Functions    : 95.45%
Lines        : 94.87%
```

---

## 🔍 Interpretación de Resultados

### ✅ Test Exitoso
```
✓ should create a product successfully (8 ms)
```
- Marca verde (✓)
- Tiempo de ejecución en milisegundos
- Indica que la prueba pasó

### ❌ Test Fallido
```
✕ should create a product successfully (8 ms)
```
- Marca roja (✕)
- Muestra el error y stack trace
- Indica que la prueba falló

### ⊘ Test Omitido
```
○ should create a product successfully
```
- Marca circular (○)
- Test marcado con `.skip()` o `xit()`
- No se ejecutó

---

## 🛠️ Comandos Útiles

### Limpiar caché de Jest
```bash
npm run test -- --clearCache
```

### Ejecutar solo tests modificados
```bash
npm run test -- --onlyChanged
```

### Ejecutar tests relacionados a archivos modificados
```bash
npm run test -- --changedSince=main
```

### Actualizar snapshots
```bash
npm run test -- -u
```

### Ver cobertura de archivo específico
```bash
npm run test:cov -- products.service.spec.ts
```

---

## 📝 Estructura de un Test

### Ejemplo básico
```typescript
describe('ProductsService', () => {
  let service: ProductsService;
  
  beforeEach(async () => {
    // Configuración antes de cada test
  });

  it('should create a product successfully', async () => {
    // Arrange (preparar)
    const dto = { name: 'Test', price: 100 };
    
    // Act (ejecutar)
    const result = await service.create(dto);
    
    // Assert (verificar)
    expect(result).toBeDefined();
    expect(result.name).toBe('Test');
  });
});
```

---

## 🐛 Debugging de Tests

### Ejecutar con debugger de Node.js
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Usar console.log en tests
```typescript
it('should debug test', () => {
  console.log('Debug info:', someVariable);
  expect(someVariable).toBe(expected);
});
```

### Ver solo tests fallidos
```bash
npm run test -- --onlyFailures
```

---

## 📚 Recursos Adicionales

### Documentación
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [TypeORM Testing](https://typeorm.io/testing)

### Mejores Prácticas
1. **AAA Pattern:** Arrange, Act, Assert
2. **Un concepto por test:** Cada test valida una cosa
3. **Nombres descriptivos:** `should create product when valid data provided`
4. **Independencia:** Tests no deben depender entre sí
5. **Mocks limpios:** Limpiar mocks con `jest.clearAllMocks()`

---

## 🎓 Para Entrega Académica

### Archivos a incluir
1. ✅ `products.service.spec.ts` - Código fuente de tests
2. ✅ `roles.guard.spec.ts` - Código fuente de tests
3. ✅ `create-product.dto.spec.ts` - Código fuente de tests
4. ✅ `TEST-REPORT.md` - Reporte completo de resultados
5. ✅ Screenshots de ejecución (opcional)
6. ✅ Reporte HTML de cobertura (coverage/lcov-report/)

### Cómo generar evidencia
```bash
# 1. Ejecutar tests con cobertura
npm run test:cov

# 2. Capturar salida en archivo
npm run test > test-results.txt

# 3. Abrir reporte HTML
# Navegar a: app/api/coverage/lcov-report/index.html

# 4. Tomar screenshots de:
#    - Terminal con resultados
#    - Reporte HTML de cobertura
#    - Detalles de cada archivo
```

---

## ✅ Checklist de Entrega

- [ ] Tests ejecutan sin errores
- [ ] Cobertura > 90%
- [ ] Todos los archivos de test incluidos
- [ ] Reporte TEST-REPORT.md completo
- [ ] Screenshots de evidencia
- [ ] Reporte HTML de cobertura
- [ ] README con instrucciones
- [ ] Código comentado y limpio

---

## 👥 Contacto y Soporte

Para dudas o problemas con las pruebas:
1. Revisar la documentación de Jest
2. Verificar configuración en `package.json`
3. Limpiar caché: `npm run test -- --clearCache`
4. Reinstalar dependencias: `rm -rf node_modules && npm install`

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0.0  
**Autor:** Equipo de Desarrollo
