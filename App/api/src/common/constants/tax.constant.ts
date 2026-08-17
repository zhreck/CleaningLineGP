// Tasa de impuestos aplicada de forma consistente al carrito, las órdenes y
// el monto cobrado en Webpay. Cambiar solo aquí evita que estos tres queden
// desincronizados (como ocurría antes: el carrito mostraba el total con IVA
// pero la orden/Webpay se creaban con el subtotal sin IVA).
export const TAX_RATE = 0.1;
