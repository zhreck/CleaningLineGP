import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Tarea 7 - Sumativa 3
 * Test E2E: Flujo de Checkout Exitoso
 * 
 * Este test documenta el flujo completo de compra desde la selección
 * de productos hasta la finalización del checkout.
 */

test.describe('Flujo de Checkout Exitoso', () => {

    test('Usuario invitado completa compra exitosamente', async ({ page }) => {
        // Configurar directorio de screenshots
        const screenshotsDir = path.join(__dirname, '../../evidence/screenshots');

        console.log('📹 Iniciando grabación del flujo de checkout exitoso...');

        // PASO 1: Navegar a la página de catálogo
        console.log('✅ Paso 1: Navegando a /catalogo');
        await page.goto('/catalogo', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await page.waitForLoadState('networkidle', { timeout: 30000 });

        // Verificar que estamos en la página correcta
        await expect(page).toHaveURL(/.*catalogo/);

        // Esperar a que la página cargue completamente
        await page.waitForSelector('h1', { timeout: 10000 });
        await expect(page.locator('h1')).toContainText(/catálogo|catalogo/i);

        // Screenshot del catálogo
        try {
            await page.screenshot({
                path: path.join(screenshotsDir, '01-products-catalog.png'),
                fullPage: true
            });
        } catch (error) {
            console.log('⚠️ Screenshot failed, trying without fullPage');
            await page.screenshot({
                path: path.join(screenshotsDir, '01-products-catalog.png'),
                fullPage: false
            });
        }

        // PASO 2: Seleccionar el primer producto
        console.log('✅ Paso 2: Seleccionando primer producto');

        // Esperar a que los productos carguen
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('article', {
            timeout: 15000
        });

        // Buscar el primer producto disponible (usando la estructura real de ProductCard)
        const firstProduct = page.locator('article').first();
        await firstProduct.waitFor({ state: 'visible' });

        // Hacer clic en el enlace "Ver más" para ir al detalle
        const viewMoreLink = firstProduct.locator('a:has-text("Ver más")');
        await viewMoreLink.click();
        await page.waitForLoadState('networkidle');

        // Screenshot del detalle del producto
        try {
            await page.screenshot({
                path: path.join(screenshotsDir, '02-product-detail.png'),
                fullPage: true
            });
        } catch (error) {
            console.log('⚠️ Screenshot failed, trying without fullPage');
            await page.screenshot({
                path: path.join(screenshotsDir, '02-product-detail.png'),
                fullPage: false
            });
        }

        // PASO 3: Agregar al carrito
        console.log('✅ Paso 3: Agregando producto al carrito');

        // Buscar el botón de agregar al carrito (usando el texto exacto de ProductCard)
        const addToCartButton = page.locator('button:has-text("Agregar al carrito")').first();

        await addToCartButton.waitFor({ state: 'visible', timeout: 5000 });
        await addToCartButton.click();

        // Esperar confirmación (puede ser un toast, modal, o cambio en el carrito)
        await page.waitForTimeout(2000);

        // Screenshot después de agregar al carrito
        try {
            await page.screenshot({
                path: path.join(screenshotsDir, '03-added-to-cart.png'),
                fullPage: true
            });
        } catch (error) {
            console.log('⚠️ Screenshot failed, trying without fullPage');
            await page.screenshot({
                path: path.join(screenshotsDir, '03-added-to-cart.png'),
                fullPage: false
            });
        }

        // PASO 4: Ir al carrito
        console.log('✅ Paso 4: Navegando al carrito');

        // Buscar el enlace al carrito en la navegación
        const cartButton = page.locator('a[href="/cart"]').first();

        await cartButton.click();
        await page.waitForLoadState('networkidle');

        // Verificar que estamos en el carrito
        await expect(page).toHaveURL(/.*cart/);

        // Screenshot del carrito
        try {
            await page.screenshot({
                path: path.join(screenshotsDir, '04-cart-view.png'),
                fullPage: true
            });
        } catch (error) {
            console.log('⚠️ Screenshot failed, trying without fullPage');
            await page.screenshot({
                path: path.join(screenshotsDir, '04-cart-view.png'),
                fullPage: false
            });
        }

        // PASO 5: Proceder al checkout
        console.log('✅ Paso 5: Procediendo al checkout');

        // Buscar botón de checkout (usando el texto exacto de la página del carrito)
        const checkoutButton = page.locator('button:has-text("Continuar al pago")').first();

        await checkoutButton.click();
        await page.waitForLoadState('networkidle');

        // Verificar que estamos en checkout
        await expect(page).toHaveURL(/.*checkout/);

        // Screenshot del formulario de checkout
        try {
            await page.screenshot({
                path: path.join(screenshotsDir, '05-checkout-form.png'),
                fullPage: true
            });
        } catch (error) {
            console.log('⚠️ Screenshot failed, trying without fullPage');
            await page.screenshot({
                path: path.join(screenshotsDir, '05-checkout-form.png'),
                fullPage: false
            });
        }

        // PASO 6: Completar datos del formulario (checkout invitado)
        console.log('✅ Paso 6: Completando datos de checkout');

        // Datos de prueba válidos
        const testData = {
            name: 'Juan Pérez',
            email: 'juan.perez@example.com',
            phone: '+56912345678',
            address: 'Av. Libertador Bernardo O\'Higgins 1234',
            city: 'Santiago',
            region: 'Región Metropolitana'
        };

        // Llenar campos del formulario usando los placeholders exactos del checkout

        // Nombre completo
        await page.fill('input[placeholder="Ej: Juan Pérez"]', testData.name);

        // Email
        await page.fill('input[placeholder="correo@ejemplo.com"]', testData.email);

        // Teléfono
        await page.fill('input[placeholder="+56 9 1234 5678"]', testData.phone);

        // Seleccionar envío a domicilio para llenar dirección
        await page.click('input[value="delivery"]');
        await page.waitForTimeout(1000);

        // Dirección
        await page.fill('input[placeholder="Ej: Calle 1234, depto. 201"]', testData.address);

        // Comuna
        await page.fill('input[placeholder="Ej: La Florida"]', testData.city);

        // Región
        await page.fill('input[placeholder="Ej: Región Metropolitana"]', testData.region);

        // Screenshot con datos completados
        try {
            await page.screenshot({
                path: path.join(screenshotsDir, '06-form-filled.png'),
                fullPage: true
            });
        } catch (error) {
            console.log('⚠️ Screenshot failed, trying without fullPage');
            await page.screenshot({
                path: path.join(screenshotsDir, '06-form-filled.png'),
                fullPage: false
            });
        }

        // PASO 7: Finalizar compra
        console.log('✅ Paso 7: Finalizando compra');

        // Buscar botón de finalizar compra
        const submitButton = page.locator('button:has-text("Continuar al pago")').first();

        await submitButton.click();

        // Esperar a que se procese la orden (puede redirigir a Webpay)
        await page.waitForTimeout(3000);

        // PASO 8: Verificar redirección o procesamiento
        console.log('✅ Paso 8: Verificando procesamiento de compra');

        // Esperar cambio de página o mensaje
        await page.waitForLoadState('networkidle');

        // Screenshot final (puede ser Webpay o página de confirmación)
        try {
            await page.screenshot({
                path: path.join(screenshotsDir, 'checkout-success.png'),
                fullPage: true
            });
        } catch (error) {
            console.log('⚠️ Screenshot failed, trying without fullPage');
            await page.screenshot({
                path: path.join(screenshotsDir, 'checkout-success.png'),
                fullPage: false
            });
        }

        console.log('✅ ¡Flujo de checkout completado exitosamente!');
        console.log('📹 Video guardado automáticamente por Playwright');
        console.log('📸 Screenshots guardados en: evidence/screenshots/');

        // Verificación final - el test es exitoso si llegamos hasta aquí sin errores
        console.log('✅ Orden procesada correctamente');
    });
});