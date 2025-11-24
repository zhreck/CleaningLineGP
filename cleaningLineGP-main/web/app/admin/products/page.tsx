// web/app/admin/products/page.tsx
"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import type { Product } from "../../../lib/types";
import { fetchProducts } from "../../../lib/api";

type AdminProduct = Product & {
  active?: boolean;
  stock?: number;
};

type FormMode = "create" | "edit";

const STORAGE_KEY = "adminProducts";

const emptyProduct: AdminProduct = {
  id: "",
  slug: "",
  name: "",
  price: 0,
  description: "",
  imageUrl: "",
  categoryKey: undefined,
  categoryName: "",
  stock: 0,
  isFeatured: false,
  isOnSale: false,
  discountPercent: 0,
  active: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formData, setFormData] = useState<AdminProduct>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ───────────────── CARGA INICIAL ─────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: AdminProduct[] = JSON.parse(saved);
          setProducts(parsed);
        } else {
          // Primera vez: toma productos del catálogo (mock o backend)
          const base = await fetchProducts();
          const withAdminFields: AdminProduct[] = base.map((p) => ({
            ...p,
            active: true,
            stock: p.stock ?? 0,
          }));
          setProducts(withAdminFields);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(withAdminFields));
        }
      } catch (err) {
        console.error("Error cargando productos admin:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ───────────────── HELPERS ─────────────────
  const saveProducts = (next: AdminProduct[]) => {
    setProducts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const openCreateForm = () => {
    setFormMode("create");
    setEditingId(null);
    setFormData({
      ...emptyProduct,
      id: "",
      slug: "",
      active: true,
      stock: 0,
    });
    setFormOpen(true);
  };

  const openEditForm = (product: AdminProduct) => {
    setFormMode("edit");
    setEditingId(product.id);
    setFormData({
      ...emptyProduct,
      ...product,
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setFormData(emptyProduct);
  };

  const handleFormChange = (
    field: keyof AdminProduct,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.slug) {
      alert("Nombre y slug son obligatorios.");
      return;
    }

    if (formMode === "create") {
      const newProduct: AdminProduct = {
        ...formData,
        id: crypto.randomUUID(),
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0,
      };

      const next = [...products, newProduct];
      saveProducts(next);
    } else if (formMode === "edit" && editingId) {
      const next = products.map((p) =>
        p.id === editingId
          ? {
              ...p,
              ...formData,
              price: Number(formData.price) || 0,
              stock: Number(formData.stock) || 0,
            }
          : p
      );
      saveProducts(next);
    }

    closeForm();
  };

  const toggleActive = (id: string) => {
    const next = products.map((p) =>
      p.id === id ? { ...p, active: !p.active } : p
    );
    saveProducts(next);
  };

  const removeProduct = (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    const next = products.filter((p) => p.id !== id);
    saveProducts(next);
  };

  // ───────────────── LISTA FILTRADA ─────────────────
  const filteredProducts = useMemo(() => {
    const text = search.trim().toLowerCase();

    return products.filter((p) => {
      const matchesText =
        !text ||
        p.name.toLowerCase().includes(text) ||
        p.slug.toLowerCase().includes(text) ||
        (p.categoryName ?? "").toLowerCase().includes(text);

      const matchesCategory =
        categoryFilter === "all" ||
        (p.categoryKey && p.categoryKey === categoryFilter);

      return matchesText && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.categoryKey) set.add(p.categoryKey);
    });
    return Array.from(set);
  }, [products]);

  // ───────────────── RENDER ─────────────────
  if (loading) {
    return <p className="text-sm text-neutral-400">Cargando productos…</p>;
  }

  return (
    <section className="space-y-4">
      {/* Encabezado y acciones */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Productos</h2>
          <p className="text-sm text-neutral-400">
            Administra los productos visibles en el catálogo.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          <span>➕</span>
          <span>Agregar producto</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 text-sm">
        <input
          placeholder="Buscar por nombre, slug o categoría…"
          className="min-w-[220px] flex-1 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-emerald-500"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "cloro"
                ? "Cloro"
                : cat === "hogar"
                ? "Hogar"
                : cat === "personal"
                ? "Cuidado personal"
                : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      {filteredProducts.length === 0 ? (
        <p className="text-sm text-neutral-400">
          No hay productos que coincidan con el filtro.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-neutral-950/70 text-xs uppercase text-neutral-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3 hidden sm:table-cell">Slug</th>
                <th className="px-4 py-3 hidden md:table-cell">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3 hidden md:table-cell">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-neutral-800/80 text-neutral-100"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{p.name}</span>
                      {p.isOnSale && (
                        <span className="text-xs text-emerald-400">
                          En oferta {p.discountPercent ?? 0}% OFF
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 hidden sm:table-cell text-xs text-neutral-400">
                    {p.slug}
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell text-xs text-neutral-400">
                    {p.categoryName ??
                      (p.categoryKey === "cloro"
                        ? "Cloro"
                        : p.categoryKey === "hogar"
                        ? "Hogar"
                        : p.categoryKey === "personal"
                        ? "Cuidado personal"
                        : "-")}
                  </td>

                  <td className="px-4 py-3">
                    ${p.price.toLocaleString("es-CL")}
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell text-sm text-neutral-300">
                    {p.stock ?? 0}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                        p.active
                          ? "bg-emerald-900/40 text-emerald-300"
                          : "bg-neutral-800 text-neutral-400"
                      }`}
                    >
                      {p.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(p)}
                        className="rounded-full border border-neutral-700 px-3 py-1 text-xs hover:border-emerald-500 hover:text-emerald-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleActive(p.id)}
                        className="rounded-full border border-neutral-700 px-3 py-1 text-xs hover:border-amber-500 hover:text-amber-300"
                      >
                        {p.active ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="rounded-full border border-red-500/70 px-3 py-1 text-xs text-red-300 hover:bg-red-950/40"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Formulario de crear/editar */}
      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/60 pt-20">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-5 text-sm shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">
                {formMode === "create" ? "Agregar producto" : "Editar producto"}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                className="text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cerrar ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-neutral-400">
                    Nombre
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      handleFormChange("name", e.target.value)
                    }
                    className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-neutral-400">
                    Slug (url)
                  </label>
                  <input
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      handleFormChange("slug", e.target.value)
                    }
                    className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs text-neutral-400">
                    Categoría
                  </label>
                  <select
                    value={formData.categoryKey ?? ""}
                    onChange={(e) =>
                      handleFormChange(
                        "categoryKey",
                        e.target.value || undefined
                      )
                    }
                    className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-emerald-500"
                  >
                    <option value="">Sin categoría</option>
                    <option value="cloro">Cloro</option>
                    <option value="hogar">Hogar</option>
                    <option value="personal">Cuidado personal</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-neutral-400">
                    Precio
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.price}
                    onChange={(e) =>
                      handleFormChange("price", Number(e.target.value))
                    }
                    className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-neutral-400">
                    Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.stock ?? 0}
                    onChange={(e) =>
                      handleFormChange("stock", Number(e.target.value))
                    }
                    className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-400">
                  Imagen (URL)
                </label>
                <input
                  value={formData.imageUrl ?? ""}
                  onChange={(e) =>
                    handleFormChange("imageUrl", e.target.value)
                  }
                  className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-emerald-500"
                  placeholder="https://…"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-400">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.description ?? ""}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!formData.isFeatured}
                    onChange={(e) =>
                      handleFormChange("isFeatured", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-neutral-700 bg-neutral-950 accent-emerald-500"
                  />
                  <span>Destacado</span>
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!formData.isOnSale}
                    onChange={(e) =>
                      handleFormChange("isOnSale", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-neutral-700 bg-neutral-950 accent-emerald-500"
                  />
                  <span>En oferta</span>
                </label>

                {formData.isOnSale && (
                  <div className="flex items-center gap-2">
                    <span>Descuento (%)</span>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={formData.discountPercent ?? 0}
                      onChange={(e) =>
                        handleFormChange(
                          "discountPercent",
                          Number(e.target.value)
                        )
                      }
                      className="w-20 rounded-md border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  {formMode === "create"
                    ? "Crear producto"
                    : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
