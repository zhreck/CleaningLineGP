// Script rápido para probar que la aplicación responde correctamente
const { chromium } = require('playwright');

async function quickTest() {
    console.log('🔍 Verificando que la aplicación esté funcionando...');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Probar catálogo
        console.log('✅ Probando /catalogo...');
        await page.goto('http://localhost:3000/catalogo');
        await page.waitForLoadState('networkidle');

        const title = await page.locator('h1').textContent();
        console.log('📄 Título encontrado:', title);

        // Probar productos
        const products = await page.locator('article').count();
        console.log('🛍️  Productos encontrados:', products);

        if (products > 0) {
            console.log('✅ ¡Aplicación funcionando correctamente!');
            console.log('🚀 Puedes ejecutar los tests de evidencia');
        } else {
            console.log('⚠️  No se encontraron productos. Verifica que el backend esté corriendo.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('💡 Asegúrate de que:');
        console.log('   - Frontend esté corriendo en http://localhost:3000');
        console.log('   - Backend esté corriendo en http://localhost:3001');
    }

    await browser.close();
}

quickTest();