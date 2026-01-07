/**
 * Script de prueba automática del flujo completo de checkout
 * Simula el proceso completo desde agregar productos hasta Webpay
 */

const API_BASE_URL = "http://localhost:3001";
const FRONTEND_URL = "http://localhost:3000";

// Función para hacer peticiones HTTP
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`❌ Error en ${url}:`, error.message);
        throw error;
    }
}

// Función para verificar que los servicios estén corriendo
async function checkServices() {
    console.log('🔍 Verificando servicios...');

    try {
        // Verificar backend
        await makeRequest(`${API_BASE_URL}/products`);
        console.log('✅ Backend corriendo en', API_BASE_URL);

        // Verificar frontend
        const frontendResponse = await fetch(FRONTEND_URL);
        if (frontendResponse.ok) {
            console.log('✅ Frontend corriendo en', FRONTEND_URL);
        }
    } catch (error) {
        console.error('❌ Error verificando servicios:', error.message);
        throw error;
    }
}

// Función para obtener productos
async function getProducts() {
    console.log('📦 Obteniendo productos...');
    const products = await makeRequest(`${API_BASE_URL}/products`);
    console.log(`✅ Encontrados ${products.length} productos`);
    return products;
}

// Función para simular agregar al carrito (invitado)
async function simulateGuestCart(products) {
    console.log('🛒 Simulando carrito de invitado...');

    // Tomar los primeros 2 productos
    const selectedProducts = products.slice(0, 2);
    const cartItems = selectedProducts.map(product => ({
        productId: product.id,
        quantity: Math.floor(Math.random() * 3) + 1, // 1-3 items
        price: product.price,
        name: product.name
    }));

    console.log('✅ Carrito simulado:', cartItems.map(item =>
        `${item.name} x${item.quantity} = $${(item.price * item.quantity).toLocaleString('es-CL')}`
    ));

    return cartItems;
}

// Función para crear orden de checkout invitado
async function createGuestOrder(cartItems) {
    console.log('📝 Creando orden de checkout invitado...');

    const orderData = {
        deliveryType: 'delivery',
        customerName: 'Juan Pérez Test',
        customerEmail: 'juan.test@example.com',
        customerPhone: '+56912345678',
        customerAddress: 'Av. Test 1234',
        customerRegion: 'Región Metropolitana',
        customerCommune: 'Santiago',
        notes: 'Orden de prueba automática',
        items: cartItems
    };

    const order = await makeRequest(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        body: JSON.stringify(orderData)
    });

    console.log('✅ Orden creada:', {
        id: order.id,
        total: `$${order.total.toLocaleString('es-CL')}`,
        items: order.items.length
    });

    return order;
}

// Función para crear transacción Webpay
async function createWebpayTransaction(orderId) {
    console.log('💳 Creando transacción Webpay...');

    const webpayData = await makeRequest(`${API_BASE_URL}/payments/webpay/create`, {
        method: 'POST',
        body: JSON.stringify({ orderId })
    });

    console.log('✅ Transacción Webpay creada:', {
        url: webpayData.data.url,
        token: webpayData.data.token.substring(0, 20) + '...',
        amount: `$${webpayData.data.amount.toLocaleString('es-CL')}`
    });

    return webpayData.data;
}

// Función principal de prueba
async function runCompleteTest() {
    console.log('🚀 Iniciando prueba completa del flujo de checkout...\n');

    try {
        // 1. Verificar servicios
        await checkServices();
        console.log('');

        // 2. Obtener productos
        const products = await getProducts();
        console.log('');

        // 3. Simular carrito de invitado
        const cartItems = await simulateGuestCart(products);
        console.log('');

        // 4. Crear orden
        const order = await createGuestOrder(cartItems);
        console.log('');

        // 5. Crear transacción Webpay
        const webpayData = await createWebpayTransaction(order.id);
        console.log('');

        // 6. Mostrar resultado final
        console.log('🎉 ¡PRUEBA COMPLETADA EXITOSAMENTE!');
        console.log('');
        console.log('📊 Resumen:');
        console.log(`   • Orden ID: ${order.id}`);
        console.log(`   • Total: $${order.total.toLocaleString('es-CL')}`);
        console.log(`   • Items: ${order.items.length}`);
        console.log(`   • Webpay URL: ${webpayData.url}`);
        console.log('');
        console.log('🔗 Para probar Webpay, visita:');
        console.log(`   ${webpayData.url}?token_ws=${webpayData.token}`);
        console.log('');
        console.log('✅ El flujo completo funciona correctamente!');

    } catch (error) {
        console.log('');
        console.log('❌ PRUEBA FALLIDA');
        console.log('Error:', error.message);
        console.log('');
        console.log('🔧 Verifica que:');
        console.log('   • Backend esté corriendo en puerto 3001');
        console.log('   • Frontend esté corriendo en puerto 3000');
        console.log('   • PostgreSQL esté corriendo');
        console.log('   • Redis esté corriendo');
        process.exit(1);
    }
}

// Ejecutar prueba
runCompleteTest();