// web/app/admin/products/page.tsx
"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import RequireAdmin from "../../../components/auth/requireAdmin";
import ProductForm from "../../../components/admin/ProductForm";
import type { Product } from "../../../lib/types";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type CreateProductDto,
} from "../../../lib/productsApi";
import { getCategories, type Category } from "../../../lib/categoriesApi";
import { useToast } from "../../../components/ui/useToast";

function AdminProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast, showToast } = useToast();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Debounce para la búsqueda (300ms)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [search]);

  // Cargar datos
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts({ search: debouncedSearch, category: categoryFilter }),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error cargando datos:", err);
      showToast("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, categoryFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Paginación
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, categoryFilter]);

  // Abrir formulario para crear
  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  // Abrir formulario para editar
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  // Guardar producto (crear o actualizar)
  const handleSave = async (data: CreateProductDto) => {
    try {
      if (selectedProduct) {
        // Actualizar
        await updateProduct(selectedProduct.id, data);
        showToast("Producto actualizado correctamente", "success");
      } else {
        // Crear
        await createProduct(data);
        showToast("Producto creado correctamente", "success");
      }

      setIsFormOpen(false);
      setSelectedProduct(null);
      await loadData();
    } catch (error: any) {
      showToast(error.message || "Error al guardar producto", "error");
      throw error;
    }
  };

  // Eliminar producto
  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product.id);
      showToast("Producto eliminado correctamente", "success");
      await loadData();
    } catch (error: any) {
      showToast(error.message || "Error al eliminar producto", "error");
    }
  };

  // Cancelar formulario
  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Cargando productos...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-400">
            Gestión de Productos
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {products.length} producto{products.length !== 1 ? "s" : ""}{" "}
            encontrado{products.length !== 1 ? "s" : ""}
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
          + Nuevo Producto
        </button>
      </div>

      {/* Notificación Toast */}
      {toast && (
        <div
          className={`
            rounded-lg px-4 py-3 text-sm font-medium
            ${toast.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : toast.type === "error"
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }
          `}
        >
          {toast.message}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre, slug o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            flex-1 rounded-lg border border-slate-300 bg-white
            px-4 py-2 text-sm text-slate-800
            placeholder:text-slate-400
            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20
          "
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="
            rounded-lg border border-slate-300 bg-white
            px-4 py-2 text-sm text-slate-800
            focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20
          "
        >
          <option value="all">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-slate-500">
            No hay productos que coincidan con el filtro.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-12 w-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {product.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">Sin categoría</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                      ${product.price.toLocaleString("es-CL")}
                      {product.isOnSale && product.discountPercent && (
                        <span className="ml-2 text-xs text-emerald-600">
                          -{product.discountPercent}%
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {product.stock !== undefined ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 50
                            ? "bg-green-100 text-green-800"
                            : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {product.stock} unidades
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {product.isFeatured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            ⭐
                          </span>
                        )}
                        {product.isOnSale && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                            🏷️
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
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
                        onClick={() => handleDelete(product)}
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

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, products.length)} de{" "}
                {products.length} productos
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="
                    px-3 py-1.5 rounded-md border border-slate-300
                    text-sm font-medium text-slate-700
                    hover:bg-slate-50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition
                  "
                >
                  Anterior
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`
                          px-3 py-1.5 rounded-md text-sm font-medium
                          transition
                          ${currentPage === page
                            ? "bg-emerald-600 text-white"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                          }
                        `}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="
                    px-3 py-1.5 rounded-md border border-slate-300
                    text-sm font-medium text-slate-700
                    hover:bg-slate-50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition
                  "
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Formulario modal */}
      <ProductForm
        open={isFormOpen}
        onClose={handleCancel}
        onSave={handleSave}
        product={selectedProduct}
        categories={categories}
      />
    </section>
  );
}

export default function AdminProductsPage() {
  return (
    <RequireAdmin>
      <AdminProductsPageContent />
    </RequireAdmin>
  );
}
