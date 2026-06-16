/**
 * API Client con manejo automático de tokens
 * Intercepta requests para agregar access token
 * Intercepta responses 401 para renovar token automáticamente
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

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
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
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

    const url = `${API_BASE_URL}${endpoint}`;

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

        // Si la respuesta no es OK después del retry, lanzar error
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        // Si es 204 No Content, retornar null
        if (response.status === 204) {
            return null as T;
        }

        return await response.json();
    } catch (error: any) {
        // Solo loguear errores que no sean de red (backend no disponible)
        if (error.message !== 'Failed to fetch') {
            console.error(`API Error [${method} ${endpoint}]:`, error);
        }
        throw error;
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
