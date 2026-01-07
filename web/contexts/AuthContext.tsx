"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { api, setAccessToken } from "../lib/apiClient";

export type User = {
    id: number;
    email: string;
    roles: string[];
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario al iniciar (verificar si hay sesión activa)
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            setLoading(true);

            // Intentar obtener un nuevo access token usando el refresh token (cookie)
            const response = await api.post<{ access_token: string }>('/auth/refresh');

            if (response && response.access_token) {
                setAccessToken(response.access_token);

                // Obtener datos del usuario
                await fetchUser();
            }
        } catch (error) {
            // No hay sesión activa, el refresh token expiró, o el backend no está disponible
            // Esto es normal en la primera carga sin sesión o cuando el backend no está corriendo
            setUser(null);
            setAccessToken(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        try {
            // Decodificar el token para obtener el user ID
            // O hacer un endpoint GET /auth/me en el backend
            // Por ahora, asumimos que el backend devuelve el user en el login
            // Alternativa: crear endpoint GET /auth/me que retorne el usuario actual

            // TODO: Implementar GET /auth/me en backend
            // const userData = await api.get<User>('/auth/me');
            // setUser(userData);

            // Por ahora, extraemos del token (no es lo ideal, mejor usar /auth/me)
            const token = require('../lib/apiClient').getAccessToken();
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    id: payload.sub,
                    email: payload.email,
                    roles: payload.roles || [],
                });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post<{ access_token: string; user?: User }>(
                '/auth/login',
                { email, password }
            );

            if (response.access_token) {
                setAccessToken(response.access_token);

                // Si el backend devuelve el user, usarlo
                if (response.user) {
                    setUser(response.user);
                } else {
                    // Si no, extraer del token
                    await fetchUser();
                }
            }
        } catch (error: any) {
            throw new Error(error.message || 'Error al iniciar sesión');
        }
    };

    const register = async (email: string, password: string) => {
        try {
            await api.post('/auth/register', { email, password });
            // Después del registro, no hacemos login automático
            // El usuario debe hacer login manualmente
        } catch (error: any) {
            throw new Error(error.message || 'Error al registrar usuario');
        }
    };

    const logout = async () => {
        try {
            // Llamar al endpoint de logout para limpiar el refresh token
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            // Limpiar estado local siempre
            setAccessToken(null);
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: !!user && user.roles.includes('admin'),
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    }
    return ctx;
}
