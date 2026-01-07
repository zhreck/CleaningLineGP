"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RequireAdmin from "../../../components/auth/requireAdmin";
import CategoryTable from "../../../components/admin/CategoryTable";
import CategoryForm from "../../../components/admin/CategoryForm";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    type Category,
} from "../../../lib/categoriesApi";

function CategoriesPageContent() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [notification, setNotification] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    // Cargar categorías
    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (error: any) {
            showNotification(
                error.message || "Error al cargar categorías",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // Mostrar notificación
    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Abrir formulario para crear
    const handleCreate = () => {
        setSelectedCategory(null);
        setIsFormOpen(true);
    };

    // Abrir formulario para editar
    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsFormOpen(true);
    };

    // Guardar categoría (crear o actualizar)
    const handleSave = async (name: string) => {
        try {
            if (selectedCategory) {
                // Actualizar
                await updateCategory(selectedCategory.id, { name });
                showNotification("Categoría actualizada correctamente", "success");
            } else {
                // Crear
                await createCategory({ name });
                showNotification("Categoría creada correctamente", "success");
            }

            setIsFormOpen(false);
            setSelectedCategory(null);
            await loadCategories();
        } catch (error: any) {
            throw error; // El formulario manejará el error
        }
    };

    // Eliminar categoría
    const handleDelete = async (category: Category) => {
        try {
            await deleteCategory(category.id);
            showNotification("Categoría eliminada correctamente", "success");
            await loadCategories();
        } catch (error: any) {
            showNotification(
                error.message || "Error al eliminar categoría",
                "error"
            );
        }
    };

    // Cancelar formulario
    const handleCancel = () => {
        setIsFormOpen(false);
        setSelectedCategory(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-emerald-400">
                        Gestión de Categorías
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Administra las categorías de productos
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="
            px-4 py-2 rounded-lg bg-emerald-600
            text-sm font-semibold text-white
            hover:bg-emerald-500 hover:shadow-md
            transition
          "
                >
                    + Nueva Categoría
                </button>
            </div>

            {/* Notificación */}
            {notification && (
                <div
                    className={`
            rounded-lg px-4 py-3 text-sm font-medium
            ${notification.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }
          `}
                >
                    {notification.message}
                </div>
            )}

            {/* Tabla de categorías */}
            <CategoryTable
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

            {/* Formulario modal */}
            <CategoryForm
                category={selectedCategory}
                onSave={handleSave}
                onCancel={handleCancel}
                isOpen={isFormOpen}
            />
        </div>
    );
}

export default function CategoriesPage() {
    return (
        <RequireAdmin>
            <CategoriesPageContent />
        </RequireAdmin>
    );
}
