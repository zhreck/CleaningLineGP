"use client";

import { useState, useEffect } from "react";
import type { Category } from "../../lib/categoriesApi";

type CategoryFormProps = {
    category?: Category | null;
    onSave: (name: string) => Promise<void>;
    onCancel: () => void;
    isOpen: boolean;
};

export default function CategoryForm({
    category,
    onSave,
    onCancel,
    isOpen,
}: CategoryFormProps) {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (category) {
            setName(category.name);
        } else {
            setName("");
        }
        setError(null);
    }, [category, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("El nombre es requerido");
            return;
        }

        try {
            setIsSubmitting(true);
            await onSave(name.trim());
            setName("");
        } catch (err: any) {
            setError(err.message || "Error al guardar categoría");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setName("");
        setError(null);
        onCancel();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                <h2 className="text-xl font-semibold text-slate-800">
                    {category ? "Editar Categoría" : "Nueva Categoría"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo de nombre */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Nombre de la categoría
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSubmitting}
                            placeholder="Ej: Limpieza del hogar"
                            className="
                w-full rounded-lg border border-slate-300 bg-white
                px-4 py-2 text-sm text-slate-800
                placeholder:text-slate-400
                focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                disabled:opacity-50 disabled:cursor-not-allowed
              "
                        />
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-2 text-sm text-rose-700">
                            {error}
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="
                px-4 py-2 rounded-lg border border-slate-300
                text-sm font-medium text-slate-700
                hover:bg-slate-50
                disabled:opacity-50 disabled:cursor-not-allowed
                transition
              "
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                px-4 py-2 rounded-lg bg-emerald-600
                text-sm font-semibold text-white
                hover:bg-emerald-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition
              "
                        >
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
