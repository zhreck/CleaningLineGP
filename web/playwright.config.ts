import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para Tarea 7 - Sumativa 3
 * Generación de Evidencias de Pruebas E2E
 */
export default defineConfig({
    testDir: './tests/evidence',

    // Timeout para cada test
    timeout: 60 * 1000,

    // Configuración de reportes
    fullyParallel: false, // Ejecutar tests secuencialmente para mejor grabación
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Un worker para evitar conflictos

    // Reporter
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list'],
        ['json', { outputFile: 'test-results/results.json' }]
    ],

    // Configuración global para todos los tests
    use: {
        // URL base de la aplicación
        baseURL: 'http://localhost:3000',

        // Grabación de video SIEMPRE activada
        video: 'on',

        // Screenshots SIEMPRE activados
        screenshot: 'on',

        // Trace SIEMPRE activado
        trace: 'on',

        // Configuración de viewport
        viewport: { width: 1280, height: 720 },

        // Ignorar errores HTTPS
        ignoreHTTPSErrors: true,

        // Timeout para acciones
        actionTimeout: 15000,

        // Timeout para navegación
        navigationTimeout: 30000,
    },

    // Configuración de salida
    outputDir: 'test-results',

    // Proyectos (navegadores)
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Configuración específica para evidencias
                launchOptions: {
                    slowMo: 500, // Ralentizar para mejor visualización
                }
            },
        },
    ],

    // Servidor de desarrollo (opcional)
    // webServer: {
    //   command: 'npm run dev',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    //   timeout: 120 * 1000,
    // },
});
