"use client";

import type { Category } from "../../lib/categoriesApi";

type CategoryTableProps = {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    isLoading?: boolean;
};

export default function CategoryTable({
    categories,
    onEdit,
    onDelete,
    isLoading = false,
}: CategoryTableProps) {
    if (isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Cargando categorías...</p>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-500">No hay categorías creadas.</p>
                <p className="text-sm text-slate-400 mt-1">
                    Haz clic en "Nueva Categoría" para crear una.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Slug
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Productos
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {categories.map((category) => (
                        <tr
                            key={category.id}
                            className="hover:bg-slate-50 transition"
                        >
                            <td className="px-4 py-3 text-sm text-slate-600">
                                {category.id}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-slate-800">
                                {category.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                                {category.slug}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    {category.productCount || 0} producto
                                    {category.productCount !== 1 ? "s" : ""}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right space-x-2">
                                <button
                                    onClick={() => onEdit(category)}
                                    className="
                    inline-flex items-center px-3 py-1.5 rounded-md
                    text-xs font-medium text-emerald-700 bg-emerald-50
                    hover:bg-emerald-100
                    transition
                  "
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(category)}
                                    className="
                    inline-flex items-center px-3 py-1.5 rounded-md
                    text-xs font-medium text-rose-700 bg-rose-50
                    hover:bg-rose-100
                    transition
                  "
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
