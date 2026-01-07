/**
 * Genera un slug a partir de un texto
 * @param text - Texto a convertir en slug
 * @returns Slug generado
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD') // Normalizar caracteres Unicode
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
        .trim()
        .replace(/\s+/g, '-') // Reemplazar espacios con guiones
        .replace(/-+/g, '-'); // Eliminar guiones duplicados
}
