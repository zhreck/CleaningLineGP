'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductGrid from "../../components/products/productGrid";
import OffersCarousel from "../../components/carousel/offersCarousel";
import PriceRangeFilter from "../../components/carousel/priceRangeFilter";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import SkeletonLoader from "../../components/ui/SkeletonLoader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import PerformanceDashboard from "../../components/ui/PerformanceDashboard";
import { usePagination } from "../../lib/usePagination";
import { useInfiniteScroll } from "../../lib/useInfiniteScroll";
import { fetchPaginatedProducts } from "../../lib/productsApi";
import { startPerformanceMonitoring } from "../../lib/performanceBenchmarks";
import type { Product, ProductFilters } from "../../lib/types";
import type { Category } from "../../lib/categoriesApi";
import { getFinalPrice } from "../../lib/price";

type CatalogoClientProps = {
    initialSearchParams?: {
        q?: string;
        cat?: string;
        featured?: string;
        onSale?: string;
        minPrice?: string;
        maxPrice?: string;
    };
    categories: Category[];
};

export default function CatalogoClient({ initialSearchParams, categories }: CatalogoClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Performance monitoring state (development only)
    const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);

    // Parse current search parameters
    const search = searchParams.get('q') || initialSearchParams?.q || '';
    const categorySlug = searchParams.get('cat') || initialSearchParams?.cat || '';
    const onlyFeatured = (searchParams.get('featured') || initialSearchParams?.featured) === '1';
    const onlyOnSale = (searchParams.get('onSale') || initialSearchParams?.onSale) === '1';
    const minPrice = searchParams.get('minPrice') || initialSearchParams?.minPrice;
    const maxPrice = searchParams.get('maxPrice') || initialSearchParams?.maxPrice;

    // Convert category slug to ID for API
    const selectedCategory = categories.find(cat => cat.slug === categorySlug);
    const categoryId = selectedCategory?.id;

    // Create filters object for API
    const filters: ProductFilters = useMemo(() => {
        const result: ProductFilters = {};

        if (search) result.search = search;
        if (categoryId) result.categoryId = categoryId;
        if (onlyFeatured) result.isFeatured = true;
        if (onlyOnSale) result.isOnSale = true;
        if (minPrice && !isNaN(Number(minPrice))) result.minPrice = Number(minPrice);
        if (maxPrice && !isNaN(Number(maxPrice))) result.maxPrice = Number(maxPrice);

        return result;
    }, [search, categoryId, onlyFeatured, onlyOnSale, minPrice, maxPrice]);

    // Initialize pagination hook
    const {
        items: products,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        totalCount,
        loadMore,
        reset,
        retry,
    } = usePagination(fetchPaginatedProducts, 20, filters);

    // Initialize infinite scroll hook
    const sentinelRef = useInfiniteScroll(loadMore, hasMore, isLoading || isLoadingMore);

    // Reset pagination when filters change
    useEffect(() => {
        reset(filters);
        // Load first page with new filters
        loadMore();
    }, [search, categoryId, onlyFeatured, onlyOnSale, minPrice, maxPrice]);

    // Start performance monitoring in development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            const stopMonitoring = startPerformanceMonitoring(30000); // Check every 30 seconds
            return stopMonitoring;
        }
    }, []);

    // Calculate max price for slider (fallback to reasonable default)
    const globalMaxPrice = 10000; // We'll use a reasonable default since we don't have all products

    // Get featured products for carousel (first 4 featured or first 4 products)
    const featuredProducts = useMemo(() => {
        const featured = products.filter((p: Product) => p.isFeatured);
        return featured.length > 0 ? featured.slice(0, 4) : products.slice(0, 4);
    }, [products]);

    // Handle form submission for filters (memoized for performance)
    const handleFilterSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const params = new URLSearchParams();

        const searchValue = formData.get('q') as string;
        const categoryValue = formData.get('cat') as string;
        const featuredValue = formData.get('featured') as string;
        const onSaleValue = formData.get('onSale') as string;
        const minPriceValue = formData.get('minPrice') as string;
        const maxPriceValue = formData.get('maxPrice') as string;

        if (searchValue) params.set('q', searchValue);
        if (categoryValue) params.set('cat', categoryValue);
        if (featuredValue) params.set('featured', '1');
        if (onSaleValue) params.set('onSale', '1');
        if (minPriceValue) params.set('minPrice', minPriceValue);
        if (maxPriceValue) params.set('maxPrice', maxPriceValue);

        router.push(`/catalogo?${params.toString()}`);
    }, [router]);

    // Handle clear filters (memoized for performance)
    const handleClearFilters = useCallback(() => {
        router.push('/catalogo');
    }, [router]);

    return (
        <section className="mx-auto max-w-7xl px-4 py-6 space-y-6">
            {/* Encabezado */}
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold text-foreground">Catálogo</h1>
                <p className="text-base text-foreground">
                    Explora nuestra selección de productos de limpieza.
                </p>
            </header>

            <div className="mt-2 flex flex-col gap-6 md:flex-row">
                {/* SIDEBAR */}
                <aside
                    className="
            hidden md:block
            w-64
            rounded-3xl border border-emerald-200 bg-emerald-50
            p-5 space-y-6 text-sm shadow-md text-emerald-900
            sticky top-24
            max-h-[90vh]
            overflow-y-auto
          "
                >
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                            Filtros
                        </p>
                        <p className="text-xs">
                            Ajusta los filtros para encontrar el producto ideal.
                        </p>
                    </div>

                    <form onSubmit={handleFilterSubmit} className="space-y-5">
                        {/* BUSCAR */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-emerald-800">Buscar</p>
                            <input
                                type="text"
                                name="q"
                                defaultValue={search}
                                placeholder="Ej: cloro..."
                                className="
                  w-full rounded-full border border-emerald-200 bg-white 
                  px-3 py-2 text-sm 
                  placeholder:text-emerald-600
                  outline-none focus:border-emerald-500
                "
                            />
                        </div>

                        <hr className="border-emerald-200" />

                        {/* CATEGORÍAS DINÁMICAS */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-emerald-800">Categoría</p>

                            <div className="flex flex-col gap-2 text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cat"
                                        value=""
                                        defaultChecked={!categorySlug}
                                        className="h-4 w-4 text-emerald-600"
                                    />
                                    Todos
                                </label>

                                {categories.map((cat: Category) => (
                                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="cat"
                                            value={cat.slug}
                                            defaultChecked={categorySlug === cat.slug}
                                            className="h-4 w-4 text-emerald-600"
                                        />
                                        {cat.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <hr className="border-emerald-200" />

                        {/* TIPO */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-emerald-800">Tipo de producto</p>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    value="1"
                                    defaultChecked={onlyFeatured}
                                    className="h-4 w-4 text-emerald-600"
                                />
                                Solo destacados
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="onSale"
                                    value="1"
                                    defaultChecked={onlyOnSale}
                                    className="h-4 w-4 text-emerald-600"
                                />
                                Solo en oferta
                            </label>
                        </div>

                        <hr className="border-emerald-200" />

                        {/* PRECIO */}
                        <PriceRangeFilter
                            maxLimit={globalMaxPrice}
                            initialMaxPrice={maxPrice ? Number(maxPrice) : undefined}
                        />

                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="submit"
                                className="
                  rounded-full bg-emerald-600
                  px-4 py-2 text-xs font-semibold text-white
                  hover:bg-emerald-500 transition
                "
                            >
                                Aplicar filtros
                            </button>

                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="text-xs text-emerald-700 hover:text-emerald-900"
                            >
                                Limpiar
                            </button>
                        </div>
                    </form>
                </aside>

                {/* CONTENIDO PRINCIPAL */}
                <div className="flex-1 space-y-6">
                    {/* Status message */}
                    {!isLoading || products.length > 0 ? (
                        <p className="text-sm text-muted-foreground">
                            {totalCount === 0
                                ? "No se encontraron productos."
                                : `Mostrando ${products.length} de ${totalCount} producto${totalCount === 1 ? "" : "s"}`}
                        </p>
                    ) : null}

                    {/* Error handling */}
                    {error && (
                        <ErrorMessage
                            message={`Error al cargar productos: ${error}`}
                            onRetry={retry}
                        />
                    )}

                    {/* Initial loading state */}
                    {isLoading && products.length === 0 && !error && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-center py-4">
                                <LoadingSpinner size="lg" className="text-emerald-600" />
                                <span className="ml-3 text-sm text-muted-foreground">
                                    Cargando productos...
                                </span>
                            </div>
                            <SkeletonLoader count={8} />
                        </div>
                    )}

                    {/* Content when products are loaded */}
                    {!isLoading || products.length > 0 ? (
                        <>
                            {/* Featured products carousel */}
                            {featuredProducts.length > 0 && (
                                <OffersCarousel
                                    products={featuredProducts}
                                    title="Ofertas y destacados"
                                    subtitle="Selección especial para ti"
                                />
                            )}

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-foreground">
                                    Productos disponibles
                                </h2>

                                {/* Products grid */}
                                {products.length > 0 ? (
                                    <ProductGrid products={products} />
                                ) : !isLoading && !error && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No se encontraron productos
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            Intenta ajustar los filtros o buscar con otros términos.
                                        </p>
                                        <button
                                            onClick={handleClearFilters}
                                            className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                                        >
                                            Limpiar filtros
                                        </button>
                                    </div>
                                )}

                                {/* Infinite scroll sentinel and loading more indicator */}
                                {hasMore && products.length > 0 && (
                                    <div ref={sentinelRef} className="flex justify-center py-6">
                                        {isLoadingMore && (
                                            <div className="flex items-center space-x-2">
                                                <LoadingSpinner size="sm" className="text-emerald-600" />
                                                <span className="text-sm text-muted-foreground">
                                                    Cargando más productos...
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* End of results message */}
                                {!hasMore && products.length > 0 && (
                                    <div className="flex justify-center py-6">
                                        <div className="text-center">
                                            <svg className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <p className="text-sm text-muted-foreground">
                                                Has visto todos los productos disponibles
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>

            {/* Performance Dashboard (development only) */}
            {process.env.NODE_ENV === 'development' && (
                <PerformanceDashboard
                    isVisible={showPerformanceDashboard}
                    onToggle={() => setShowPerformanceDashboard(!showPerformanceDashboard)}
                />
            )}
        </section>
    );
}