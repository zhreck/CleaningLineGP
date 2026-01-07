// web/lib/usersApi.ts
import { api, getAccessToken } from "./apiClient";

export interface User {
    id: number;
    email: string;
    roles: string[];
}

/**
 * Obtiene todos los usuarios registrados (solo admin)
 */
export async function getAllUsers(): Promise<User[]> {
    const token = getAccessToken();

    if (!token) {
        throw new Error("No estás autenticado. Por favor inicia sesión.");
    }

    return api.get<User[]>('/auth/users');
}
