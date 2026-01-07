# Corrección de Búsqueda en Panel Admin - Productos

## 📋 PROBLEMA IDENTIFICADO

La barra de búsqueda en el panel admin de productos estaba trabada porque:
- Se ejecutaba `getProducts()` en cada tecla presionada
- El `useEffect` dependía directamente de `search`
- Causaba re-renders masivos y llamadas API excesivas
- La experiencia de escritura era lenta y entrecortada

## ✅ SOLUCIÓN IMPLEMENTADA

Se implementó **debounce de 300ms** usando hooks nativos de React (sin dependencias externas).

### Cambios Realizados en `web/app/admin/products/page.tsx`

#### 1. Imports Actualizados
```typescript
// Agregado: useCallback, useRef
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
```

#### 2. Nuevos Estados y Referencias
```typescript
const [search, setSearch] = useState("");                    // Input del usuario (inmediato)
const [debouncedSearch, setDebouncedSearch] = useState("");  // Valor con debounce (300ms)
const debounceTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer para debounce
```

#### 3. Implementación de Debounce
```typescript
// Debounce para la búsqueda (300ms)
useEffect(() => {
  if (debounceTimerRef.current) {
    clearTimeout(debounceTimerRef.current);
  }

  debounceTimerRef.current = setTimeout(() => {
    setDebouncedSearch(search);
  }, 300);

  return () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };
}, [search]);
```

#### 4. LoadData Optimizado
```typescript
// Ahora usa debouncedSearch en lugar de search
const loadData = useCallback(async () => {
  try {
    setLoading(true);
    const [productsData, categoriesData] = await Promise.all([
      getProducts({ search: debouncedSearch, category: categoryFilter }),
      getCategories(),
    ]);
    setProducts(productsData);
    setCategories(categoriesData);
  } catch (err) {
    console.error("Error cargando datos:", err);
    showToast("Error al cargar datos", "error");
  } finally {
    setLoading(false);
  }
}, [debouncedSearch, categoryFilter]);
```

#### 5. Reset de Paginación Actualizado
```typescript
// Ahora depende de debouncedSearch en lugar de search
useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearch, categoryFilter]);
```

## 🎯 CÓMO FUNCIONA AHORA

### Flujo de Búsqueda

```
Usuario escribe "limpiador"
  ↓
l → search = "l" (inmediato, sin API call)
  ↓
li → search = "li" (inmediato, sin API call)
  ↓
lim → search = "lim" (inmediato, sin API call)
  ↓
... (usuario sigue escribiendo)
  ↓
limpiador → search = "limpiador" (inmediato, sin API call)
  ↓
[Usuario deja de escribir]
  ↓
[Espera 300ms]
  ↓
debouncedSearch = "limpiador" → Trigger API call
  ↓
getProducts({ search: "limpiador" })
  ↓
Tabla actualizada con resultados
```

### Ventajas

1. **Input fluido**: El usuario puede escribir sin lag
2. **Menos llamadas API**: Solo 1 llamada después de terminar de escribir
3. **Mejor rendimiento**: No hay re-renders masivos
4. **Experiencia mejorada**: Búsqueda rápida y responsiva
5. **Sin dependencias**: Usa solo hooks nativos de React

## 📊 COMPARACIÓN

### Antes (Sin Debounce)
```
Usuario escribe "limpiador" (9 letras)
→ 9 llamadas API
→ 9 re-renders de la tabla
→ Input trabado
→ Experiencia lenta
```

### Después (Con Debounce 300ms)
```
Usuario escribe "limpiador" (9 letras)
→ 1 llamada API (después de 300ms de inactividad)
→ 1 re-render de la tabla
→ Input fluido
→ Experiencia rápida
```

## 🔧 CONFIGURACIÓN

El tiempo de debounce está configurado en **300ms**, que es un buen balance entre:
- Responsividad (no muy lento)
- Eficiencia (no demasiadas llamadas)

Si necesitas ajustarlo:
```typescript
debounceTimerRef.current = setTimeout(() => {
  setDebouncedSearch(search);
}, 300); // ← Cambiar este valor (en milisegundos)
```

Valores recomendados:
- **200ms**: Más rápido, más llamadas API
- **300ms**: Balance ideal (actual)
- **500ms**: Más lento, menos llamadas API

## ✅ VERIFICACIÓN

- ✅ Input responde inmediatamente al escribir
- ✅ API se llama solo después de 300ms de inactividad
- ✅ No hay lag al escribir
- ✅ Tabla se actualiza correctamente
- ✅ Paginación se resetea correctamente
- ✅ Sin errores de TypeScript
- ✅ Sin dependencias externas (lodash no necesario)

## 📝 NOTAS TÉCNICAS

### ¿Por qué useRef para el timer?
- `useRef` persiste entre re-renders
- No causa re-renders cuando cambia
- Perfecto para almacenar timers

### ¿Por qué useCallback para loadData?
- Evita recrear la función en cada render
- Mejora el rendimiento
- Necesario para el useEffect que depende de ella

### Cleanup del Timer
```typescript
return () => {
  if (debounceTimerRef.current) {
    clearTimeout(debounceTimerRef.current);
  }
};
```
Esto asegura que:
- Se cancele el timer anterior si el usuario sigue escribiendo
- Se limpie el timer cuando el componente se desmonte
- No haya memory leaks

## 🎯 RESULTADO FINAL

**Búsqueda en productos ahora es:**
- ✅ Fluida y rápida al escribir
- ✅ Eficiente (1 API call por búsqueda)
- ✅ Sin lag ni trabas
- ✅ Mejor experiencia de usuario
- ✅ Código limpio y mantenible

---

**Estado**: ✅ COMPLETADO
**Archivo modificado**: `web/app/admin/products/page.tsx`
**Tiempo de debounce**: 300ms
**Dependencias agregadas**: Ninguna (solo hooks nativos)
