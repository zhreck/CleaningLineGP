/**
 * API Client con manejo automático de tokens
 * Intercepta requests para agregar access token
 * Intercepta responses 401 para renovar token automáticamente
 */

export function resolveApiBaseUrl(configuredUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002', currentOrigin: string = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000') {
    const baseUrl = configuredUrl.replace(/\/$/, '');

    if (baseUrl.includes('localhost')) {
        const normalizedOrigin = currentOrigin.replace(/\/$/, '');
        if (normalizedOrigin.includes('127.0.0.1') || normalizedOrigin.includes('localhost')) {
            return baseUrl.replace('localhost', '127.0.0.1');
        }
    }

    return baseUrl;
}

const API_BASE_URL = resolveApiBaseUrl();
// El backend expone todas sus rutas bajo /api (ver App/api/src/main.ts -> setGlobalPrefix)
const API_URL = `${API_BASE_URL.replace(/\/$/, '')}/api`;

// Variable en memoria para el access token
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
};

async function refreshAccessToken(): Promise<string | null> {
    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include', // Envía cookie HttpOnly con refresh token
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Si el refresh falla, el usuario debe hacer login de nuevo
            setAccessToken(null);
            return null;
        }

        const data = await response.json();
        const newAccessToken = data.access_token;
        setAccessToken(newAccessToken);
        return newAccessToken;
    } catch (error) {
        // Error de red o backend no disponible - esto es normal
        setAccessToken(null);
        return null;
    }
}

async function apiRequest<T = any>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { method = 'GET', body, headers = {}, credentials = 'include' } = options;

    const url = `${API_URL}${endpoint}`;

    // Construir headers de manera type-safe
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    // Agregar access token si existe
    if (accessToken) {
        requestHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    const config: RequestInit = {
        method,
        headers: requestHeaders,
        credentials,
    };

    // Agregar body si existe
    if (body) {
        config.body = JSON.stringify(body);
    }

    // Verificar que `fetch` esté disponible (entorno server podría necesitar polyfill)
    if (typeof fetch === 'undefined') {
        throw new Error('fetch is not available in this environment. Use Node >=18 or provide a fetch polyfill.');
    }

    try {
        let response = await fetch(url, config);

        // Si recibimos 401, intentar renovar el token
        if (response.status === 401 && accessToken) {
            const newToken = await refreshAccessToken();

            if (newToken) {
                // Reintentar la request original con el nuevo token
                requestHeaders['Authorization'] = `Bearer ${newToken}`;
                config.headers = requestHeaders;
                response = await fetch(url, config);
            } else {
                // Si no se pudo renovar, redirigir a login
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
                throw new Error('Session expired');
            }
        }

        // Determinar tipo de contenido
        const contentType = response.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json') || contentType.includes('+json');

        // Si la respuesta no es OK después del retry, lanzar error con detalle adecuado
        if (!response.ok) {
            if (isJson) {
                const errorData = await response.json().catch(() => null);
                const message = (errorData && (errorData.message || errorData.error)) || `HTTP ${response.status}`;
                throw new Error(message);
            } else {
                const text = await response.text().catch(() => '');
                const short = text ? text.slice(0, 500) : 'Non-JSON response body';
                throw new Error(`HTTP ${response.status}: ${short}`);
            }
        }

        // Si es 204 No Content, retornar null
        if (response.status === 204) {
            return null as T;
        }

        // Parsear según Content-Type para evitar 'Unexpected token <' cuando el servidor devuelve HTML
        if (isJson) {
            return await response.json();
        }

        // Devolver texto para respuestas no JSON (por ejemplo páginas HTML de error)
        const text = await response.text();
        return text as unknown as T;
    } catch (error: any) {
        // En caso de fallo de fetch, loggear la URL y el método para diagnóstico
        console.error(`Fetch error [${method} ${endpoint}]`, {
            url,
            method,
            endpoint,
            error: error?.message || error,
        });

        // Re-emitir error con contexto
        const message = error?.message || String(error);
        throw new Error(`Fetch failed for ${url}: ${message}`);
    }
}

// Métodos de conveniencia
export const api = {
    get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        apiRequest<T>(endpoint, { ...options, method: 'GET' }),

    post: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

    put: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

    patch: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

    delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
