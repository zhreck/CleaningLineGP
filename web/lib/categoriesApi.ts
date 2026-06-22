/**
 * API de Categorías - MOCK LOCAL (Sin Backend)
 */

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

// 1. Base de datos simulada en memoria local
let categoriasMock: Category[] = [
    { id: 1, name: "Limpieza", slug: "limpieza", productCount: 6 },
    { id: 2, name: "Hogar", slug: "hogar", productCount: 0 },
    { id: 3, name: "Alimentos", slug: "alimentos", productCount: 0 },
    { id: 4, name: "Cuidado Personal", slug: "cuidado-personal", productCount: 0 }
];

// Función auxiliar para simular retraso de red (hace que los loaders de tu web funcionen de verdad)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtener todas las categorías
 * MOCK LOCAL
 */
export async function getCategories(): Promise<Category[]> {
    try {
        await delay(300); // Pequeña pausa de 300ms para simular carga
        console.log('[Mock API] getCategories - Devolviendo categorías locales');
        return [...categoriasMock];
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        throw new Error(error.message || 'Error al obtener categorías');
    }
}

/**
 * Obtener una categoría por ID
 * MOCK LOCAL
 */
export async function getCategoryById(id: number): Promise<Category> {
    try {
        await delay(200);
        const categoria = categoriasMock.find(c => c.id === id);
        if (!categoria) throw new Error('Categoría no encontrada');
        return { ...categoria };
    } catch (error: any) {
        console.error(`Error fetching category ${id}:`, error);
        throw new Error(error.message || 'Error al obtener categoría');
    }
}

/**
 * Crear una nueva categoría (solo admin)
 * MOCK LOCAL
 */
export async function createCategory(
    data: CreateCategoryDto
): Promise<Category> {
    try {
        await delay(500);
        const nuevaCategoria: Category = {
            id: categoriasMock.length > 0 ? Math.max(...categoriasMock.map(c => c.id)) + 1 : 1,
            name: data.name,
            slug: data.name.toLowerCase().replace(/\s+/g, '-'),
            productCount: 0
        };
        categoriasMock.push(nuevaCategoria);
        console.log('[Mock API] createCategory - Creada exitosamente:', nuevaCategoria);
        return nuevaCategoria;
    } catch (error: any) {
        console.error('Error creating category:', error);
        throw new Error(error.message || 'Error al crear categoría');
    }
}

/**
 * Actualizar una categoría (solo admin)
 * MOCK LOCAL
 */
export async function updateCategory(
    id: number,
    data: UpdateCategoryDto
): Promise<Category> {
    try {
        await delay(500);
        const index = categoriasMock.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Categoría no encontrada para actualizar');
        
        categoriasMock[index] = {
            ...categoriasMock[index],
            name: data.name,
            slug: data.name.toLowerCase().replace(/\s+/g, '-')
        };
        
        console.log('[Mock API] updateCategory - Actualizada:', categoriasMock[index]);
        return { ...categoriasMock[index] };
    } catch (error: any) {
        console.error(`Error updating category ${id}:`, error);
        throw new Error(error.message || 'Error al actualizar categoría');
    }
}

/**
 * Eliminar una categoría (solo admin)
 * MOCK LOCAL
 */
export async function deleteCategory(id: number): Promise<void> {
    try {
        await delay(500);
        const index = categoriasMock.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Categoría no encontrada para eliminar');
        
        categoriasMock.splice(index, 1);
        console.log(`[Mock API] deleteCategory - Eliminada categoría con ID: ${id}`);
    } catch (error: any) {
        console.error(`Error deleting category ${id}:`, error);
        throw new Error(error.message || 'Error al eliminar categoría');
    }
}