# 💳 DATOS DE PRUEBA WEBPAY PLUS
## Ambiente de Integración Transbank

---

## 🎯 **TARJETAS DE PRUEBA**

### **✅ TRANSACCIÓN APROBADA**

#### **Tarjeta Redcompra (Débito):**
```
Número de tarjeta: 4051 8856 0000 0002
RUT:               11.111.111-1
Contraseña:        123
```

#### **Tarjeta de Crédito Visa:**
```
Número de tarjeta: 4051 8842 3993 7763
CVV:               123
Fecha vencimiento: Cualquier fecha futura (ej: 12/25)
```

#### **Tarjeta de Crédito Mastercard:**
```
Número de tarjeta: 5186 0595 9547 0371
CVV:               123
Fecha vencimiento: Cualquier fecha futura (ej: 12/25)
```

---

### **❌ TRANSACCIÓN RECHAZADA**

#### **Tarjeta Redcompra (Débito) - RECHAZADA:**
```
Número de tarjeta: 5186 0000 0000 0001
RUT:               11.111.111-1
Contraseña:        123
```

#### **Tarjeta de Crédito - RECHAZADA:**
```
Número de tarjeta: 4051 8842 3993 7763
CVV:               123
Fecha vencimiento: Cualquier fecha futura
(Seleccionar "Rechazar" en la pantalla de confirmación)
```

---

## � **DAATOS ADICIONALES PARA PRUEBAS**

### **RUT de Prueba:**
```
11.111.111-1
```

### **Contraseña Redcompra:**
```
123
```

### **CVV (Tarjetas de Crédito):**
```
123
```

### **Fecha de Vencimiento:**
```
Cualquier fecha futura
Ejemplo: 12/25, 01/26, 06/27
```

---

## 📋 **FLUJO DE PRUEBA COMPLETO**

### **OPCIÓN 1: Débito (Redcompra) - APROBADA**

1. **Seleccionar:** "Pagar con Redcompra"
2. **Ingresar tarjeta:** `4051 8856 0000 0002`
3. **Ingresar RUT:** `11.111.111-1`
4. **Ingresar contraseña:** `123`
5. **Confirmar:** Hacer clic en "Aceptar"
6. **Resultado:** ✅ Transacción APROBADA

### **OPCIÓN 2: Crédito (Visa/Mastercard) - APROBADA**

1. **Seleccionar:** "Pagar con tarjeta de crédito"
2. **Ingresar tarjeta:** `4051 8842 3993 7763` (Visa)
3. **Ingresar CVV:** `123`
4. **Ingresar vencimiento:** `12/25`
5. **Seleccionar cuotas:** 1 cuota (sin interés)
6. **Confirmar:** Hacer clic en "Aceptar"
7. **Resultado:** ✅ Transacción APROBADA

### **OPCIÓN 3: Transacción RECHAZADA (para probar errores)**

1. **Seleccionar:** "Pagar con Redcompra"
2. **Ingresar tarjeta:** `5186 0000 0000 0001`
3. **Ingresar RUT:** `11.111.111-1`
4. **Ingresar contraseña:** `123`
5. **Confirmar:** Hacer clic en "Aceptar"
6. **Resultado:** ❌ Transacción RECHAZADA

---

## 🎬 **PANTALLAS DE WEBPAY**

### **1. Selección de Medio de Pago**
```
┌─────────────────────────────────────┐
│  Webpay Plus - Transbank            │
├─────────────────────────────────────┤
│  Monto: $XX.XXX                     │
│  Orden: ORDER-XXX                   │
├─────────────────────────────────────┤
│  ○ Redcompra (Débito)               │
│  ○ Tarjeta de Crédito               │
│                                     │
│  [Continuar]                        │
└─────────────────────────────────────┘
```

### **2. Ingreso de Datos (Redcompra)**
```
┌─────────────────────────────────────┐
│  Redcompra                          │
├─────────────────────────────────────┤
│  Número de tarjeta:                 │
│  [4051 8856 0000 0002]              │
│                                     │
│  RUT:                               │
│  [11.111.111-1]                     │
│                                     │
│  Contraseña:                        │
│  [***]                              │
│                                     │
│  [Aceptar] [Cancelar]               │
└─────────────────────────────────────┘
```

### **3. Ingreso de Datos (Crédito)**
```
┌─────────────────────────────────────┐
│  Tarjeta de Crédito                 │
├─────────────────────────────────────┤
│  Número de tarjeta:                 │
│  [4051 8842 3993 7763]              │
│                                     │
│  CVV:                               │
│  [123]                              │
│                                     │
│  Vencimiento:                       │
│  [12] / [25]                        │
│                                     │
│  Cuotas:                            │
│  [1 cuota sin interés ▼]            │
│                                     │
│  [Aceptar] [Cancelar]               │
└─────────────────────────────────────┘
```

### **4. Confirmación**
```
┌─────────────────────────────────────┐
│  Confirmar Pago                     │
├─────────────────────────────────────┤
│  Monto:        $XX.XXX              │
│  Tarjeta:      **** **** **** 7763  │
│  Comercio:     Tu Tienda            │
│  Orden:        ORDER-XXX            │
│                                     │
│  [Confirmar] [Cancelar]             │
└─────────────────────────────────────┘
```

---

## ✅ **CÓDIGOS DE RESPUESTA**

### **Transacción Aprobada:**
```
Status: AUTHORIZED
Response Code: 0
Authorization Code: 1213 (ejemplo)
```

### **Transacción Rechazada:**
```
Status: REJECTED
Response Code: -1, -2, -3, etc.
```

---

## 🎓 **PARA TU ENTREGA ACADÉMICA**

### **Screenshots Recomendados:**

1. **Pantalla de checkout** (antes de pagar)
2. **Redirección a Webpay** (pantalla de selección)
3. **Ingreso de datos** (con tarjeta de prueba)
4. **Confirmación de pago** (antes de confirmar)
5. **Resultado exitoso** (página de retorno)

### **Datos para el Informe:**

```
Ambiente: Integración (Testing)
Comercio: 597055555532 (código de integración)
API Key: 579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
Tarjeta de prueba: 4051 8856 0000 0002 (Redcompra)
RUT: 11.111.111-1
Resultado: Transacción aprobada
Código de autorización: XXXX (generado por Webpay)
```

---

## 🔗 **ENLACES ÚTILES**

### **Documentación Oficial Transbank:**
- [Webpay Plus - Documentación](https://www.transbankdevelopers.cl/documentacion/webpay-plus)
- [Tarjetas de Prueba](https://www.transbankdevelopers.cl/documentacion/como_empezar#tarjetas-de-prueba)
- [Ambientes y Credenciales](https://www.transbankdevelopers.cl/documentacion/como_empezar#ambientes)

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Tarjeta inválida"**
✅ Verificar que estés usando las tarjetas de prueba exactas
✅ Copiar y pegar los números sin espacios

### **Error: "Transacción rechazada"**
✅ Esto es normal si usaste la tarjeta de rechazo
✅ Usar tarjeta `4051 8856 0000 0002` para aprobar

### **Error: "Timeout"**
✅ Verificar que el backend esté corriendo
✅ Verificar que la URL de retorno sea correcta

### **No redirige de vuelta**
✅ Verificar que `/payment/return` exista
✅ Verificar que el frontend esté en puerto 3000

---

## 🎉 **RESUMEN RÁPIDO**

**Para aprobar una transacción rápidamente:**

```
Tarjeta:    4051 8856 0000 0002
RUT:        11.111.111-1
Contraseña: 123
```

**O con crédito:**

```
Tarjeta:     4051 8842 3993 7763
CVV:         123
Vencimiento: 12/25
Cuotas:      1 (sin interés)
```

---

**Estado:** ✅ **DATOS DE PRUEBA OFICIALES**  
**Fuente:** Transbank Developers  
**Ambiente:** Integración (Testing)  
**Validez:** Permanente para ambiente de pruebas

¡Usa estos datos para completar tus pruebas y generar evidencias! 🎬💳✨