/**
 * API de Categorías - Integración con backend
 */

import { api } from './apiClient';

export type Category = {
    id: number;
    name: string;
    slug: string;
    productCount?: number;
};

export type CreateCategoryDto = {
    name: string;
};

export type UpdateCategoryDto = {
    name: string;
};

/**
 * Obtener todas las categorías
 * GET /categories
 */
export async function getCategories(): Promise<Category[]> {
    try {
        const response = await api.get<Category[]>('/categories');
        return response;
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        throw new Error(error.message || 'Error al obtener categorías');
    }
}

/**
 * Obtener una categoría por ID
 * GET /categories/:id
 */
export async function getCategoryById(id: number): Promise<Category> {
    try {
        const response = await api.get<Category>(`/categories/${id}`);
        return response;
    } catch (error: any) {
        console.error(`Error fetching category ${id}:`, error);
        throw new Error(error.message || 'Error al obtener categoría');
    }
}

/**
 * Crear una nueva categoría (solo admin)
 * POST /categories
 */
export async function createCategory(
    data: CreateCategoryDto
): Promise<Category> {
    try {
        const response = await api.post<Category>('/categories', data);
        return response;
    } catch (error: any) {
        console.error('Error creating category:', error);
        throw new Error(error.message || 'Error al crear categoría');
    }
}

/**
 * Actualizar una categoría (solo admin)
 * PUT /categories/:id
 */
export async function updateCategory(
    id: number,
    data: UpdateCategoryDto
): Promise<Category> {
    try {
        const response = await api.put<Category>(`/categories/${id}`, data);
        return response;
    } catch (error: any) {
        console.error(`Error updating category ${id}:`, error);
        throw new Error(error.message || 'Error al actualizar categoría');
    }
}

/**
 * Eliminar una categoría (solo admin)
 * DELETE /categories/:id
 */
export async function deleteCategory(id: number): Promise<void> {
    try {
        await api.delete(`/categories/${id}`);
    } catch (error: any) {
        console.error(`Error deleting category ${id}:`, error);
        throw new Error(error.message || 'Error al eliminar categoría');
    }
}
