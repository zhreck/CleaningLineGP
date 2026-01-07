"use client";

import { useState, useEffect } from "react";
import type { Product } from "../../lib/types";
import type { Category } from "../../lib/categoriesApi";
import type { CreateProductDto } from "../../lib/productsApi";
import MediaPicker from "./media/MediaPicker";
import { toNumber, formatPriceInput, parsePriceInput } from "../../lib/price";

// Internal form data type that supports multiple images
type ProductFormData = Omit<CreateProductDto, 'imageUrl'> & {
    imageUrl: string[]; // Internal state uses array
};

type ProductFormProps = {
    open: boolean;
    onClose: () => void;
    onSave: (data: CreateProductDto) => Promise<void>;
    product?: Product | null;
    categories: Category[];
};

export default function ProductForm({
    open,
    onClose,
    onSave,
    product,
    categories,
}: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: 0,
        slug: "",
        stock: 0,
        imageUrl: [],
        categoryId: 0,
        isFeatured: false,
        isOnSale: false,
        discountPercent: null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [priceDisplay, setPriceDisplay] = useState("");

    // Cargar datos del producto al abrir para edición
    useEffect(() => {
        if (open) {
            if (product) {
                // Modo edición
                // Convert imageUrl to array if it's a string
                const images = Array.isArray(product.imageUrl)
                    ? product.imageUrl
                    : product.imageUrl
                        ? [product.imageUrl]
                        : [];

                const price = toNumber(product.price);
                setFormData({
                    name: product.name,
                    description: product.description || "",
                    price: price,
                    slug: product.slug || "",
                    stock: product.stock || 0,
                    imageUrl: images,
                    categoryId: product.category?.id || 0,
                    isFeatured: product.isFeatured || false,
                    isOnSale: product.isOnSale || false,
                    discountPercent: product.discountPercent || null,
                });
                setPriceDisplay(formatPriceInput(price.toString()));
            } else {
                // Modo creación
                setFormData({
                    name: "",
                    description: "",
                    price: 0,
                    slug: "",
                    stock: 0,
                    imageUrl: [],
                    categoryId: 0,
                    isFeatured: false,
                    isOnSale: false,
                    discountPercent: null,
                });
                setPriceDisplay("");
            }
            setErrors({});
        }
    }, [open, product]);

    // Validar formulario
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido";
        }

        if (formData.price <= 0) {
            newErrors.price = "El precio debe ser mayor a 0";
        }

        if (formData.stock < 0) {
            newErrors.stock = "El stock no puede ser negativo";
        }

        // Validate images array
        const images = Array.isArray(formData.imageUrl) ? formData.imageUrl : [];
        if (images.length === 0) {
            newErrors.imageUrl = "Se requiere al menos una imagen";
        }

        if (!formData.categoryId || formData.categoryId === 0) {
            newErrors.categoryId = "La categoría es requerida";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Generate slug from name
    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Remove duplicate hyphens
    };

    // Manejar submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setIsSubmitting(true);

            // Convert images array to single string for backend compatibility
            const images = Array.isArray(formData.imageUrl)
                ? formData.imageUrl.filter((url: string) => url && url.trim() !== '')
                : [];

            // Build data object without imageUrl first
            const { imageUrl: _, ...restData } = formData;
            const dataToSend: any = { ...restData };

            // Auto-generate slug if not provided or empty
            if (!dataToSend.slug || dataToSend.slug.trim() === '') {
                dataToSend.slug = generateSlug(formData.name);
            }

            // Only include imageUrl if we have at least one valid image URL
            if (images.length > 0) {
                dataToSend.imageUrl = images[0];
            }
            // If no images, imageUrl field is completely omitted

            console.log('Sending data to backend:', JSON.stringify(dataToSend, null, 2)); // Debug log

            await onSave(dataToSend);
            // El componente padre cerrará el modal y mostrará notificación
        } catch (error: any) {
            // El error se maneja en el componente padre
            console.error("Error en formulario:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Manejar cierre
    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                name: "",
                description: "",
                price: 0,
                slug: "",
                stock: 0,
                imageUrl: [],
                categoryId: 0,
                isFeatured: false,
                isOnSale: false,
                discountPercent: null,
            });
            setErrors({});
            setIsMediaPickerOpen(false);
            setPriceDisplay("");
            onClose();
        }
    };

    // Manejar selección de imágenes desde MediaPicker
    const handleImagesSelected = (urls: string[]) => {
        // Combine new URLs with existing ones, avoiding duplicates
        const existingUrls = Array.isArray(formData.imageUrl) ? formData.imageUrl : [];
        const newUrls = urls.filter(url => !existingUrls.includes(url));
        const combinedUrls = [...existingUrls, ...newUrls];

        setFormData({ ...formData, imageUrl: combinedUrls });
        // Don't close the picker automatically - let user continue browsing/uploading
    };

    // Manejar cambio de precio con formato automático
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formatted = formatPriceInput(value);
        const numericValue = parsePriceInput(formatted);

        setPriceDisplay(formatted);
        setFormData({ ...formData, price: numericValue });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4 my-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">
                        {product ? "Editar Producto" : "Nuevo Producto"}
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nombre del producto *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            disabled={isSubmitting}
                            placeholder="Ej: Cloro Líquido 1L"
                            className={`
                w-full rounded-lg border bg-white
                px-4 py-2 text-sm text-slate-800
                placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                disabled:opacity-50 disabled:cursor-not-allowed
                ${errors.name ? "border-rose-500" : "border-slate-300 focus:border-emerald-500"}
              `}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            disabled={isSubmitting}
                            rows={3}
                            placeholder="Descripción del producto..."
                            className="
                w-full rounded-lg border border-slate-300 bg-white
                px-4 py-2 text-sm text-slate-800
                placeholder:text-slate-400
                focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                disabled:opacity-50 disabled:cursor-not-allowed
              "
                        />
                    </div>

                    {/* Precio, Stock, Categoría */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Precio (CLP) *
                            </label>
                            <input
                                type="text"
                                value={priceDisplay}
                                onChange={handlePriceChange}
                                disabled={isSubmitting}
                                placeholder="$0"
                                className={`
                  w-full rounded-lg border bg-white
                  px-4 py-2 text-sm text-slate-800
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${errors.price ? "border-rose-500" : "border-slate-300 focus:border-emerald-500"}
                `}
                            />
                            {errors.price && (
                                <p className="mt-1 text-xs text-rose-600">{errors.price}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Stock *
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={formData.stock}
                                onChange={(e) =>
                                    setFormData({ ...formData, stock: Number(e.target.value) })
                                }
                                disabled={isSubmitting}
                                className={`
                  w-full rounded-lg border bg-white
                  px-4 py-2 text-sm text-slate-800
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${errors.stock ? "border-rose-500" : "border-slate-300 focus:border-emerald-500"}
                `}
                            />
                            {errors.stock && (
                                <p className="mt-1 text-xs text-rose-600">{errors.stock}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Categoría *
                            </label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        categoryId: Number(e.target.value),
                                    })
                                }
                                disabled={isSubmitting}
                                className={`
                  w-full rounded-lg border bg-white
                  px-4 py-2 text-sm text-slate-800
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${errors.categoryId ? "border-rose-500" : "border-slate-300 focus:border-emerald-500"}
                `}
                            >
                                <option value={0}>Seleccionar...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <p className="mt-1 text-xs text-rose-600">
                                    {errors.categoryId}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Imágenes del producto */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Imágenes del producto *
                        </label>

                        {/* Select Images Button */}
                        <button
                            type="button"
                            onClick={() => setIsMediaPickerOpen(true)}
                            disabled={isSubmitting}
                            className="
                                w-full rounded-lg border-2 border-dashed border-slate-300
                                bg-slate-50 hover:bg-slate-100
                                px-4 py-3 text-sm font-medium text-slate-600
                                hover:border-emerald-500 hover:text-emerald-600
                                focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-colors
                            "
                        >
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Seleccionar Imágenes
                            </span>
                        </button>

                        {/* Display selected images as thumbnails */}
                        {Array.isArray(formData.imageUrl) && formData.imageUrl.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {formData.imageUrl.map((url, index) => (
                                    <div
                                        key={index}
                                        className="relative group aspect-square rounded-lg overflow-hidden border-2 border-slate-200 hover:border-emerald-500 transition-colors"
                                    >
                                        <img
                                            src={url}
                                            alt={`Producto imagen ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Remove button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = formData.imageUrl.filter((_, i) => i !== index);
                                                setFormData({ ...formData, imageUrl: newImages });
                                            }}
                                            disabled={isSubmitting}
                                            className="
                                                absolute top-1 right-1
                                                bg-rose-500 hover:bg-rose-600
                                                text-white rounded-full
                                                w-6 h-6 flex items-center justify-center
                                                opacity-0 group-hover:opacity-100
                                                transition-opacity
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                            "
                                            aria-label="Eliminar imagen"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.imageUrl && (
                            <p className="mt-1 text-xs text-rose-600">{errors.imageUrl}</p>
                        )}
                    </div>

                    {/* Checkboxes */}
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) =>
                                    setFormData({ ...formData, isFeatured: e.target.checked })
                                }
                                disabled={isSubmitting}
                                className="h-4 w-4 text-emerald-600 rounded"
                            />
                            <span className="text-sm text-slate-700">Producto destacado</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isOnSale}
                                onChange={(e) =>
                                    setFormData({ ...formData, isOnSale: e.target.checked })
                                }
                                disabled={isSubmitting}
                                className="h-4 w-4 text-emerald-600 rounded"
                            />
                            <span className="text-sm text-slate-700">En oferta</span>
                        </label>

                        {formData.isOnSale && (
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-700">Descuento (%):</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.discountPercent || 0}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            discountPercent: Number(e.target.value),
                                        })
                                    }
                                    disabled={isSubmitting}
                                    className="
                    w-20 rounded-lg border border-slate-300 bg-white
                    px-2 py-1 text-sm text-slate-800
                    focus:border-emerald-500 focus:outline-none
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                                />
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 justify-end pt-2 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={handleClose}
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

            {/* MediaPicker Modal */}
            <MediaPicker
                open={isMediaPickerOpen}
                multiple={true}
                initialSelection={Array.isArray(formData.imageUrl) ? formData.imageUrl : []}
                onSelect={handleImagesSelected}
                onClose={() => setIsMediaPickerOpen(false)}
            />
        </div>
    );
}
